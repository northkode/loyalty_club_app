require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Events extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.eventTpl = _.template(require('./events.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        //this.registerListener('click', this.openWindow, 'div[ui-href]');
    }

    handleViewState() {
        super.handleViewState();

        var promise = mobileApp.api.getEvents();
        promise.done(data => {
			this.events = data;
			this.getViewInstance().find('.swiper-wrapper').html(this.eventTpl(this.events));
			setTimeout(() => {
				var swiper = new Swiper('.events_page .swiper-container', {
					pagination: '.events_page .swiper-pagination',
					slidesPerView: 'auto',
					centeredSlides: true,
					paginationClickable: true,
					spaceBetween: 30
				});
				this.getViewInstance().find('.swiper-container').addClass('active');

			},10);
        });
    }

    transitionFinished() { }

}

export default Events;
