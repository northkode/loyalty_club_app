
import { Event } from "events/Event";
import { EventDispatcher } from "events/EventDispatcher";

class GoogleMap {
	constructor(hasAutoComplete,options){
		this.options = options;

		this.radiusCircle = {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.3,
			fillColor: "#f7bd21",
			strokeOpacity: 1.0,
			strokeColor: "#f7bd21",
			strokeWeight: 1.0,
			scale: 30
		};

		if(!window.googleMap){
			window.googleMap = new google.maps.Map($('#google-map')[0], {
				zoom: 13,
				center: {lat: 53.544389, lng: -113.490927},
				mapTypeControl: false,
				panControl: false,
				draggable:false,
				zoomControl:false,
				streetViewControl: false
			});
			this.places = new google.maps.places.PlacesService(window.googleMap);
		}


		if(hasAutoComplete) {
			this.autocomplete = new google.maps.places.Autocomplete(
				document.getElementById(options.autocomplete), {
				componentRestrictions:  {'country': 'ca'}
			});
			/** fix for auto complete not clicking on ios **/
			setTimeout(function(){
				document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true')
				//Fix for fastclick issue
				var g_autocomplete = $("body > .pac-container").filter(":visible");
				g_autocomplete.on('DOMNodeInserted DOMNodeRemoved', function(event) {
					$(".pac-item", this).addClass("needsclick");
				});
				//End of fix
			},1000);
			this.autocomplete.addListener('place_changed', this._onPlacedChanged.bind(this));
		}
	}

	_onPlacedChanged(e){
		console.log('test',e);
		var place = this.autocomplete.getPlace();
		if (place.geometry) {
			var event = new Event('PlaceFound');
			event.place = place;
			this.dispatchEvent(event);
		}
	}

	cleanup(){
		var g_autocomplete = $("body > .pac-container").filter(":visible");
		g_autocomplete.off('DOMNodeInserted DOMNodeRemoved');

		this.htmlHolder.appendTo($('body')); // move the map back to the body to store for later
		this.htmlHolder.hide();
		if(this.circle){
			this.circle.setMap(null);
			this.circle = null;
		}
		if(this.autocomplete) {
			this.autocomplete.unbindAll();
			google.maps.event.clearInstanceListeners(document.getElementById(this.options.autocomplete));
			this.autocomplete = null;
			$(".pac-container").remove();
		}
	}

	set location(value) {
		var latLng = new google.maps.LatLng(value.latitude, value.longitude);
		this.circle = new google.maps.Marker({
			icon: (this._locationHidden) ? this.radiusCircle : null,
			position: latLng,
			map:this.map
		});
		setTimeout(()=>{
			this.map.setCenter(latLng);
			this.invalidate();
		},150);
	}

	invalidate(){
		setTimeout(() => {
			google.maps.event.trigger(this.map, 'resize');
		},100);
	}

	set isLocationHidden(value) {
		this._locationHidden = value;
	}

	get map() {
		return window.googleMap;
	}

	get htmlHolder() {
		return $('#google-map');
	}
}

EventDispatcher.initialize(GoogleMap.prototype);

export default GoogleMap;
