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
				this.parentElement.querySelector('.content')[0].addEventListener('scroll',this.onParentScroll);
			}
        };

		proto.onParentScroll = function (e) {
			console.log('test');
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
		}
        document.registerElement('mobile-header', {prototype: proto});
    }
}
