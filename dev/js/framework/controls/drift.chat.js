class drift {
    constructor() {}

    init() {
        window.drift.load('iwih7rar6k8i')
        window.drift.on('ready', api => {
            this.driftReady(api);
        })
    }

    driftReady(api) {
        this.api = api;
		this.api.widget.hide();
        // hide the widget when you close the sidebar
        window.drift.on('sidebarClose', e => { this.onSideBarClose(e); });
        window.drift.on('message', e => { this.onReceivedMessage(e) });
		$(document).on('click','.user-support',()=>{this.show()});
		this.counter = 0;
    }

	show(){
		this.api.widget.show();
		this.api.sidebar.open()
		$('.user-support').hide();
		this.counter = 0;
	}

	hide(){
		this.api.widget.hide();
		this.api.sidebar.close()
	}

	onReceivedMessage(e) {
		if(e.data.widgetVisible) return;
		this.counter += 1;
		$('.user-support .counter').text(this.counter).show();
		$('.user-support').show()
	}

    onSideBarClose(e) {
        if (e.data.widgetVisible) {
            this.api.widget.hide();
			mobileApp.goBack();
        }
    }
}

export default drift;
