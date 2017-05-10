/**
 * Created by kjeske_imac on 15-11-15.
 */
require('../scss/styles.scss');

import "../utils/pub_sub";
import "../utils/jquery.browser";
import "../utils/Tocca";
import underscore from "../utils/underscore-min";
window._ = underscore;
import "../utils/jquery.address-1.5.min";
import "../utils/jquery.scrollto";
import "../utils/jquery.debounce";
import "../utils/jquery.hammer";

import "./State";
import "./FileSystem";
import "../utils/Utils";
import "../events/MobileEvents";
import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";

import StateManager from "./StateManager";
import AppSettings from "./AppSettings";
import NotificationManager from "../managers/NotificationManager";
import PushNotification from "../managers/PushNotifications";
import UserManager from "../managers/UserManager";

// custom elements for mobile markup components
import CustomElementManager from "../managers/CustomElementManager";

class MobileApp {
    constructor(settings) {
        new CustomElementManager(); // creates all the custom HTML elements for the mobile app

        this.settings = settings;
        // used to manage what social media login account
        // we are using
        this.AuthSession = {};
        this.appReady = false;

        // used to manage view process id's
        this.viewProcessId = 0;
        this._history = []; // cache certain views depending on their position in the history chain
        this.isTransitionBack = false;

        // user status for application logic
        this.userStatus = "unknown";

        // set to true if we dont want to have a route change based on a new url hash
        this.ignoreStateChange = false;

        // set the global scope of variables for underscore template to make them faster
        _.templateSettings.variable = "rc";

        this.currentPage = '';

        // dynamic loading system to allow for quick clicks between section
        this.viewWaiting = [];

        // build out the application template html
        var applicationTemplate = _.template(require('../templates/application.tpl'));

        this.applicationHTML = $(applicationTemplate());
        this.applicationHTML.appendTo('body'); // add template to do

        this.pn = new PushNotification();
        this.nm = new NotificationManager();
        this.um = new UserManager();
        this.um.addEventListener('userProfileChange', this.onUserProfileChange.bind(this), false);

        document.addEventListener("pause", this.onAppPause.bind(this), false);
        document.addEventListener("resume", this.onAppResume.bind(this), false);
        document.addEventListener("menubutton", this.onSystemMenuButton.bind(this), false);
        document.addEventListener("backbutton", this.onBackKeyDown.bind(this), false);
        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('cordova-plugin-memory-alert.memoryWarning', this.onMemoryWarning.bind(this), false);

        $(document).on('touchstart', '.systemButton', function(e) {
            $(this).addClass('tapped');
        });
        $(document).on('touchend', '.systemButton', function(e) {
            $(this).removeClass('tapped');
        });

		// start local settings
		this.localSettings = new AppSettings();
		var promise = this.localSettings.init();
		promise.done(() => { this.init(); });
    }

    onMemoryWarning(e) {
        console.log('received a memory warning');
        Raven.captureException(e);;
    }

    init() {
		if(window.cordova && cordova.plugins && cordova.plugins.CordovaPluginMemoryAlert){
			cordova.plugins.CordovaPluginMemoryAlert.activate(true);
		}

		// create state manager instance
		this.sm = new StateManager();

		// resize on load so the app is ready
        this.resize();
        // listen for when a user opens a notification
        $.subscribe('app/pushnotification/opened', this.onNotificationOpened.bind(this));
        // listen for when the app receives a notification
        $.subscribe('app/pushnotification/received', this.onNotificationReceived.bind(this));

        if (this.localSettings.getItem('devmode') == 'true') {
            window.plugins.toast.showShortBottom('Dev mode activated', function(a) {}, function(b) {});
            $('.app').addClass('devmode');
        }

        if (navigator.notification) {
            this.alert = navigator.notification.alert;
            this.confirm = navigator.notification.confirm; // message, confirmCallback, [title], [buttonLabels]
        }

        window.addEventListener('native.keyboardshow', this._keyboardShowhandler);
        window.addEventListener('native.keyboardhide', this._keyboardShowhandler);
    }

    _keyboardShowhandler(e) {

        if (window.cordova.platformId != 'android') return;

        var element = document.activeElement;
        var type = element.type;
        var targetScroll = $('.wrapper');

        if (element.hasAttribute('data-ignore-keyboard')) return;

        if (e.type == 'native.keyboardshow') {
            if (type == "textarea" || type == "text" || type == "email" || type == "password" || type == 'tel' || type == 'url') {
                var diff = (document.documentElement.clientHeight - element.getBoundingClientRect().bottom) - e.keyboardHeight;

                if (diff < 10) {
                    var offset = (element.hasAttribute('data-keyboard-offset')) ? Number(element.getAttribute('data-keyboard-offset')) : 0
                    targetScroll.css("transform", "translateY(" + Math.min(-80 - offset, diff) + "px)");
                }
            }
        } else if (e.type == 'native.keyboardhide') {
            targetScroll.css("transform", "");
        }
    }

    /**
     * history
     * @returns {{history: Array, prev}}
     */
    get history() {
        return {
            history: this._history,
            prev: function() {
                return this._history[this._history.length - 1]
            }.bind(this),
            find: function(hash) {
                return this._history.filter(history => {
                    return (history.label == hash);
                })
            }.bind(this)
        }
    }

    onAppResume() {
        this.isPaused = false;
        $.publish('app/status', ['resume']);
    };

    onAppPause() {
        this.isPaused = true;
        $.publish('app/status', ['paused']);

		this.sm.saveState();
    };

    onBackKeyDown(e) {
        var e = new Event(MobileEvents.BACK_BUTTON, true, true);
        if (this.dispatchEvent(e)) {
            mobileApp.goBack();
        }
    };

    onSystemMenuButton() {
        var e = new Event(MobileEvents.SYSTEM_MENU, true, true);
        if (this.dispatchEvent(e)) {
            this.goHome();
        }
    };

    setupRouting() {
        // Init and change handlers
        setTimeout(() => {
            this.generateDeviceClasses();
        }, 200);

		if(navigator.connection){
			var connection = this.checkNetworkConnection();
	        if (connection == Connection.UNKNOWN || connection == Connection.NONE) {
	            window.location = "index.html#nointernet";
	        }
		}

        $.address.bind('change', this.applicationRouteChanged.bind(this));
        this.onApplicationReady();
    };

    checkNetworkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        return states[networkState];
    }

    getRouteVal() {
        var str = "#" + $.address.value().substring(1);
        if (str.indexOf("?") != -1) {
            return str.substring(0, str.indexOf('?'));
        } else {
            return str;
        }
    };

    applicationRouteChanged(event) {
        // ignore the state change
        if (this.ignoreStateChange) {
            this.ignoreStateChange = false;
            return false;
        }

        var route = {
            value: this.getRouteVal(),
            path: $.address.path(),
            pathNames: $.address.pathNames(),
            parameterNames: $.address.parameterNames(),
            parameters: _.isEmpty(event.parameters) ? undefined : event.parameters,
            queryString: $.address.queryString(),
            isFromBack: this.isTransitionBack
        };

        this.isTransitionBack = false; // reset
        if (route.value == '#' || route.value == '/') {
            route.value = '#home';
        }

        console.log('route changed', event);

		var analytics = navigator.analytics;
		if(analytics){
			analytics.sendAppView(route.value, ()=>{}, ()=>{});
		}

        // if the old view we just left was an overlay and the new route we are going is the parent of the overlay
        // then ignore this application change.. otherwise go to the new overlay

        // check if the old url change was from a overlay and if so then ignore this change cause
        // overlays handle there own url change
        if (event.hasOwnProperty('old')) {
            if (event.old.indexOf('!') != -1 && this.currentView.route.path == event.path) {
                this.currentView.closeOverlay();
                this.currentPage = this.currentView.route.path;
                this._history.pop(); // remove the last history cause we are in the view
                return true;
            }
        }

        // extract the overlay path name
        var isOverlay = route.path.indexOf("!overlay") != -1;
        if (isOverlay) {
            route.path = route.path.split('!')[0];
            route.overlay = true;
        }

        // if the path is the same but there is route params then we are going to be doing a sub route of a page.
        // examples would be product page, then a product details page #products/{product-id}
        console.log("changing application state", route.path);
        if (route.path == '/') return;

        var isSubRoute = this._checkHandleSubRoute(route);

		var direction = (route.isFromBack) ? 'right' : 'left';
		var promise = this.createSnapShot({
			'direction': direction,
			"iosdelay": -1,
			"androiddelay": -1,
			"fixedPixelsBottom": 0
		});

		promise.done(()=>{
			if (this.currentView) {
				this.currentView.disable(); // disable the view, use this function to stop processor intensive tasks now that we are moving on
				this.currentView.removeAllEventListeners();
			}
			if (!route.isFromBack && this.currentView && !this.currentView.clearAfterClose && !isSubRoute) {
				// if we are going forward and the view is not in overlay mode
				// then add it to the history for caching
				this._history.push({
					label: event.old,
					viewInstance: this.currentView
				});
			} else if (route.isFromBack && this.currentView && !isSubRoute && !route.overlay) {
				for (var i = 0; i < this._history.length; i++) {
					var historyView = this._history[i];
					if (historyView && historyView.label == event.current) {
						this.currentPage = route.path;
						var options = {
							viewInstance: historyView.viewInstance,
							path: null,
							classFile:null,
							route:route,
							data:null,
							animateView: this.animateView
						}
						this.loadContent(options);
						this._history.splice(i, 1);
						return true;
					}
				}
			}
			if (this.currentView && isSubRoute) {
				// pass the route params to the current view so it can handle it itself
				this.currentView.handleSubRoute(route);
			} else { // otherwise we are changing views so unload and load the next one on;
				this.currentPage = route.path;
				if (StateManager.getState(route.path) == undefined) return true;
				var options = {
					viewInstance: null,
					path: route.path,
					classFile:StateManager.getState(route.path),
					route:route,
					animateView: this.animateView,
					data:(this.currentViewData instanceof State) ? this.currentViewData.clone() : (this.currentViewData != null) ? JSON.parse(JSON.stringify(this.currentViewData)) : undefined
				}
				this.loadContent(options);
			}

		});


        return true;
    }

    /**
     * _checkHandleSubRoute
     * @param route
     * @returns {*}
     * @private
     */
    _checkHandleSubRoute(route) {
        // if we have more then one path ie section/subsection
        if (route.pathNames.length > 1) {
            return true;
        } else {
            var currentPath = route.pathNames[0].split('!')[0];
            return this.currentPage.indexOf(currentPath) != -1 || (this.currentView && this.currentView.mode() == 'overlay' && this.currentView.route.path.indexOf(route.pathNames[0].split("!")[0]) != -1)
        }
    }

    loadContent(options) {
		var viewInstance = options.viewInstance;
		var classFile = options.classFile;
		var route = options.route;
		var viewData = options.data;
		var url = options.path;
		var animateView = options.animateView;

        var promise;
        var payload = {
            viewInstance: viewInstance,
            'class': classFile,
            'route': route
        };
        if (this.pageLoading) {
            this.viewWaiting.shift(); // remove the last;
            this.viewWaiting.push(payload);
        } else {
            this.pageLoading = true;
            if (this.currentView == undefined) {
                this.viewWaiting.push(payload);
				this.onViewLoaded(classFile,route,viewData);
                //require([classFile], Utils.createContentProxy(this, this.onViewLoaded, route, viewData));
            } else {
                if (route.overlay) {
                    promise = this.createSnapShot({
                        'direction': 'up',
                        "iosdelay": -1,
                        "androiddelay": -1,
                        "fixedPixelsBottom": 0
                    });
                    promise.done(() => {
                        setTimeout(() => {
							this.showContentOverlay(classFile,route,viewData);
                            //require([classFile], Utils.createContentProxy(this, this.showContentOverlay, route, viewData));
                        }, 40);
                    });
                } else {

                    // only clean up the previous view if we are moving back in the history
                    // otherwise we cache the view in memory for a bit
                    this.previousView = (route.isFromBack || this.currentView.clearAfterClose) ? this.currentView : null;
                    // load new view
                    this.viewWaiting.push(payload);
					setTimeout(() => {
						if (viewInstance) { // if we are using a cached instance
							this.pageLoading = false;
							this.viewWaiting.shift();
							this.currentView = viewInstance;
							this.currentView.enable(); // reenable the view now that we are using it from the cache
							this.transitionProxyFunction(this.currentView, this.previousView, false)();
							this.currentViewData = null;
							this.previousView = null;
						} else {
							this.onViewLoaded(classFile,route,viewData);
							//require([classFile], Utils.createContentProxy(this, this.onViewLoaded, route, viewData));
						}
					}, 40);
                }
            }
        }
    };

    // new view has loaded
    onViewLoaded(viewClass, route, viewData) {
		console.log(viewClass,route);
        this.viewWaiting.shift(); // remove the last added view that was waiting for load
        if (this.viewWaiting.length == 0) {
            this.pageLoading = false;
            this.currentView = new viewClass(route, viewData);
            this.currentView.addEventListener(MobileEvents.CREATE_NEW_VIEW, this.onCreateNewViewInstance.bind(this));
            this.currentView.addEventListener(MobileEvents.VIEW_READY, this.transitionProxyFunction(this.currentView, this.previousView));
            this.currentView.init();
			setTimeout(()=>{
				var event = new Event("VIEW_STARTING");
				event.view = this.currentView;
				mobileApp.dispatchEvent(event);
			},1);

        }
        this.previousView = null;
        this.currentViewData = undefined;
    };

    // if we are a overlay then this is called once the view is loaded..
    showContentOverlay(viewClass, route) {
        this.pageLoading = false;
        // create a new view with the Overlay Mode as true
        var tempView = new viewClass(route, this.currentViewData);
        tempView.setOverlayMode(true); // make sure to set overlay
        tempView.addEventListener(MobileEvents.CREATE_NEW_VIEW, this.onCreateNewViewInstance.bind(this));
        tempView.addEventListener(MobileEvents.VIEW_READY, this.transitionProxyFunction(tempView, null));
        tempView.init();
        this.currentViewData = undefined;
        // register the current overlay with the current view
        this.currentView.registerOverlay(tempView);
        tempView = null;
    };

    // force the creation of a new view
    // some views dont want to have handleview state handle the content creation
    // and they jsut want a duplicate of the same view with just different data
    onCreateNewViewInstance(e) {
        var route = e.route;
        this.previousView = this.currentView;
        this.currentPage = route.path;
        var url = route.path;
        var classFile = StateManager.getState(url)
        this.viewWaiting.push({
            'class': classFile,
            'route': route
        });
        //require([classFile], Utils.createContentProxy(this, this.onViewLoaded, route, e.viewData));
        this.onViewLoaded(classFile,route,e.viewData);
    };

    transitionProxyFunction(view, previousView, transition = true) {
        return function() {
            this.showCurrentView(view, previousView, transition);
        }.bind(this)
    }

    // forces a route event and changes the application state
    changeApplicationState(state, options = {}) {
        this.ignoreStateChange = (options.hasOwnProperty('ignoreStateChanges')) ? options.ignoreStateChanges : false;
        var isOverlay = (options.hasOwnProperty('overlay')) ? options.overlay : false;
        this.currentViewData = (options.hasOwnProperty('viewData')) ? options.viewData : undefined;
		this.animateView =  (options.hasOwnProperty('animate')) ? options.animate : true;

        // if we are clearing cache then lets do that now
        if (options.hasOwnProperty('clearCache') && options.clearCache) {
            try {
                for (var i = 0; i < this._history.length; i++) {
                    var historyState = this._history[i];
					try {
						historyState.viewInstance.disable();
						historyState.viewInstance.closeView();
					}catch(e){
						if(window.Raven) {
							Raven.captureException(e);
						}

					}
                }
            } catch (e) {
                console.log('clearing cache failed: ', e);
                if(window.Raven) Raven.captureException(e);;
            }
            this._history = [];
        }

        // causing a bug.. will work on it later
        if (options.hasOwnProperty('fromBack')) {
            //this.isTransitionBack = true;
        }

        state = (isOverlay) ? state + "!overlay" : state;
        if (this.ignoreStateChange) {
            history.replaceState(undefined, undefined, state);
            return;
        }
        window.location.replace(state);
    };

    createSnapShot(options) {
        var p = $.Deferred();
		options.duration = 300;
		options.slowdownfactor = 30;
		//options.slidePixels = 10;
		if(window.plugins && window.plugins.nativepagetransitions) {
	        window.plugins.nativepagetransitions.slide(
	            options,
	            function(msg) { p.resolve(true); }, // called when the animation has finished
	            function(msg) {
	                mobileApp.alert("error: " + msg);
	            } // called in case you pass in weird values
	        );
		}else{
			p.resolve(true);
		}
        return p;
    };

    /**
     * onShowCurrentView
     * @description called from the the READY event, starts the native transition
     */
    showCurrentView(view, previousView, transitionFinished = true) {
		console.warn('show snap shot')
		if(window.plugins && window.plugins.nativepagetransitions) {
			window.plugins.nativepagetransitions.executePendingTransition(() => {}, (msg) => {});
		}
        // hide the previous view and call cleanup
        // use a closure function here to help map the previous view so i can just nullify it
        setTimeout(() => {
            if (previousView) { previousView.closeView(); }
            previousView = null;
        }, 10);

        // notify the view that the current transition animation is done
        // typically views wait for this to run any dom maniuplation tasks
        setTimeout(() => {
            if (transitionFinished) {
                view.transitionFinished();
                var event = new Event("VIEW_LOADED");
                event.view = view;
                mobileApp.dispatchEvent(event)
            }
        }, 600);
    };

    /**
     * onNotificationOpened
     * @param event
     * @param notification
     */
    onNotificationOpened(event, notification) {
        if (this.localSettings.getItem('token') != undefined) {
            mobileApp.api.token = this.localSettings.getItem('token')
        }
        /*var e = new Event(MobileEvents.NOTIFICATION_OPENED,false,true);
        e.notification = notification;
        console.log('notification opened',notification);
        // other views need to know there is a notification
        // event, and have the option of stopping the notification manager
        // from showing it to the user, ex: Comments View
        if ( this.dispatchEvent(e) ) {
        	if ( notification.hasOwnProperty('urlHash') ) {
        		var options = {viewData: notification};
        		mobileApp.changeApplicationState(notification.urlHash,options);
        	}
        }*/
    };

    /**
     * onNotificationReceived
     * @param event
     * @param notification
     */
    onNotificationReceived(event, notification) {
        console.log("Notification", notification);
        // save the notification
        var e = new Event(MobileEvents.NOTIFICATION_RECEIVED, false, true);
        e.notification = notification;
        // other views need to know there is a notification
        // event, and have the option of stopping the notification manager
        // from showing it to the user, ex: Comments View
        this.nm.addNotification(notification);
    };

    handleOpenActions() {
        // now run the action that the user clicked
     	try {
			if (this._appOpenedActions.length) {
	            this._appOpenedActions[0](); // run action now
	            this._appOpenedActions = [];
	        }
		}catch(e){}
    }

	hasNotificationActions(){
		return this._appOpenedActions.length > 0;
	}

    onApplicationReady() {
        this.appReady = true;
        $('.application-content')[0].addEventListener('touchstart', this.checkApplicationClick, true);
    };

    checkApplicationClick(e) {
        var menuIcon = $('.hamburger');
        if (menuIcon.length > 1) {
            menuIcon = menuIcon[1];
        } else {
            menuIcon = menuIcon[0];
        }
        if ($('body').hasClass('menu-open') && !$.contains(menuIcon, e.target)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onUserProfileChange(event) { }

    goBack() {
        if (this._history.length) {
            this.isTransitionBack = true;
            var state = this.history.prev();
            this.changeApplicationState("#" + state.label);
        } else {
            /*mobileApp.confirm("Are you sure you want to exit TradePros", (btn) => {
                if (btn == 1) {
                    navigator.app.exitApp();
                }
            }, 'Exit TradePros')*/
        }
    }

    get currentUser() {
        return mobileApp.um.currentUser;
    }

    // show 404 page
    pathNotFound() {
        console.log('no path defined');
    };

    // default loadData factory call for the application
    loadData(url, data) {
        return $.ajax(url, {
            dataType: 'json'
        });
    };

    isMobile() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        if ($(window).width() <= this.settings.desktopMinSize) {
            check = true;
        }
        return check;
    };

	isMini() {
        return window.screen.availHeight < 490;
    }

    isSmallDevice() {
		if(this.device == 'android'){
			if(window.screen.availHeight != window.innerHeight) {
				return window.innerHeight < 600;
			}
		}
        return window.screen.availHeight < 600;
    }

    isPlusDevice() {
		if(this.device == 'android'){
			if(window.screen.availHeight != window.innerHeight) {
				return window.innerHeight > 667;
			}
		}
        return window.screen.availHeight > 667;
    }

    generateDeviceClasses() {
        var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
        var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
        var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
        if (isiPhone) {
            this.device = 'iPhone';
            $('html').addClass('iPhone');
        } else if (isiPad) {
            this.device = 'iPad';
            $('html').addClass('iPad');
        } else if (isAndroid) {
            this.device = 'android';
            $('html').addClass('android');
            if (window.innerHeight <= 615) {
                $('html').addClass('android-small');
            }
        } else {
            this.device = 'computer';
            $('html').addClass('computer');
        }
        if (this.isSmallDevice()) {
            $('html').addClass('small-device');
        }
        if (this.isMini()) {
            $('html').addClass('mini-device');
        }
        var phoneClass = window.getComputedStyle(document.querySelector('html'), ':before').getPropertyValue('content');
        $('html').addClass(phoneClass);
        if (this.device != 'iPad' && window.cordova) {
            screen.lockOrientation('portrait');
        }
    };

    resize() {
        var $window = $(window);
        var height = $window.height();
        $.publish('app/resize', [height]);
    };

    handleOpenURL(url) {

    }

}

EventDispatcher.initialize(MobileApp.prototype);
export default MobileApp;
