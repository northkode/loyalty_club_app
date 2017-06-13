require('./mobile-header.scss');
export default class MobileHeader {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/mobile-header.tpl'));
            this.innerHTML = this.template(this.data);
        };
        proto.readAttributes = function() {
            this.data.titleIsImage = this.getAttribute("title-image");
            this.data.icon = this.getAttribute("icon");
            this.data.title = this.getAttribute( "title" );
            this.data['menu-text'] = this.getAttribute("menu");
			this.data.showTip = this.getAttribute("show-tip");
			if(this.getAttribute('scroll-detect') != undefined){
				this.continuous = true;
				requestAnimationFrame(this.onParentScroll.bind(this));
			}
        };

		proto.onParentScroll = function(e) {
			if(this.parentElement){
				var color = this.querySelector('mobile-header .colorbg');
				var text = this.querySelector('mobile-header .title');
				var content = this.parentElement.querySelector('.content');
				var scrollTop = content.scrollTop;
				var scrollamount = (scrollTop / (content.scrollHeight-window.innerHeight)) * 100 // get amount scrolled (in %)
				color.style.opacity = (scrollamount * 2) / 100;
				text.style.opacity = (scrollamount * 2) / 100;
				if(this.continuous == true){
					requestAnimationFrame(this.onParentScroll.bind(this));
				}
			}
		};

        proto.attributeChangedCallback = function( attrName, oldVal, newVal ) {
            this.readAttributes();
            this.updateTemplate();
        };
        proto.updateTemplate = function(){
            this.innerHTML = this.template(this.data);
        };
		proto.detachedCallback = function(){
			this.data = null;
			this.template = null;
			this.continuous = false;
		}
        document.registerElement('mobile-header', {prototype: proto});
    }
}
