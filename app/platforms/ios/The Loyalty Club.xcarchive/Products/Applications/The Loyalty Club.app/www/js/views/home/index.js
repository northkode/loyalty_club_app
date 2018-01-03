require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Home extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.loyaltyCards = _.template(require('./cards.tpl'));

        this.profileUpdateProxy = $.proxy(this.profileUpdated, this);
        mobileApp.um.addEventListener('userProfileUpdated', this.profileUpdateProxy);
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('tap', this.showPrograms, '.loyalty-program');
        this.registerListener('click', this.showProfilePage, '.user-profile .profile-image-holder');
        this.registerListener('tap', this.showProfilePage, '.account-settings');
        this.registerListener('click', this.onEarnPoints, '.swiper-container .front');
        this.registerListener('click', this.onCloseCard, '.swiper-container .back i');
    }

    onEarnPoints(e) {
        var id = $(e.currentTarget).parents('.swiper-slide').attr('data-customer-id');
        for (var i = 0; i < this.programs.length; i++) {
            var program = this.programs[i];
            if (program.id == id) {
                break;
            }
        }

        mobileApp.changeApplicationState('#program', {
            viewData: program
        });

        mobileApp.localSettings.setItem('program-tap-tip', true);
    }
    onCloseCard(e) {
        $(e.currentTarget).parents('.swiper-slide').removeClass('earn');
    }

    profileUpdated(e) {
        this.updated = true;
    }

    updateCards() {
        if (this.swiper) {
            this.swiper.destroy(true, true);
            this.swiper = null;
        }
        var promise = mobileApp.api.getLoyaltyPrograms(mobileApp.currentUser.id);
        promise.done(data => {
            this.programs = data;
            mobileApp.currentUser.programs = this.programs;
            this.getViewInstance().find('.swiper-wrapper').html(this.loyaltyCards({
                cards: data
            }));
            setTimeout(() => {
                var holder = this.getViewInstance().find('.swiper-container')[0];
                this.swiper = new Swiper(holder, {
                    pagination: '.page_welcome .swiper-pagination',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 20
                });
                setTimeout(() => {
                    $(holder).addClass('active');
                },10);
            },100);
        });
    }

    showProfilePage() {
        mobileApp.changeApplicationState('#profile');
    }

    showPrograms() {
        mobileApp.changeApplicationState('#categories');
    }

    transitionFinished() {

        console.log("transition finished")
        if (mobileApp.currentUser.app_data.push_token == undefined) {
            mobileApp.pn.registerPush();
        }

        this.updateCards();
    }

    enable() {
        super.enable();
        if (this.updated) {
            requestAnimationFrame(() => {
                this.updateCards();
            });
        }
    }

    cleanup() {
        mobileApp.um.removeEventListener('userProfileUpdated', this.profileUpdateProxy);
        if (this.swiper) {
            this.swiper.destroy(true, true);
        }
        super.cleanup();
    }

}

export default Home;
