import MobileApp from "./framework/core/MobileApp";
import StateManager from "./framework/core/StateManager";
import "./framework/utils/date_format";
import "./vendor/jquery.pinchzoomer";
import "./vendor/datedropper.min";
import "./vendor/swiper.min";
import autosize from "./vendor/autosize.min";
import THREE from "./vendor/three";
window.THREE = THREE;

// api for server talking
import { API } from "./Api";

import UserAssistant from "./framework/controls/UserAssistant";

//VIEWS
import NoInternet from './framework/views/NoInternet';
import Home from './views/home/index';
import Points from './views/points/index';
import Login from './views/login/index';
import RedeemPoints from './views/redeempoints/index';
import Admin from './views/admin/index';
import Profile from './views/profile/index';
import ProfileEdit from './views/profile_edit/index';
import Events from './views/events/index';

class RanchApp extends MobileApp {
    constructor(settings) {
		console.log("app loading...");
        window.autosize = autosize; // autosize helper for textarea field
        // register all the app states here
        // Main Menu Items -----
        StateManager.registerState('nointernet', NoInternet);
        StateManager.registerState('home', Home);
        StateManager.registerState('points', Points);
        StateManager.registerState('login', Login);
        StateManager.registerState('redeemPoints', RedeemPoints);
        StateManager.registerState('admin', Admin);
        StateManager.registerState('profile', Profile);
        StateManager.registerState('edit', ProfileEdit);
        StateManager.registerState('events', Events);

		var analytics = navigator.analytics;
		if(analytics) {
			analytics.setTrackingId(settings.ga);
		}

        super(settings);
        this.showChangeLog = false;
    }

    init() {
        super.init();

		this.api = new API(this.localSettings.getItem('devmode') === 'true' ? this.settings.dev_server : this.settings.prod_server, this.settings.customer_id); // server api helper

		console.log("app initializing...");

        this.context = null;
        this._appOpenedActions = []; // used to handle push notification events when the app is not opened

        if (window.cordova) {
            window.plugins.nativepagetransitions.globalOptions.duration = 300;
            Keyboard.hideFormAccessoryBar(true);
            this.open = cordova.ThemeableBrowser.open;
        } else {
            navigator.splashscreen = {
                show: function() {},
                hide: function() {}
            };
        }

        if (window.cordova && cordova.platformId == "android") {
            Keyboard.disableScrollingInShrinkView(true);
        }

		StatusBar.styleLightContent();

        // custom menu button trigger
        this.menuProxy = $.proxy(this.onMenuToggle, this);
        $(document).on('click', '.hamburger', this.menuProxy);

        $('.mainmenu .option').on('tap', this.onMenuItemClicked.bind(this));

        this.devCounter = 0;

        /* Manage swiping left and right on views to have easier navigation */
        var startDragAtBorder = false;
        $(document).on('touchstart', function(e) {
            var xPos = e.originalEvent.touches[0].pageX;
            if (xPos < 5) { // this can also be xPos == 0; whatever works for you
                startDragAtBorder = true;
            } else {
                startDragAtBorder = false;
            }
        });
        $(document).on('swiperight', function(e) {
            if (startDragAtBorder) {
                if (mobileApp.history.history.length && mobileApp.currentView.route.value != '#home') {
                    mobileApp.goBack();
                }
            }
        });
        //------------------

        var _this = this;

        var promise = this.sm.init();
        // wait till the state manager is ready
        promise.done(() => {
			console.log('state manager ready')
            this.pn.init(this.settings);
            this.setupRouting();
        });
		promise.fail((e)=>{
			console.warn("state manager failed",e);
			mobileApp.alert("State manager didn't initalize");
		})
    }

    onProfileClicked() {
        if (!this.um.currentUser.is_superuser) return;
        clearTimeout(this.countTimer);
        this.devCounter += 1;
        this.countTimer = setTimeout(function() {
            this.devCounter = 0;
        }.bind(this), 1000);
        if (this.devCounter == 5) {
            window.plugins.toast.showShortBottom('Almost there, 5 more clicks', function(a) {}, function(b) {});
        }
        if (this.devCounter >= 10) {
            if (mobileApp.localSettings.getItem('devmode') === 'true') {
                this.setDevMode(false);
            } else {
                this.setDevMode(true);
            }
        }
    }

    setDevMode(isDev) {
        this.devCounter = 0;
        mobileApp.localSettings.removeItem('token');
        console.log("is dev mode", isDev)
        if (isDev) {
            mobileApp.localSettings.setItem('devmode', 'true');
            window.plugins.toast.showShortBottom('Dev mode activated', function(a) {}, function(b) {});
            $('.app').addClass('devmode')
            this.api.apiPath = this.settings.dev_server;
            //Stripe.setPublishableKey(this.settings.stripe_dev);
            window.plugins.OneSignal.sendTag("dev_user", "true");
        } else {
            this.api.apiPath = this.settings.prod_server;
            //Stripe.setPublishableKey(this.settings.stripe_prod);
            mobileApp.localSettings.removeItem('devmode');
            window.plugins.toast.showShortBottom('Dev mode unactivated', function(a) {}, function(b) {});
            $('.app').removeClass('devmode')
        }
        setTimeout(function() {
            window.location = window.location.href.split('#')[0];
        }, 1000);
    }

    setupRouting() {
        super.setupRouting();

        // check to see if this phone has had a user logged in before
        if (this.localSettings.getItem('user') == undefined) { // brand new phone, so show them the welcome screen
            this.changeApplicationState('#login');
			setTimeout(function() {
                navigator.splashscreen.hide();
            }.bind(this), 1500);
        } else {
            this.um.checkLoginStatus();
        }
    }

    onApplicationReady() {
        super.onApplicationReady();
    }

    onAppPause() {
        super.onAppPause();
    }

    onAppResume() {
        super.onAppResume();
    }

    checkForUpdate() { }

    syncStatus(status) {
        switch (status) {
            case SyncStatus.DOWNLOADING_PACKAGE:
                //this.alert("Downloading Update");
                break;
            case SyncStatus.INSTALLING_UPDATE:
                //this.alert("Installing Update");
                break;
            case SyncStatus.UP_TO_DATE:
                //this.alert("You are up to date");
                break;
            case SyncStatus.CHECKING_FOR_UPDATE:
                //this.alert("Checking For update");
                break;
            case SyncStatus.IN_PROGRESS:
                //this.alert("Syncing is in progress");
                break;
            case SyncStatus.ERROR:
                //this.alert("There was an error");
                break;
            case SyncStatus.UPDATE_INSTALLED:
                this.showChangeLog = false;

                break;
        }
    }

    onMenuItemClicked(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

		$('.mainmenu .option').removeClass('active');
		$(e.currentTarget).addClass('active');

        var location = $(e.currentTarget).attr('ui-href');
        if (location.indexOf('signout') != -1) {
            mobileApp.confirm("Are you sure you want to sign out?", (index) => {
                if (index == 1) {
                    if (this.driftController) {
                        window.drift.reset();
                    }
                    setTimeout(() => {
                        mobileApp.um.logout(mobileApp.getContext());
                        mobileApp.sm.clearState();
                        return;
                    }, 600);
                }
            }, "Sign out Confirmation");
            return;
        }

		return;
		setTimeout(function() {
			mobileApp.changeApplicationState(location);
		}, 600);
    }

    // check to see if we launched the app with a notification
    checkLaunchIntent() {};

    /**
     * Listen for global onUserProfileChange event
     * @param event
     */
    onUserProfileChange(event) {
        super.onUserProfileChange(event);
        var location;
        if (this.um.userStatus == 'connected') {
            // retrieve the last user mode that was used before the app closed.
            if(this.um.currentUser.account_type == 'employee') {
				location = '#admin';
			}else{
				location = '#home';
			}

			mobileApp.um.currentUser.app_data.platform = cordova.platformId;

            //this.checkForceUpdate();
            this.saveAppVersionNumber();
            this.updateUserProfile();
            this.updateNotificationCounts();
            this.pn.updatePushIds();

            // if the user clicked a notification before we were logged in then call handleOpenActions
            if (this.hasNotificationActions()) {
                setTimeout(() => {
                    this.handleOpenActions();
                }, 1500);
            }
            this.changeApplicationState(location, {
                clearCache: true
            });
            setTimeout(function() {
                navigator.splashscreen.hide();
            }.bind(this), 1500);


        } else { // not logged in
            this.changeApplicationState('#login', {});

            setTimeout(function() {
                navigator.splashscreen.hide();
            }.bind(this), 1500);
        }

    };

    saveAppVersionNumber() {
        cordova.getAppVersion.getVersionNumber().then((version) => {
			this.um.currentUser.app_data.app_version = version;
			this.api.saveUserData();
        });
    }

    checkForceUpdate() {
        //console.log("Check for update",this.um.currentUser.app_data.needs_update)
        //    if (this.um.currentUser.app_data.needs_update) {
        var promise = mobileApp.api.checkAppVersion();
        promise.done(data => {
            console.warn("Server Version:", data);
            cordova.getAppVersion.getVersionNumber().then((version) => {
                console.warn("Installed Version", version)
                var isVersion = Utils.checkVersionString(version, data.version) >= 0; // are we greater or equal to the server version
                var greaterThenMin = Utils.checkVersionString(version, data.minimum_version) >= 0; // ar we greater or equal to minimum_version
                //console.log("isVersion",isVersion,'Greater then min',greaterThenMin);
                if (((!isVersion && !greaterThenMin) && data.force_update)) {
                    var store = cordova.platformId == 'ios' ? 'App Store' : "Play Store";
                    new UserAssistant([{
                        img: 'img/assets/app_update.png',
                        title: "New Update",
                        message: `<p>TradePros has an update ready.</p><p>Please download this update from the ${store} before continuing as it contains important fixes. </p>`,
                        buttonLabel: ""
                    }]).show(0);
                } else {
                    delete this.um.currentUser.app_data.needs_update;
                    this.api.saveUserData();
                }
            });
        });
    }

    checkPushEnabled() {
        if (cordova.platformId == 'ios') {
            PushNotificationsStatus.isPushNotificationsEnabled(function(response) {
                if (!response) {}
            }, function(error) {});
        }
    }

	/**
	 * Updates the ui with profile image data etc when the user logs in
	 */
    updateUserProfile() {}

    onNotificationReceived(e, notification) {
        console.log("notification received", notification);
        super.onNotificationReceived(e, notification);
		if(notification.payload.additionalData && notification.payload.additionalData.action) {
			switch(notification.payload.additionalData.action){
				case 'points_rewarded':
				case 'friend_referral':
					mobileApp.um.refreshUser(); // update view because points changed
					break;
				default:
					break;
			}
		}
    }

    onNotificationOpened(e, notification) {
        console.log(this.currentUser, this.appReady);
        if (this.currentUser == undefined || this.appReady == false) {
            var closure = (function(event, obj) {
                return function() {
                    mobileApp.onNotificationOpened(event, obj);
                }
            })(e, notification);
            this._appOpenedActions.push(closure);
            console.log("storing push action untill we are ready to use it");
            return;
        }
        console.log("notification opened", notification);
        super.onNotificationOpened(e, notification);
    }

    updateNotificationCounts() {}

    changeContext(context) {
        StatusBar.styleDefault();
        this.context = context;
    }

    handleOpenURL(url) {
        console.log(url);
        if (!url || url == '') return;
        super.handleOpenURL(url);
        let urlHandle = url.split('://')[1];
        var action = urlHandle.split("?")[0];

        switch (action) {
            case "forgotpass":
                let params = urlHandle.split("?goto=")[1];
                // we now have a valid token.. so this will at least log us back in..
                // but now we have to redirect to create a password
                this.um.checkLoginStatus();
                this.tempFuncForgotPass = () => {
                    this.onForgotPassReady(params);
                }
                mobileApp.addEventListener("VIEW_LOADED", this.tempFuncForgotPass);
                break;
        }
    }

    onForgotPassReady(params) {
        mobileApp.removeEventListener("VIEW_LOADED", this.tempFuncForgotPass);
        mobileApp.changeApplicationState(params, {
            viewData: {
                forgotPass: true
            }
        })
        this.tempFuncForgotPass = null;
    }


    getContext() {
        return this.context;
    }

    closeMenu() {
        $('.hamburger').removeClass('is-active');
        $('body').removeClass('menu-open');
    }

    onMenuToggle(e) {
        var target = $(e.currentTarget);
        if (target.hasClass('is-active')) {
            this.closeMenu();
        } else {
            target.addClass('is-active');
            $('body').addClass('menu-open');
        }

    };

    resize() {
        super.resize();
    };
}

export default RanchApp;
