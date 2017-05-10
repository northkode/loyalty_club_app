export default class ProfileImage {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/profile-image.tpl'));
            this.innerHTML = this.template(this.data);
        };
        proto.readAttributes = function() {
            var layout = this.getAttribute('layout');
            var rating = this.getAttribute('ratingValue');
            this.data.image = this.getAttribute("image");
            this.data.name = this.getAttribute('name');
            this.data.noLabel = this.getAttribute('no-label') !== null;
            this.data.showRating = this.getAttribute('showRating') !== null;
            if(this.getAttribute('company') !== null){
                this.data.company = this.getAttribute('company');
            }
            if(this.getAttribute('location') !== null){
                this.data.location = this.getAttribute('location');
            }
            this.data.ratingValue = rating;
            this.data.layout = (layout !== null ) ? layout : 'portrait';
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
        document.registerElement('profile-image', {prototype: proto});
    }
}
