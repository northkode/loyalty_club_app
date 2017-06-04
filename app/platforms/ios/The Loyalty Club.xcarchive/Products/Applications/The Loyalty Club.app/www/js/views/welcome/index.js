require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Login extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
<<<<<<< HEAD
=======
        this.clearAfterClose = true;
>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.getStarted, '.getStarted');
<<<<<<< HEAD
        this.registerListener('click', this.login, '.login');
    }

	login(){
		mobileApp.changeApplicationState('#login');
	}

=======
    }

>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f
	getStarted(e){
		mobileApp.changeApplicationState('#categories');
	}

    transitionFinished() {

    }

}

export default Login;
