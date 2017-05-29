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

    transitionFinished() {
		var promise = mobileApp.api.getCategories();
		promise.done(data=>{
			console.log(data);
			this.categories = data;
		})
    }

}

export default Login;
