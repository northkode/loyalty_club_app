require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class ProfileEdit extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.onLogout, '.logout');
        this.registerListener('click', this.onSaveProfile, '.save-profile');
    }

	onSaveProfile(e){
		$(e.currentTarget).addClass('active')
		var username = this.getViewInstance().find("input[name='username']").val();
		var first_name = this.getViewInstance().find("input[name='first_name']").val();
		var last_name = this.getViewInstance().find("input[name='last_name']").val();
		var password = this.getViewInstance().find("input[name='password']").val();
		var fields = this.getViewInstance().find(".field.birthday input");
		var birthday = '';
		for (var i = 0; i < fields.length; i++) {
			birthday += fields.eq(i).val() + ((i == fields.length - 1) ? '' : "/");
		}
 		var id = mobileApp.currentUser.id;
		var data = {id,username,first_name,last_name,birthday};
		if(password != '') { data.password = password; }
		var promise = mobileApp.api.updateUserInfo(data);
		promise.done(data => {
			window.plugins.toast.showShortBottom("Profile Updated");
			$(e.currentTarget).removeClass('active');
			mobileApp.um.refreshUser(); // fix for bug
		});

		promise.error(data => {
			mobileApp.alert("There was an error updating your profile");
			$(e.currentTarget).removeClass('active');
		});
	}

    onLogout(e) {
        mobileApp.confirm("Are you sure you want to logout", (btn) => {
            if (btn == 2) {
                mobileApp.um.logout();
            }
        }, "Logout?", ['No', 'Logout']);
    }

    transitionFinished() {

        var inputs = document.querySelectorAll('.inputfile');
        Array.prototype.forEach.call(inputs, function(input) {
            var label = input.nextElementSibling,
                labelVal = label.innerHTML;

            input.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('.profile-image').css({
                            'background-image': 'url(' + e.target.result + ')'
                        });
						mobileApp.currentUser.image = e.target.result;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                    var data = new FormData();
                    // Add the file to the request.
                    data.append('file', e.target.files[0], e.target.files[0].name);
                    var promise = mobileApp.api.updateProfileImage(mobileApp.currentUser.id, data);
                    promise.done(function(data) {
						mobileApp.um.refreshUser(); // fix for bug
						window.plugins.toast.showShortBottom("Profile Picture Updated");
					});
                }
            });
        });
    }

}

export default ProfileEdit;
