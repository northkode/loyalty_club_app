export default class TipToolTip {
    constructor(){
        var proto = Object.create(HTMLElement.prototype);
        proto.data = {};
        proto.createdCallback = function() {
            this.data = {};
            this.readAttributes();
            this.template = _.template(require('../../templates/custom_elements/tip-tooltip.tpl'));
            this.innerHTML = this.template(this.data);
			this.onclick = this.onClicked.bind(this);
			setTimeout( ()=> {
				this.updatePosition();
			},1);
        };

		proto.onClicked = function(e){
			this.remove();
		};

        proto.readAttributes = function() {
			var isTip = this.getAttribute('tip') != undefined;
            this.data.content = (isTip) ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + this.getAttribute("tip") : this.getAttribute('content')
			this.data.isTip = isTip;
			this.data.x = this.getAttribute("x");
            this.data.y = this.getAttribute("y");
			this.data.direction = this.getAttribute('direction') || 'up';
        };
        proto.attributeChangedCallback = function( attrName, oldVal, newVal ) {
            this.readAttributes();
            this.updateTemplate();
        };
        proto.updateTemplate = function(){
            this.innerHTML = this.template(this.data);
			setTimeout( ()=> {
				this.updatePosition();
			},1);
        };

		proto.updatePosition = function(){
			var x = parseInt(this.data.x);
			var y = parseInt(this.data.y);
			var tip = $(this).find('.tip')[0];
			var position = tip.getBoundingClientRect();

			x = x - (tip.clientWidth / 2);
			tip.style.left = x + "px";

			// check if my position is outside window bounds
			// if so remove offset difference
			var posLeft = (x + tip.clientWidth); // x + width to get full width
			if(posLeft >= window.innerWidth) {
				var diff = posLeft - window.innerWidth;
				tip.style.marginLeft = ((diff + 20) * -1 ) + 'px';
			}

			var position = tip.getBoundingClientRect();
			// position the arrow
			var arrow = $(tip).find('.arrow')[0];
			arrow.style.left = ((tip.clientWidth / 2) - 5) + "px";

			if(this.data.direction == 'down') {
				var height = position.height;
				y = y - (height + 20);
				tip.style.top = y + "px";
			}else if(this.data.direction == 'up'){
				tip.style.top = (y + 5) + 'px';
			}
			$(tip).addClass('ready');
		};

		proto.detachedCallback = function(){
			this.data = null;
			this.template = null;
			this.onclick = null;
		}
        document.registerElement('tip-tooltip', {prototype: proto});
    }
}
