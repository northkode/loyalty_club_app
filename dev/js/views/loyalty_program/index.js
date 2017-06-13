require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

import IScroll from "../../vendor/iscroll";

class Program extends DefaultAppView {

    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.rewardsTPL = _.template(require('./rewards.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.onJoinProgram, '.join-program');
		this.registerListener('tap', this.tabChanged, '.tabbar .tabbar__tab');
		this.registerListener('tap', this.viewQRCode, 'mobile-header .icon');
    }

	viewQRCode(){
		mobileApp.changeApplicationState("#points")
	}

	tabChanged(e) {
		this.getViewInstance().find('.tabbar .tabbar__tab').removeClass('active');
		var content = $(e.currentTarget).addClass('active').data('ui-href');
		this.getViewInstance().find('.tab__content').removeClass('active');
		this.getViewInstance().find('.tab__content[data-id=' + content + ']').addClass('active');
		//Utils.forceRedraw(this.getViewInstance().find('.content')[0]);
		this.myScroll.refresh();
	}

	onJoinProgram(e){
		if(mobileApp.currentUser){
			this.getViewInstance().find('.join-program').prop("disabled",true).text("Please wait...");
			var promise = mobileApp.api.joinProgram(this.viewData.id,mobileApp.currentUser.id);
			promise.done(data=>{
				mobileApp.alert("You have successfully joined "+this.viewData.name+"'s loyalty program.",()=>{},"Joined Program!");
				mobileApp.changeApplicationState('#home',{clearCache:true});
			});
			promise.fail(data=>{
				this.getViewInstance().find('.join-program').prop("disabled",false).text("Join Program");
				mobileApp.alert("There was an error joining this program. Please contact support",()=>{},"Error");
			})
		}else{
			mobileApp.confirm("Before joining a program you must create an account to be apart of The Loyalty Club",(btn)=>{
				if(btn == 2){
					mobileApp.changeApplicationState('#createaccount',{
						viewData:{
							action:'join',
							program:this.viewData
						}
					});
				}
			},'Join Now',['Not Now','Create Account']);
		}
	}

	categorySelected(e){
		var id = $(e.currentTarget).attr('data-id');
	}

	handleViewState(){
		super.handleViewState();

		var promise = mobileApp.api.getRewards(this.viewData.id);
        promise.done(data => {
            this.rewards = data;
            this.getViewInstance().find('.rewards-swiper').html(this.rewardsTPL({
				rewards:this.rewards,
				customerId:this.viewData.id,
				points:this.viewData.points
			}));
            setTimeout(() => {
				this.getViewInstance().find('.rewards-swiper').addClass('active');
				Utils.forceRedraw(this.getViewInstance().find('.content')[0]);
            },10);
        });
	}

    transitionFinished() {
		var content = this.getViewInstance().find('.content')[0];
		this.myScroll = new IScroll(content, { probeType:3 });
		var offset = this.getViewInstance().find('.content .scroller')[0].clientHeight -  window.innerHeight;
		var colorBG = this.getViewInstance().find('mobile-header .colorbg')[0];
		var text = this.getViewInstance().find('mobile-header .title')[0];
		this.myScroll.on('scroll',function(e){
			var scrollTop = this.y;
			var scrollamount = (scrollTop / offset) * -100 // get amount scrolled (in %)
			colorBG.style.opacity = (scrollamount * 2) / 100;
			text.style.opacity = (scrollamount * 1.2) / 100;
		});
	}

	cleanup(){
		this.myScroll.destroy();
		super.cleanup();
	}

}

export default Program;
