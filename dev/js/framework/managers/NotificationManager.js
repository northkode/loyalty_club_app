export default class NotificationManager {

    constructor(){
        this.notificationTray = $(_.template(require('../templates/notifications/NotificationTray.tpl'))());
        this.defaultNotification = _.template(require('../templates/notifications/default.tpl'));
        $('body').append(this.notificationTray);
    }

    addNotification(notification){
        clearTimeout(this.closeTimer);
        if(cordova.platformId == "ios"){ StatusBar.hide(); }
        var html;

		if(notification.payload.additionalData && notification.payload.additionalData.action) {
			switch(notification.payload.additionalData.action){
				case 'full_screen':
				case 'points_rewarded':
				case 'friend_referral':
				case 'announcement':
					html = this.defaultNotification(notification);
					break;
	            default:
					html = this.defaultNotification(notification);
	                break;
	        }
		}else{
			 html = this.defaultNotification(notification);
		}

		var _self = this;
        var element = $(html);
        element.find('.message-holder').on('click',function() {
            $.publish('app/pushnotification/opened',[notification]);
            _self.notificationTray.removeClass('active');
            if(cordova.platformId=='ios') StatusBar.show();
			setTimeout(()=>{
				_self.notificationTray.empty();
			},400);
        });
        element.find('.close').on('click',function(e) {
            e.preventDefault();
            if(cordova.platformId=='ios') StatusBar.show();
            var notification = $(e.currentTarget).closest('.notification').addClass('fadeOutLeft').removeClass('fadeInRight')
            setTimeout(function(){ notification.remove(); },450);
        });
        this.notificationTray.append(element);
        this.notificationTray.addClass('active');

    }
}
