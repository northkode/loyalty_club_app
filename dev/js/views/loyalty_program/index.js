require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Program extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.rewardsTPL = _.template(require('./rewards.tpl'));
        this.clearAfterClose = true;
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.categorySelected, '.category');
    }

	categorySelected(e){
		var id = $(e.currentTarget).attr('data-id');
	}

	handleViewState(){
		super.handleViewState();

		var promise = mobileApp.api.getRewards(this.viewData.id);
        promise.done(data => {
            this.rewards = data;
            this.getViewInstance().find('.swiper-wrapper').html(this.rewardsTPL({
				rewards:this.rewards,
				customerId:this.viewData.id
			}));
            setTimeout(() => {
                var swiper = new Swiper('.program-page .swiper-container', {
                    pagination: '.program-page .swiper-pagination',
                    slidesPerView: 'auto',
                    paginationClickable: true,
                    spaceBetween: 20
                });
				this.getViewInstance().find('.swiper-container').addClass('active');
            },10);
        });
	}

    transitionFinished() { }

}

export default Program;
