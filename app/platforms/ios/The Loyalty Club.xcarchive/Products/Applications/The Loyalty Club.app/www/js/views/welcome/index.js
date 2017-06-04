require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Login extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.getStarted, '.getStarted');
        this.registerListener('click', this.login, '.login');
    }

	login(){
		mobileApp.changeApplicationState('#login');
	}

	getStarted(e){
		mobileApp.changeApplicationState('#categories');
	}

    transitionFinished() {

    }

}

export default Login;
