export default class PushNotifications {
    constructor() { }

    init(settings,loyaltySettings) {
		var iosSettings = {};
		iosSettings["kOSSettingsKeyAutoPrompt"] = false;
		iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

		this.loyaltySettings = loyaltySettings;

        window.plugins.OneSignal.startInit(settings.oneSignalAPI)
		.handleNotificationReceived(this.onReceivedNotification.bind(this))
		.handleNotificationOpened(this.onReceivedNotification.bind(this))
		.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
		.iOSSettings(iosSettings)
		.endInit();

		// delay getting id until registeration on init finishes
		setTimeout(()=>{
			window.plugins.OneSignal.getIds(this.onSubscribeSuccess.bind(this));
		},1000);

    };

    registerPush() {
        if(mobileApp.um.currentUser.app_data.hasOwnProperty('push_token') == false || mobileApp.um.currentUser.app_data.push_token == '' ) {
            window.plugins.OneSignal.registerForPushNotifications();
        }else if(mobileApp.um.currentUser.app_data.hasOwnProperty('push_user_id')){
			this.updatePushIds();
		}
    }

    clearbadge() {
        if(cordova.platformId == 'ios') { }
    };

    unsubscribeToChannel(channelName) {
        var promise = $.Deferred();
        return promise;
    };

    subscribeToChannel(channelName) {
		window.plugins.OneSignal.sendTag(channelName, "true");
        return true;
    };

    /**
     * String message - The message text the user seen in the notification.
     JSONObject additionalData - Key value pairs that were set on the notification.
         String title - Title displayed in the notification.
         ArrrayOfObjects actionButtons - Any buttons that were present on the notification.
             String text - Text displayed on the button.
             String id - Id set on the button.
     String actionSelected - Id of the button on the notification that was clicked. "__DEFAULT__" will be set if buttons were set on the notification but the user tap on the notification itself.
         String sound - Sound set on the notification.
         String launchURL - launchURL set on the notification.
         ArrrayOfObjects stacked_notifications - Contains an object for each notification that exists in the stack. message as well as keys listed above and ones you set with additional data.
     boolean isActive - True if your app was currently being used when a notification came in.
     * @param data
     */
    onReceivedNotification(data) {
        var notification = this._buildNotificationPayload(data);
        if (data.additionalData) {
            if (data.additionalData.actionSelected) {
                console.log(data.additionalData.actionSelected);
            }
            if (data.groupedNotifications) {
                var notifications = data.groupedNotifications;
                for (var i = 0; i < notifications.length; i++) {
                    console.log(notifications[i]);
                }
            }
        }
        if(notification.isAppInFocus){
            $.publish('app/pushnotification/received',notification);
        }else{
            $.publish('app/pushnotification/opened',notification);
        }
    };

    /**
     * onSubscribeSuccess
     * @param token
     */
    onSubscribeSuccess(ids) {
		this.push_user_id = ids.userId;
		this.push_token = ids.pushToken;

		if(ids.pushToken == '') this.push_user_id = undefined;
        // sometimes we dont have a user cause the app is already registered and init is call on app load not when the user logs in
        if(!mobileApp.um.currentUser) { return; }

		this.updatePushIds(); // save the push id
    };

	hasValidPushId(){
		 return mobileApp.um.currentUser.app_data.hasOwnProperty('push_token') && mobileApp.um.currentUser.app_data.push_token != '';
	}

	/**
	 * sometimes the push ids are different if they delete the app or they login on a different device
	 */
	updatePushIds(){
		console.warn("updating users push id");
		plugins.OneSignal.setSubscription(true);
		window.plugins.OneSignal.sendTag(this.loyaltySettings.push_channel, "true");
		window.plugins.OneSignal.sendTag("account_type", mobileApp.currentUser.account_type);
		if(this.push_user_id && this.push_token) {
			if( mobileApp.um.currentUser.app_data.hasOwnProperty('push_user_id') && Array.isArray(mobileApp.um.currentUser.app_data.push_user_id)){
				if(mobileApp.um.currentUser.app_data.push_user_id.indexOf(this.push_user_id) == -1){
					mobileApp.um.currentUser.app_data.push_user_id.push(this.push_user_id);
				}
			} else {
				mobileApp.um.currentUser.app_data.push_user_id = [this.push_user_id];
			}
			mobileApp.um.currentUser.app_data.push_token = this.push_token;
			mobileApp.um.currentUser.app_data.push_registered = true;
			setTimeout(function() { mobileApp.api.saveUserData(); },500);
		}
	}


    /**
     * _buildNotificationPayload
     * Custom notification payload to normalize that notification from android and ios
     * @param data
     * @returns {*}
     * @private
     */
    _buildNotificationPayload(data){
        var notification = {};
        if(data.hasOwnProperty('android')) {
            for(var n in data){
                switch(n) {
                    /* ignore these keys */
                    case 'pb_n_id':
                    case 'collapse_key':
                    case 'from':
                        break;
                    default:
                        notification[n] = data[n];
                }
            }
        }else{
            return data;
        }

        return notification;
    }
}
