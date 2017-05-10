/**
 * Created by kjeske_imac on 15-11-15.
 */
import FastClick from "../utils/fastclick";

export default class Loader {
	constructor(settings,successCB,failCB){
		this.settings = settings;
		this.cb = { successCB,failCB }
		this.init();
		this.promise = $.Deferred();
	}
	init(){
		this.bindEvents(this.getMobileOperatingSystem());
	}

	bindEvents(device){
		if(device == "Android" || device == "iOS" && window.cordova){
			document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		}else{
			$(() => { this.onDeviceReady(); });
		}
	}

    onDeviceReady(e){
		FastClick.attach(document.body, { excludeNode: '^pac-'});
        if(!window.cordova) { window.spinnerplugin = {show:function(){},hide:function(){}}; }
		this.preloadImages(this.settings.preloadImages).then(() => {
			this.cb.successCB.call(window);
		},()=>{
			console.log("image failed to load",arguments);
			this.cb.failCB.call(window);
		})
    };


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

    preloadImages(srcs,imgs,callback){
        function loadImage(src) {
            return new $.Deferred(function(def) {
                var img = new Image();
                img.onload = function() {
                    def.resolve(img);
                };
                img.onerror = img.onabort = function() {
                    def.reject(src);
                };
                img.src = src;
            }).promise();
        }
        var promises = [];
        for (var i = 0; i < srcs.length; i++) { promises.push(loadImage(srcs[i])); }
        return $.when.apply($, promises).then(function() {
            // return results as a simple array rather than as separate arguments
            return Array.prototype.slice.call(arguments);
        });
    }

	getMobileOperatingSystem() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
			return 'iOS';
		} else if( userAgent.match( /Android/i ) ) {
			return 'Android';
		} else {
			return 'unknown';
		}
	};
}
