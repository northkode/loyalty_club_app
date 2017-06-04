import { Event } from '../events/Event'
import { EventDispatcher } from '../events/EventDispatcher'

class UserManager {

    constructor(){
		window.device = window.device || {};
        this.promise = $.Deferred();
        if(window.cordova && window.facebookConnectPlugin) {
            // set global onProfileChange callback from facebook
            facebookConnectPlugin.setProfileChangeCallback(this.onProfileChange.bind(this));
        }
        this._userDetails = undefined;
        this._userStatus = 'unknown';
    }

    onProfileChange(status){
        console.log("onProfileChange",status);
        if(status.status == 'connected'){
            this.userStatus = status.status;
            console.log('sending graph api');
            this.getFacebookDetails();
        }else{
            this.userStatus = "unknown";
            this.currentUser = undefined;
        }
    }

    logout(){
        mobileApp.currentView.clearAfterClose = true;
        mobileApp.localSettings.removeItem('token');
        mobileApp.localSettings.removeItem('context');
        mobileApp.localSettings.removeItem('user');
        if(this.currentUser && this.currentUser.type == 'facebook' && facebookConnectPlugin) {
            facebookConnectPlugin.logout((data) => {
                console.log("facebook status",data);
                this.userStatus = 'unknown';
                this.currentUser = undefined;
            });
        }else{
            setTimeout(() => {
                this.userStatus = "unknown";
                this.currentUser = undefined;
            },1);
        }
    }

    refreshUser(){
        var promise = mobileApp.api.getUser();
        promise.done((status) => {
            this._userDetails = status;
			this._userDetails.app_data = (typeof this._userDetails.app_data == 'string') ? JSON.parse(this._userDetails.app_data) : {};
			if(this._userDetails.app_data.hasOwnProperty('user_assistant') == false) {
				this._userDetails.app_data.user_assistant = {};
			}
			this.userStatus = 'connected';
            var event = new Event("userProfileUpdated");
            this.dispatchEvent(event);
        });
        promise.fail(function(){
            mobileApp.changeApplicationState('#login');
        });

    }

    checkLoginStatus() {
        // if we are a email user then we typically store the user_data in localstorage
        if(mobileApp.localSettings.getItem('token') != undefined){
            setTimeout(() => {
                this.userStatus = "connected";
                mobileApp.api.token = mobileApp.localSettings.getItem('token');
                var promise = mobileApp.api.getUser();
                promise.done((status) => {
                    mobileApp.um.userStatus = 'connected';
                    // set user which fires an event to invalidate the app state
                    mobileApp.um.currentUser = status;
                });
                promise.fail(function(){
                    mobileApp.changeApplicationState('#welcome');
                    window.plugins.toast.showShortBottom('Session has expired', function(a){}, function(b){});
                    mobileApp.localSettings.removeItem('token');
                    mobileApp.localSettings.removeItem('context');
					mobileApp.sm.clearState();
					setTimeout(function() {
		                navigator.splashscreen.hide();
		            }.bind(this), 1500);
                });
            },10);
        }else if(window.facebookConnectPlugin){
            facebookConnectPlugin.getLoginStatus(this.onProfileChange.bind(this));
        }else{
			this.onProfileChange({status:""}); // not logged in
			setTimeout(function() {
				navigator.splashscreen.hide();
			}.bind(this), 1500);
		}
    }

    loginWithFacebook() {
        this.facebookPromise = $.Deferred();
        facebookConnectPlugin.login(["public_profile",'email'], this._fbLoginSuccess.bind(this),
            function (error) {
                console.log("facebook error",error);
                this.facebookPromise.reject(error)
            }.bind(this)
        );
        return this.facebookPromise;
    }

    /**
     * we dont really use this callback anymore since the new onProfile changes
     * @param userData
     * @private
     */
    _fbLoginSuccess(userData) {
        console.log("login status",userData);
        mobileApp.localSettings.setItem('account_type','facebook');
        this.onProfileChange(userData);
        this.facebookPromise.resolve(userData);
    }

    getFacebookDetails() {
        facebookConnectPlugin.api('/me?fields=first_name,last_name,gender,verified,email,picture.type(large)',
            ["public_profile","email"],
            this._onUserDetails.bind(this),
            this._onUserFailed.bind(this)
        );
    }

    _onUserFailed(error) {
        console.log("on error",error);
        this.userStatus = 'unknown';
        this.currentUser = undefined;
    }

    _onUserDetails(userData) {
        var facebookUser = {};
        // remap facebook user id
        for(var n in userData) {
            switch(n){
                case 'id':
                    facebookUser['facebook_id'] = userData[n];
                    break;
                default:
                    facebookUser[n] = userData[n];
                    break;
            }
        }

        facebookUser.password = '124'; // set dummy password for user
        //--- have to create a new object and stringify for django processing
        facebookUser.picture = JSON.stringify(facebookUser.picture);
        facebookUser.type = "facebook";
        //----
        var promise = mobileApp.api.createFacebookUser(facebookUser);
        promise.done((status) => {
            console.log("facebook user created successfully",status);
            status.type = 'facebook';
            this.currentUser = status;
            mobileApp.api.token = status.token;
        });
        promise.fail(function(status){
            console.log("error",status)
        });
    }

    resetPushIds(){
        delete mobileApp.um.currentUser.app_data.push_user_id // reset push ids
        mobileApp.um.currentUser.app_data.deviceId = device.uuid;
        mobileApp.um.currentUser.app_data.push_registered = false; // forces resest
        mobileApp.api.saveUserData();
    }

    set currentUser(value){
        this._userDetails = value;
        if(this._userDetails) {
			this.userStatus = 'connected';
			this._userDetails.app_data = (typeof this._userDetails.app_data == 'string') ? JSON.parse(this._userDetails.app_data) : {};
			if(this._userDetails.app_data.hasOwnProperty('user_assistant') == false) {
				this._userDetails.app_data.user_assistant = {};
			}
            if(this._userDetails.app_data.deviceId == undefined){
                this._userDetails.app_data.push_user_id = [];
                this._userDetails.app_data.deviceId = window.device.uuid;
                mobileApp.api.saveUserData();
            }
        }
        var event = new Event("userProfileChange");
        this.dispatchEvent(event);
    }

    get currentUser() {
        return this._userDetails;
    }

    set userStatus(value){
        this._userStatus = value;
    }

    get userStatus(){
        return this._userStatus;
    }

}

EventDispatcher.initialize(UserManager.prototype);

export default UserManager;
