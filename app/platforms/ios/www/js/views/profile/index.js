require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

import IScroll from "../../vendor/iscroll";

class Profile extends DefaultAppView {
	constructor(route, viewData) {
		super(route, viewData);
		this.template = _.template(require('./template.tpl'));
		this.activity = _.template(require('./activity.tpl'));

		this.profileUpdateProxy = $.proxy(this.profileUpdated, this);
		mobileApp.um.addEventListener('userProfileUpdated', this.profileUpdateProxy);
	}

	attachListeners() {
		super.attachListeners();
		this.registerListener('click', this.onLogout, '.logout');
		this.registerListener('click', this.onEdit, '.edit');
		this.registerListener('tap', this.tabChanged, '.tabbar .tabbar__tab');
		this.registerListener('tap', this.showQR, 'mobile-header .icon');
		this.registerListener('tap', this.showQR, '.passbook');
		this.registerListener('tap', this.rateApp, '.rate');
		this.registerListener('tap', this.onLogout, '.signout');
	}

	rateApp() {
		var appId, platform = device.platform.toLowerCase();

		switch (platform) {
			case "ios":
				appId = "1247713531";
				break;
			case "android":
				appId = "org.theloyaltyclub";
				break;
		}

		if(LaunchReview.isRatingSupported()){
		    LaunchReview.rating();
		}else{
			LaunchReview.launch(appId, function() {
				console.log("Successfully launched store app");
			}, function(err) {
				console.log("Error launching store app: " + err);
			});
		}
	}

	showQR() {
		mobileApp.changeApplicationState('#points', {
			direction: 'up'
		});
	}

	tabChanged(e) {
		this.getViewInstance().find('.tabbar .tabbar__tab').removeClass('active');
		var content = $(e.currentTarget).addClass('active').data('ui-href');
		this.getViewInstance().find('.tab__content').removeClass('active');
		this.getViewInstance().find('.tab__content[data-id=' + content + ']').addClass('active');
		this.myScroll.refresh();
	}

	profileUpdated(e) {
		this.renderView(true);
	}

	onEdit() {
		mobileApp.changeApplicationState('#edit');
	}

	onLogout(e) {
		mobileApp.confirm("Are you sure you want to logout", (btn) => {
			if (btn == 2) {
				mobileApp.um.logout();
			}
		}, "Logout?", ['No', 'Logout'])
	}

	handleViewState(){
		super.handleViewState();

		var promise = mobileApp.api.getUserActivity(mobileApp.currentUser.id);
		promise.done(data => {
			this.getViewInstance().find('.tab__content[data-id="recent_activity"]').html(this.activity(data));
		});
	}

	transitionFinished() {
		var content = this.getViewInstance().find('.content')[0];
		this.myScroll = new IScroll(content, { probeType:3 });
		var offset = this.getViewInstance().find('.content .scroller')[0].clientHeight -  window.innerHeight;
		var colorBG = this.getViewInstance().find('mobile-header .colorbg')[0];
		this.myScroll.on('scroll',function(e){
			var scrollTop = this.y;
			var scrollamount = (scrollTop / offset) * 100; // get amount scrolled (in %)
			colorBG.style.opacity = (scrollamount * 3) / 100;
		});
		/*
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
        });*/
	}

	cleanup() {
		this.myScroll.destroy();
		mobileApp.um.removeEventListener('userProfileUpdated', this.profileUpdateProxy);
		super.cleanup();
	}

}

export default Profile;
