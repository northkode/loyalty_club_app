require('./mobileView.scss');
export default class MobileView {
    constructor() {
        var proto = Object.create(HTMLElement.prototype);
        document.registerElement('mobile-view', {prototype: proto});
    }
}
