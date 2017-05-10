require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Home extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));

        this.profileUpdateProxy = $.proxy(this.profileUpdated, this);
        mobileApp.um.addEventListener('userProfileUpdated', this.profileUpdateProxy);
	}

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.openWindow, 'div[ui-href]');
        this.registerListener('click', this.events, '.events');
        this.registerListener('click', this.earnPoints, '.earn_points');
        this.registerListener('click', this.redeemPoints, '.redeem_points');
        this.registerListener('click', this.showProfilePage, '.user-profile .profile-image-holder');
        this.registerListener('click', this.startOnboarding, '.onboarding .welcome > button.start');
        this.registerListener('click', this.pushAgree, '.onboarding .push-agree');
        this.registerListener('click', this.finishOnboarding, '.onboarding .finish');
        this.registerListener('click', this.switchToScanner, '.switch');
    }

	pushAgree(e) {
		$(e.currentTarget).hide();
		mobileApp.pn.registerPush();
	}

    profileUpdated(e) {
        this.renderView(true);
    }

    switchToScanner() {
        mobileApp.changeApplicationState('#admin');
    }

    updatePoints() {
		var points = mobileApp.currentUser.points.toFixed(0).replace(/./g, function(c, i, a) { return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c; });
        this.getViewInstance().find('.points_text .text').text(points);
        this.getViewInstance().find('.points_text .bg').text(points);
    }

    showProfilePage() {
        mobileApp.changeApplicationState('#profile');
    }

    events() {
        mobileApp.changeApplicationState('#events');
    }

    earnPoints() {
        mobileApp.changeApplicationState('#points');
    }

    redeemPoints() {
        mobileApp.changeApplicationState('#redeemPoints');
    }

    openWindow(e) {
        var ref = mobileApp.open($(e.currentTarget).attr('ui-href'), '_system');
    }

    startOnboarding() {
        this.getViewInstance().find('.onboarding').addClass('start');
    }

    finishOnboarding() {
        this.getViewInstance().find('.onboarding').removeClass('active');
        mobileApp.currentUser.app_data.user_assistant.onboarding = true;
        mobileApp.api.saveUserData();
		mobileApp.pn.registerPush();
    }

    transitionFinished() {
        if (mobileApp.currentUser.app_data.user_assistant.onboarding == undefined) {
            this.getViewInstance().find('.onboarding').addClass('active');
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false
            });
        }else if(mobileApp.currentUser.app_data.push_token == undefined){
			mobileApp.pn.registerPush();
		}
    }

    cleanup() {
        mobileApp.um.removeEventListener('userProfileUpdated', this.profileUpdateProxy);
        super.cleanup();
    }

}

export default Home;
