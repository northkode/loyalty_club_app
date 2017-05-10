
export default class Rating {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/user-rating.tpl'));
            this.innerHTML = this.template(this.data);
        };
        proto.readAttributes = function() {
            this.data.value = this.getAttribute("value");
            this.data.reviews = this.getAttribute('reviews');
            if(this.getAttribute('no-count') !== null){
                this.data.noCount = true;
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
		}
        document.registerElement('user-rating', {prototype: proto});
    }
}
