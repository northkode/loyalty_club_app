require('./app.scss');

import {config} from "./config";
import Loader from "./framework/core/Loader";
/** animation engine **/
import "./vendor/TweenMax.min";


import RanchApp from "./RanchApp";

function ready(){
	console.log("app is ready...starting")

	if(window.cordova && navigator.connection && navigator.connection.type == Connection.NONE){
		alert("you are not connected to the internet. Please connect before running TradePros");
		return;
	}

	document.addEventListener("offline", ()=>{
		if(mobileApp){
			window.location = "index.html#nointernet";
		}
	}, false);

	document.addEventListener("online", ()=>{
		if(window.mobileApp){
			window.mobileApp.goBack();
		}
	}, false);

	window.mobileApp = new RanchApp(config);
}

function fail() { }

let apploader = new Loader(config,ready,fail);

window.onerror = function (msg, url, lineNo, columnNo, error) {
  alert(msg);
  return false;
}
