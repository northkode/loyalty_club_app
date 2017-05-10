export default class TabBar {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/tab-bar.tpl'));
            this.innerHTML = this.template(this.data);
        };
        proto.readAttributes = function() {
            this.data.tabs = this.getAttribute("tabs").split(',');
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
        document.registerElement('tab-bar', {prototype: proto});
    }
}
