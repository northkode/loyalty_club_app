/**
 * Created by kjeske_imac on 15-11-15.
 */
import DefaultAppView  from "../core/DefaultAppView";

class NoInternet extends DefaultAppView {
    constructor(route,viewData){
        super(route,viewData);
        this.template = _.template(require('../templates/NoInternet.tpl'));
    }

	attachListeners() {
		super.attachListeners();
		this.registerListener('click',this.onRetryConnection,'button');
	}

	onRetryConnection(){
		if(this.checkNetworkConnection() != 'No network connection') {
			mobileApp.goBack();
		}
	}

	checkNetworkConnection(){
		var networkState = navigator.connection.type;
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		return states[networkState];
	}
}

export default NoInternet;
