require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Login extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.categorySelected, '.category');

		// onboarding controls
        this.registerListener('click', this.startOnboarding, '.onboarding .welcome > button.start');
        this.registerListener('click', this.finishOnboarding, '.onboarding .finish');
    }

	categorySelected(e){
		var cat;
		var id = $(e.currentTarget).attr('data-id');
		for (var i = 0; i < this.categories.length; i++) {
			if(this.categories[i].id == id){
				cat = this.categories[i];
			}
		}
		if(cat){
			mobileApp.changeApplicationState('#businesslist',{
				viewData:{
					category:cat
				}
			});
		}
	}

	startOnboarding() {
	    this.getViewInstance().find('.onboarding').addClass('start');
	}

	finishOnboarding() {
	    this.getViewInstance().find('.onboarding').removeClass('active');
	    mobileApp.localSettings.setItem('onboarding',true);
	}

    transitionFinished() {
		var promise = mobileApp.api.getCategories();
		promise.done(data => {
			console.log(data);
			this.categories = data;
		});

		/*if (mobileApp.localSettings.getItem('onboarding') == undefined) {
            this.getViewInstance().find('.onboarding').addClass('active');
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false
            });
        }*/

        if(mobileApp.currentUser && mobileApp.currentUser.app_data.push_token == undefined){
			mobileApp.pn.registerPush();
		}
    }

}

export default Login;
