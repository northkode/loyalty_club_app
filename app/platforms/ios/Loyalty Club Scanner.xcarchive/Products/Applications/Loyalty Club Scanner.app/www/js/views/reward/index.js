require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Reward extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('tap', this.redeemReward, '.redeem-btn');
    }

    redeemReward(e) {
        $(e.currentTarget).html("Please Wait...").addClass('active');
        navigator.notification.confirm(
            'Are you sure you would like to redeem this reward?\n\n**Please make sure you redeem infront of a company representitive, otherwise they may not acknowledge this redemption.', // message
            this.onConfirm.bind(this), // callback to invoke with index of button pressed
            'Redeem', // title
            ['Yes, Redeem', 'Cancel'] // buttonLabels
        );
    }

    onConfirm(value){
        console.log(value);
        if(value == 1){
            var promise = mobileApp.api.redeemReward(this.viewData.customerId,mobileApp.currentUser.id,this.viewData.reward.id);
            promise.done(data =>{
                mobileApp.history.find('home')[0].viewInstance.updateCards();
                mobileApp.history.find('program')[0].viewInstance.refreshPoints(data.points);
                this.getViewInstance().find('.redeem-btn').html("Reward Redeemed!").addClass('complete')
            }).error(data => {
                console.log(data)
                navigator.notification.alert(data.responseJSON.error);
                this.getViewInstance().find('.redeem-btn').html("Redeem Reward").removeClass('active');
            });
        }
    }

    transitionFinished() {

    }

}

export default Reward;
