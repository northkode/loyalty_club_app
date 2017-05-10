class UserAssistant {
    constructor(slides,options={}){
		this.options = options;
        this.slides = slides;
        this.template = _.template(require('../templates/UserAssistant.tpl'));
        this._instance = $(this.template({slides:slides,options:options}));
        $('.application-content').append(this._instance);

        this.handleClickProxy = $.proxy(this._onButtonClicked,this);
        this._instance.on('click','button',this.handleClickProxy);
        if(options.assistant_key == undefined){
            mobileApp.um.currentUser.app_data.user_assistant[window.location.hash] = true;
        }else{
            mobileApp.um.currentUser.app_data.user_assistant[options.assistant_key] = true;
        }
        mobileApp.api.saveUserData();
        return this;
    }

    _onButtonClicked(e){
        e.stopImmediatePropagation();
        e.preventDefault();

		if(this.options.callback){
			this.options.callback($(e.currentTarget).index());
		}
        if(this.slides.length == 1) {
            this._instance.hide();
            this._instance.off('click','button',this.handleClickProxy);
			this.cleanup();
        } else {

        }
		return false;
    }

    show(delay=1000){
        setTimeout(() => { this._instance.show(); },delay);
        return this;
    }

    cleanup(){
        this._instance.off('tap','button',this.handleClickProxy);
        this._instance.remove();
    }

	static checkKey(key){
		return mobileApp.um.currentUser.app_data.user_assistant[key];
	}
}
window.UserAssistant = UserAssistant;
export default UserAssistant;
