require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class ReDeemPoints extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.rewardsTPL = _.template(require('./rewards.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        //this.registerListener('click', this.openWindow, 'div[ui-href]');
        this.registerListener('click', this.redeemReward, '.front .redeem_btn');
        this.registerListener('click', this.closeReward, '.back i');
        this.registerListener('click', this.confirmRedeem, '.back .confirm');
    }

    handleViewState() {
        super.handleViewState();

        var promise = mobileApp.api.getRewards();
        promise.done(data => {
            this.rewards = data;
            this.getViewInstance().find('.swiper-wrapper').html(this.rewardsTPL(this.rewards));
            setTimeout(() => {
                var swiper = new Swiper('.redeem_points .swiper-container', {
                    pagination: '.redeem_points .swiper-pagination',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 30
                });
				this.getViewInstance().find('.swiper-container').addClass('active');
            },10);
        })
    }

	closeReward(e){
		$(e.currentTarget).parents('.swiper-slide').removeClass('redeem');
	}

	redeemReward(e){
		if($(e.currentTarget).hasClass('lock')){
			mobileApp.alert("You do not have enough points to redeem this reward.",()=>{},'Not Enough Points');
			return;
		}
		$(e.currentTarget).parents('.swiper-slide').addClass('redeem');
	}

	confirmRedeem(e){
		mobileApp.confirm("Please make sure you are redeeming this reward in front of a company representitive.\n\nClaiming a reward in private may result in a void transaction.",(btn)=>{
			if(btn == 1){
				$(e.currentTarget).addClass('active');
				var id = parseInt($(e.currentTarget).attr('data-id'));
				var promise = mobileApp.api.redeemReward(id);
				promise.done(data => {
					for (var i = 0; i < this.rewards.length; i++) {
						if(this.rewards[i].id == id) {
							mobileApp.currentUser.points -= parseInt(this.rewards[i].cost);
							mobileApp.history.find('home')[0].viewInstance.updatePoints();
							$(e.currentTarget).removeClass('active').addClass('redeem').html("<i class='fa fa-check jelly-animation'></i>");
						}
					}
				});

				promise.fail(data => {
					mobileApp.alert("Could not redeem reward. Please contact support");
				});
			}
		},'Warning!')

	}

    transitionFinished() { }

}

export default ReDeemPoints;
