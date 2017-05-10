export default class TipHelper {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/tip-helper.tpl'));
            this.innerHTML = this.template(this.data);
			this.onclick = this.onClicked.bind(this);
        };
		proto.onClicked = function (e){
			if(this.data['big-assistant'] !== null){
				new UserAssistant([{
	                title: "Tip",
	                message: this.data.text,
	                buttonLabel: "OK"
	            }]).show(0);
			} else {
				var tip = $('<tip-tooltip tip="'+this.data.text+'" x="'+e.pageX+'" y="'+(e.pageY + 10)+'"></tip-tooltip>');
				$('body').append(tip);
			}
		};
        proto.readAttributes = function() {
            this.data.text = this.getAttribute("text");
            this.data['big-assistant'] = this.getAttribute("big-assistant");
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
			this.onclick = null;
		}
        document.registerElement('user-tip', {prototype: proto});
    }
}
