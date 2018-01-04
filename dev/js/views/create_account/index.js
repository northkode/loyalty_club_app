require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class CreateAccount extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.clearAfterClose = true;
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.signup, '.signup-btn');
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
            this.login(e,username, password);
        });
        promise.fail(data => {
            $(e.currentTarget).removeClass('active');
			var error = data.responseJSON.error;
			if(error) {
	            mobileApp.alert(error, () => {}, "Signup Error");
			} else {
	            mobileApp.alert('There was an error creating your account. Please contact support', () => {}, "Signup Error");
			}
        });
    }

    login(e,username,password){
        var promise = mobileApp.api.login(username, password);
		promise.done(data => {
            mobileApp.api.token = data.token;
            progress.show(`Joining program ${this.viewData.program.name}`);
            if(this.viewData.action =='join'){
                this.joinProgram(this.viewData.program,data)
            }

		});
		promise.fail(data => {
			$(e.currentTarget).removeClass('active');
			mobileApp.alert("Account was created. But could not complete auto login.", () => {}, "Login Error");
		});
    }

    joinProgram(program,userData){
        var promise = mobileApp.api.joinProgram(program.id, userData.user.id);
        promise.done(data => {
            progress.hide();
            mobileApp.pn.subscribeToChannel(program.push_channel);
            mobileApp.alert("You have successfully joined " + program.name + "'s loyalty program.", () => {
    			mobileApp.um.currentUser = userData.user;
    			mobileApp.localSettings.setItem('user', true);
    			mobileApp.localSettings.setItem('token', userData.token);
            }, "Joined Program!");
        });
        promise.fail(data => {
            this.getViewInstance().find('.join-program').prop("disabled", false).text("Join Program");
            mobileApp.alert("There was an error joining this program. Please contact support", () => {}, "Error");
        })
    }

    transitionFinished() { }

}

export default CreateAccount;
