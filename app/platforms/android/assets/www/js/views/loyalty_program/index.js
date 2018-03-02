require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

import IScroll from "../../vendor/iscroll";

class Program extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.rewardsTPL = _.template(require('./rewards.tpl'));
        this.eventTPL = _.template(require('./events.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.onJoinProgram, '.join-program');
        this.registerListener('tap', this.tabChanged, '.tabbar .tabbar__tab');
        this.registerListener('tap', this.viewQRCode, 'mobile-header .icon');
        this.registerListener('tap', this.viewReward, '.reward:not(.lock)');
        this.registerListener('tap', this.leaveProgram, '.leave-program');
    }

    leaveProgram(e) {
        $(e.currentTarget).html('Please Wait..').addClass('active');
        navigator.notification.confirm(
            'Are you sure you would like to leave this reward program?', // message
            this.onConfirmLeave.bind(this), // callback to invoke with index of button pressed
            'Leave Program', // title
            ['Yes, Leave Program', 'Cancel'] // buttonLabels
        );
    }

    onConfirmLeave(value) {
        if (value == 1) {
            var promise = mobileApp.api.leaveProgram(this.viewData.id, mobileApp.currentUser.id)
            promise.done(data => {
                mobileApp.um.refreshUser();
                this.clearAfterClose = true;
                mobileApp.changeApplicationState('#home');
            }).error(data => {
                navigator.notification.alert(data.responseJSON.error);
                this.getViewInstance().find('.leave-program').html("Leave Rewards Program").removeClass('active');
            });
        }
    }

    viewReward(e) {
        var rewardId = $(e.currentTarget).attr('data-id');
        for (var i = 0; i < this.rewards.length; i++) {
            var reward = this.rewards[i];
            if (reward.id == rewardId) {
                mobileApp.changeApplicationState('#reward', {
                    viewData: {
                        reward,
                        points: this.viewData.customer ? this.viewData.customer.points : 0,
                        customerId: this.viewData.id
                    }
                });
            }
        }
    }

    refreshPoints(points) {
        this.viewData.customer.points = points;
        this.getViewInstance().find('.details .phone').html(`${points} points to spend`);
        this.getRewards();
    }

    viewQRCode() {
        mobileApp.changeApplicationState("#points")
    }

    tabChanged(e) {
        this.getViewInstance().find('.tabbar .tabbar__tab').removeClass('active');
        var content = $(e.currentTarget).addClass('active').data('ui-href');
        this.getViewInstance().find('.tab__content').removeClass('active');
        this.getViewInstance().find('.tab__content[data-id=' + content + ']').addClass('active');
        this.myScroll.refresh();
    }

    onJoinProgram(e) {
        if (mobileApp.currentUser) {
            navigator.notification.prompt('If you have friend referral code enter it below:', (results) => {
                this.getViewInstance().find('.join-program').prop("disabled", true).text("Please wait...");
                if (results.buttonIndex == 2) {
                    var promise = mobileApp.api.joinProgram(this.viewData.id, mobileApp.currentUser.id, results.input1.toUpperCase());
                } else {
                    var promise = mobileApp.api.joinProgram(this.viewData.id, mobileApp.currentUser.id);
                }
                promise.done(data => {
                    mobileApp.pn.subscribeToChannel(this.viewData.push_channel);
                    mobileApp.alert("You have successfully joined " + this.viewData.name + "'s loyalty program.", () => {}, "Joined Program!");
                    setTimeout(() => {
                        mobileApp.changeApplicationState('#home', {
                            clearCache: true
                        });
                    }, 1000)
                });
                promise.fail(data => {
                    this.getViewInstance().find('.join-program').prop("disabled", false).text("Join Program");
                    mobileApp.alert("There was an error joining this program. Please contact support", () => {}, "Error");
                });
            }, 'Friend Referral', ['No Referral', 'Add Referral']);
        } else {
            mobileApp.confirm("Before joining a program you must create an account to be apart of The Loyalty Club", (btn) => {
                if (btn == 2) {
                    mobileApp.changeApplicationState('#createaccount', {
                        viewData: {
                            action: 'join',
                            program: this.viewData
                        }
                    });
                }
            }, 'Join Now', ['Not Now', 'Create Account']);
        }
    }

    categorySelected(e) {
        var id = $(e.currentTarget).attr('data-id');
    }

    handleViewState() {
        super.handleViewState();
        this.getRewards();
        this.getEvents();
    }

    getRewards() {
        var promise = mobileApp.api.getRewards(this.viewData.id);
        promise.done(data => {
            this.getViewInstance().find('.spinner').remove();
            this.rewards = data;
            this.getViewInstance().find('.rewards-swiper').html(this.rewardsTPL({
                rewards: this.rewards,
                customerId: this.viewData.id,
                points: this.viewData.customer ? this.viewData.customer.points : 0
            }));
            setTimeout(() => {
                this.getViewInstance().find('.rewards-swiper').addClass('active');
                Utils.forceRedraw(this.getViewInstance().find('.content')[0]);
            }, 10);
        });
    }

    getEvents() {
        var promise = mobileApp.api.getEvents(this.viewData.id);
        promise.done(data => {
            this.events = data;
            console.log(this.events);
            this.getViewInstance().find('.event-list').html(this.eventTPL({
                events: this.events,
                customerId: this.viewData.id
            }));
        });
    }

    transitionFinished() {
        var content = this.getViewInstance().find('.content')[0];
        this.myScroll = new IScroll(content, {
            probeType: 3
        });
        var offset = this.getViewInstance().find('.content .scroller')[0].clientHeight - window.innerHeight;
        var colorBG = this.getViewInstance().find('mobile-header .colorbg')[0];
        var text = this.getViewInstance().find('mobile-header .title')[0];
        this.myScroll.on('scroll', function(e) {
            var scrollTop = this.y;
            var scrollamount = (scrollTop / offset) * -100 // get amount scrolled (in %)
            colorBG.style.opacity = (scrollamount * 2) / 100;
            text.style.opacity = (scrollamount * 1.2) / 100;
        });
    }

    cleanup() {
        try {
            this.myScroll.destroy();
            this.myScroll.off();
        }catch(e){}
        super.cleanup();
    }

}

export default Program;
