require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";
import Smoke from "./smoke";

class Login extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.clearAfterClose = true;

    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.createAccount, '.create-btn');
        this.registerListener('click', this.onShowLogin, '.show-login');
        this.registerListener('click', this.signup, '.signup-btn');
        this.registerListener('click', this.forgotUserName, '.forgot-password');
        this.registerListener('click', this.sendForgotPassword, '.forgot-btn');
        this.registerListener('click', this.submitLogin, '.send-login');
        this.registerListener('click', this.onBack, '.create-form .back');
        this.registerListener('click', this.onBack, '.forgot-password-modal .back');
        this.registerListener('click', this.onBackToOptions, '.back-to-options');
    }

	onBackToOptions(){
		this.getViewInstance().find(".option-holder ").removeClass('login');
	}

    createAccount(e) {
        this.getViewInstance().find(".create-form").addClass('active');
    }
    onBack(e) {
        this.getViewInstance().find(".create-form").removeClass('active');
        this.getViewInstance().find(".forgot-password-modal").removeClass('active');
    }
    onShowLogin() {
        this.getViewInstance().find(".option-holder ").addClass('login');
    }

    signup(e) {
        $(e.currentTarget).addClass('active');
        var username = this.getViewInstance().find(".create-form input[name='username']").val();
        var first_name = this.getViewInstance().find(".create-form input[name='first_name']").val();
        var last_name = this.getViewInstance().find(".create-form input[name='last_name']").val();
        var password = this.getViewInstance().find(".create-form input[name='password']").val();
        var referral = this.getViewInstance().find(".create-form input[name='referral']").val();
        var fields = this.getViewInstance().find(".create-form .field.birthday input");
        var birthday = '';
        for (var i = 0; i < fields.length; i++) {
            birthday += fields.eq(i).val() + ((i == fields.length - 1) ? '' : "/");
        }

		if(username.indexOf('@') == -1){
			$(e.currentTarget).removeClass('active');
			mobileApp.alert('Please enter a valid email address',()=>{},'Email Error');
			return;
		}

		if(username == "" || first_name == "" || last_name == "" || password == "" || birthday == "//"){
			$(e.currentTarget).removeClass('active');
			if(birthday == "//"){
				mobileApp.alert("Please fill out your birthday.\n\nWe use this for password retrieval if you ever forget.",()=>{},"Signup Error");
				return;
			}else{
				mobileApp.alert("Please fill out all fields.",()=>{},"Signup Error");
			}
			return;
		}
        var push_channel = mobileApp.settings.push_channel;
        var promise = mobileApp.api.createUserAccount({
            username,
            first_name,
            last_name,
            password,
            referral,
            birthday,
            push_channel
        });
        promise.done(data => {
            this.login(e, username, password);
        });
        promise.fail(data => {
            $(e.currentTarget).removeClass('active');
            mobileApp.alert(data.responseJSON.error, () => {}, "Signup Error");
        });
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
        var promise = mobileApp.api.getLoyaltySettings();
        promise.done(data => {
            this.getViewInstance().find('.points_signup').text(data.signup_points + " free");
        });
        if (cordova.platformId != "android" && $('html').hasClass('mini-device') == false) {
            this.smoke = new Smoke({
                height: 250
            }, this.getViewInstance().find('.form'));
            this.smoke.update();
        }
    }

    disable() {
        if (this.smoke) {
            this.smoke.stop();
        }
    }

    cleanup() {
        if (this.smoke) {
            this.smoke.stop();
            this.smoke.cleanup()
            this.smoke = null;
        }
        super.cleanup();
    }

}

export default Login;
