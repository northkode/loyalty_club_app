/**
 * Created by kjeske_imac on 15-11-15.
 */

import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";

class DefaultAppView {
	constructor(route, viewData={}) {
		var contentParams = route.parameters;
		this.contentClass = null;
		this.template = null; // overwritten but the extended class

		if(viewData instanceof State) {
			this.restoreState(viewData);
		}else{
			this.viewData = viewData; // data that is used to overwrite variables in the template
		}
		this.params = _.isEmpty(contentParams) ? undefined : contentParams;
		this.hasParams = this.params != undefined; //dont think we need this anymore
		this.viewLoaded = false;
		this.listeners = [];
		this.overlayMode = false;
		this.overlays = [];
		this.currentOverlay = null;
		this.altMenu = null;
        this._bindingMap = null;
        this._serviceCalls = [];
        this.clearAfterClose = false;
		this._delayCalls = [];

		// this views route object
		this.route = route;
		this._state = 'pending';
		this._processId = (++mobileApp.viewProcessId);

	}

	restoreState(state) {
		this.viewData = state.getState();
	}

	setOverlayMode (value) {
		this.overlayMode = value;
	};

	mode() {
		return (this.overlayMode) ? 'overlay' : 'default';
	};

	/**
	 * if there is an overlay that pops up while we are
	 * active then it registers itself to us as this view is now its parent
	 **/
	registerOverlay (view) {
		this.currentOverlay = view;
        view.getParentView = () => { return this; };
		this.overlays.push(view);
		this.setOverlayMode(true);
		this.currentOverlay.addEventListener('overlayClosed', this.onSubOverlayClosed.bind(this));
	};

	/**
	 * called from the browser back button and we are in overlay mode
	 * in the context of the overlay not the parent view
	 * **/
	closeOverlay () {
		this.currentOverlay.closeView();
	};

	/**
	 * overlay is closed so lets remove the listener and resume the app
	 * called in context of parent view
	 * @param e
	 */
	onSubOverlayClosed (e) {
		e.target.removeAllEventListeners();
        console.log("On Close Overlay",e.target);
		var index = this.overlays.indexOf(e.target);
		this.overlays.splice(index, 1);
        if(this.overlays.length){
            this.currentOverlay = this.overlays[this.overlays.length-1];
        }else{
            this.setOverlayMode(false);
            this.currentOverlay = null;
        }
	};

	/**
	 * setup all the view variables and options here
	 */
	/**
	 * setup all the view variables and options here
	 */
	init() {
		this._state = "initializing";
		// preregister any dom relatated dynamic listeners here
		this.attachListeners();
		// render the view content from the template and data
		if (this.hasParams) {
			if (this.handleSubRoute(this.route)) { this.renderView(); }
		} else {
			this.renderView();
		}
	};

	renderView (replaceContent = false) {
		this._state = "rendering";
		var content;
        var domKey = `[data-process-id='${this._processId}']`;

        // runs a content replacement routine and animates the title to the new page title
		if (replaceContent) {
			var template = $(this.template(this.viewData));
			content = template.find('.content');
			$(domKey + " .content").replaceWith(content);
			$(domKey + 'mobile-header').attr('title',template.find('mobile-header').attr('title'))
			template = null;
		} else {
            var appContent = $('.application-content');
			content = $(this.template(this.viewData)).attr("data-process-id", this._processId);
            content.css('z-index',this._processId);
			appContent.append(content);
		}

        if ( this.viewLoaded ) return;
		// delay handle view state by 2 millseconds so that the dom is ready for jquery manipulation
        content.ready(()=> { this.handleViewState(); });
	};

	refreshView () {
		var template = $(this.template(this.viewData));
		var content = template.find('.content');
        this.getViewInstance().find(".content").replaceWith(content);
	};

	// put all javascript and jquery dom manipulation in here for this view
	// fires when the content template is loaded and put into the dom
	handleViewState () {
		this._state = "dom_init";
        // cache this for now
        this._viewInstance = $(`[data-process-id='${this._processId}']`);

        if (window.cordova && cordova.platformId == 'android') {
			if (this.altMenu) {
				$('.alt-menu').AltMenu({menu: this.altMenu});
			}
		}

        // fix for weird browser resize on android
        // keyboard focus should scroll to item
        if(window.cordova && window.cordova.platformId == 'android'){
            this.getViewInstance().css('min-height',document.body.clientHeight+"px");
        }

        this.viewLoaded = true;
        this._state = "ready";

        // dom needs the setTimeout in order to have enough time to render itself
        setTimeout(function(){
            var event = new Event(MobileEvents.VIEW_READY);
            this.dispatchEvent(event);
        }.bind(this),1);
	};

	// attach all listeners for this view here
	attachListeners () {
		this.proxy = $.proxy(this.onWindowResize, this);
        this.registerListener('tap', this.onBackClicked, "mobile-header .backBtn", this);
		// called when there is a sub route for the page and the content has finished fading out
		$.subscribe('app/resize', this.proxy);

		this.onAltMenuSelectedProxy = $.proxy(this.onAltSelected, this);
		$.subscribe('app/altmenu/selected', this.onAltMenuSelectedProxy);
	};

	onAltSelected (event, item) { };

	onBackClicked () {
		console.warn("Tap the back")
        mobileApp.goBack();
    };

    // called from the mobile app after the native transition is finished
    transitionFinished(){
        if(this._state != 'ready') return;
        if(this.mode() == 'overlay' && this.overlays.length){
            this.currentOverlay.transitionFinished();
        }
    };

// load the data for the view returns a promise object to handle the data load events locally
	loadData(url, dataParams) {
		var promise = $.ajax({
			url: url,
			dataType: 'json',
			data: dataParams
		});
		return promise;
	};

	viewDataLoaded(data) {
		this.viewData = {data: data}; // this is for the template. it renders out the data
		this.renderView();
	};

	registerListener (event, func, dom) {
		var proxyFunc = $.proxy(func, this);
        $(document).on(event, `[data-process-id='${this._processId}'] ${dom}`, proxyFunc);
		this.listeners.push({proxy: proxyFunc, event: event, dom: dom});
		proxyFunc = null;
	};

	closeView() {
		this._state = "closing";
        // if we are transitioning out and we still have an overlay over top of us
        // then transition that out instead and hide ourselves and wait for a overlayClosed event and continue with cleanup
        if(this.mode() == 'overlay' && this.overlays.length){
            this.currentOverlay.closeView();
			this.cleanup();
        } else if(this.mode() == 'overlay' && this.getParentView() != undefined){ // we are an overlay and we are closing
            var options = { 'direction' : 'down', "iosdelay" :  400, "androiddelay" :  400, "fixedPixelsBottom":0 };
            window.plugins.nativepagetransitions.slide(
                options,
                function (msg) {}, // called when the animation has finished
                function (msg) {mobileApp.alert("error: " + msg)} // called in case you pass in weird values
            );
            setTimeout(() => {  this.cleanup(); },500);
        }else{
            this.cleanup();
        }

	};

    _registerServiceCall(service) {
        this._serviceCalls.push(service);
    }

    _unRegisterServiceCall(service) {
        var index = this._serviceCall.indexOf(service);
		if(index == -1) return;
        this._serviceCall.splice(index,1);
    }

    enable() {
		try {
			this.getViewInstance().css('z-index',this._processId);
			this.getViewInstance().css('pointer-events','');
			this.getViewInstance().css('display','');
		}catch(e){
			Raven.captureException(e);
		}
	}

    disable() {
		try {
			this.getViewInstance().css('z-index','0');
			this.getViewInstance().css('pointer-events','none');
			this.getViewInstance().css('display','none');
		} catch(e) {
			Raven.captureException(e);;
		}
    };

	getState() {
		return this.viewData;
	}

	saveState() {
		return this.getState();
	}

	cleanup() {
		this._state = "cleaning";

		if (this.overlayMode) {
			var event = new Event("overlayClosed");
			this.dispatchEvent(event);
		}

		// if we are a overlay let the parents no we are closing
		$.unsubscribe('app/resize', this.proxy);
		$.unsubscribe('app/altmenu/selected', this.onAltMenuSelectedProxy);
		this.proxy = null;

        for ( var i = 0; i < this._serviceCalls.length; i++ ){ this._serviceCalls[i].abort(); }
        this._serviceCalls = [];

		for ( i = 0; i < this._delayCalls.length; i++ ){ clearTimeout(this._delayCalls[i]); }
		this._delayCalls = [];

		try {
			if (this.altMenu) {
				$('.alt-menu').data('plugin_AltMenu').cleanup();
			}
		} catch (e) { }

		this.clearAllListeners();
		this.viewData = null;
		this.overlays = [];
		this.currentOverlay = null;
		this.template = null;
		//memory leak help, clean up jquery events and data for this html node
		this.getViewInstance().removeData();
		this.getViewInstance().empty().remove();
        this._viewInstance = null;
	};

	clearAllListeners() {
		for (var i = 0; i < this.listeners.length; i++) {
			var l = this.listeners[i];
			$(document).off(l.event, l.dom, l.proxy);
			this.listeners[i] = l = null;
		}
		this.listeners = null;
	};

	runViewAnimation () { };

	// handle the sub routes if need be
	handleSubRoute(routeObj) {
		this.oldRoute = _.clone(this.currentRoute);
		this.routeDiff = Utils.getObjectDiff(this.oldRoute, routeObj.parameters);
		if (this.overlayMode && this.currentOverlay) {
			// pass the params to the overlay route
			this.currentOverlay.handleSubRoute(routeObj);
		} else {
			this.currentRoute = routeObj;
		}
		return true;
	};

	onWindowResize(data, height) {
		//$('.application-content').css({'height': window.innerHeight});
	};

	toString() { return "[Class DefaultView]"; };

	getViewInstance() {
		return this._viewInstance || $(`[data-process-id='${this._processId}']`);
	};

	$setTimeout(func,time){
		this._delayCalls.push(setTimeout(func,time));
	}

	updateNotificationCounts() { };
}

EventDispatcher.initialize(DefaultAppView.prototype);

export default DefaultAppView;
