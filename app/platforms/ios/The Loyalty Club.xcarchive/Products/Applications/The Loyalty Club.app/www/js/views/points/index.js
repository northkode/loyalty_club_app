require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Points extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.downloadPassbook, '.passbook');
    }

    downloadPassbook(e) {
        var promise = mobileApp.api.generatePass();
		$(e.currentTarget).css('pointer-events','none');
        promise.done(data => {
			var url = data.url.split('/var/www/html').join('https://loyaltyapp.org');
            Passbook.downloadPass(url, function(pass, added) {
				$(e.currentTarget).css('pointer-events','auto');
                console.log(pass, added);
                if (added) {
                    Passbook.openPass(pass);
                } else { }
            }, function(error) {
                console.error(error);
            });
        });
    }

    transitionFinished() {

    }

}

export default Points;
