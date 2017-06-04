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
<<<<<<< HEAD

		// onboarding controls
        this.registerListener('click', this.startOnboarding, '.onboarding .welcome > button.start');
        this.registerListener('click', this.finishOnboarding, '.onboarding .finish');
=======
>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f
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

<<<<<<< HEAD
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

		if (mobileApp.localSettings.getItem('onboarding') == undefined) {
            this.getViewInstance().find('.onboarding').addClass('active');
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false
            });
        }else if(mobileApp.currentUser && mobileApp.currentUser.app_data.push_token == undefined){
			mobileApp.pn.registerPush();
		}
=======
    transitionFinished() {
		var promise = mobileApp.api.getCategories();
		promise.done(data=>{
			console.log(data);
			this.categories = data;
		})
>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f
    }

}

export default Login;
