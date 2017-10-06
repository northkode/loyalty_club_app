require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Login extends DefaultAppView {

	constructor(route, viewData) {
		super(route, viewData);
		this.template = _.template(require('./template.tpl'));
		this.clearAfterClose = true;
	}

	attachListeners() {
		super.attachListeners();
		this.registerListener('click', this.forgotUserName, '.forgot-password');
		this.registerListener('click', this.sendForgotPassword, '.forgot-btn');
		this.registerListener('click', this.submitLogin, '.send-login');
	}

	onBackClicked(){
		if(this.getViewInstance().find(".forgot-password-modal").hasClass('active')){
			this.getViewInstance().find(".forgot-password-modal").removeClass('active')
		}else{
			super.onBackClicked();
		}
	}

	forgotUserName(e) {
		this.getViewInstance().find(".forgot-password-modal").addClass('active');
	}

	sendForgotPassword() {
		var username = this.getViewInstance().find(".forgot-password-modal input[name='email']").val();
		var fields = this.getViewInstance().find(".forgot-password-modal .field.birthday input");
		var birthday = '';
		for (var i = 0; i < fields.length; i++) {
			birthday += fields.eq(i).val() + ((i == fields.length - 1) ? '' : "/");
		}
		var promise = mobileApp.api.sendForgotPassword(username, birthday.split(' ').join(''));
		promise.done(data => {
			mobileApp.alert("An email has been sent with password reset instructions");
		});
		promise.fail(data => {
			mobileApp.alert(data.responseJSON.error);
		});
	}

	submitLogin(e) {
		$(e.currentTarget).addClass('active');
		var username = this.getViewInstance().find(".login-form input[name='email']").val();
		var password = this.getViewInstance().find(".login-form input[name='password']").val();

		this.login(e, username, password);
	}

	login(e, username, password) {
		var promise = mobileApp.api.login(username, password);
		promise.done(data => {
			mobileApp.api.token = data.token;
			mobileApp.um.currentUser = data.user;
			mobileApp.localSettings.setItem('user', true);
			mobileApp.localSettings.setItem('token', data.token);
		});
		promise.fail(data => {
			$(e.currentTarget).removeClass('active');
			mobileApp.alert("Could not log in. Please check your credentials", () => {}, "Login Error");
			this.getViewInstance().find('.login-btn').removeClass('active');
			this.getViewInstance().find('.signup-btn').removeClass('active');
		});
	}

	transitionFinished() {

	}

}

export default Login;
