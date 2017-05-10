require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Profile extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));

        this.profileUpdateProxy = $.proxy(this.profileUpdated, this);
        mobileApp.um.addEventListener('userProfileUpdated', this.profileUpdateProxy);
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click',this.onLogout,'.logout');
        this.registerListener('click',this.onEdit,'.edit');
    }

	profileUpdated(e) {
		this.renderView(true);
	}

	onEdit(){
		mobileApp.changeApplicationState('#edit');
	}

	onLogout(e){
		mobileApp.confirm("Are you sure you want to logout",(btn)=>{
			if(btn == 2){
				mobileApp.um.logout();
			}
		},"Logout?",['No','Logout'])
	}

	transitionFinished(){ }
	cleanup(){
        mobileApp.um.removeEventListener('userProfileUpdated', this.profileUpdateProxy);
		super.cleanup();
	}

}

export default Profile;
