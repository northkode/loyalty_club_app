class StateManager {
	constructor(){
		this.logOb = null;
		this.stateProxy = $.proxy(this.onLoadNextState,this);
	}
    init() {
		var promise = $.Deferred();
		if(!window.cordova) return promise.resolve(false);
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dir) => {
            dir.getFile("state.txt", {
                create: true
            }, (file) => {
				console.log(file)
                this.logOb = file;
				promise.resolve(file);
            });
        },(e)=>{
			promise.reject(e);
		});
		return promise;
    }

	checkState(){
		var p = $.Deferred();
		var promise = this.readState();
		promise.done(state => {
			if(state.length > 1){
				p.resolve(state);
			}else{
				p.reject(false);
			}
		});
		promise.fail(result=>{
			p.reject(result);
		})
		return p;
	}

    fail(e) {
        console.log("FileSystem Error");
        console.dir(e);
    }

    writeState(str) {
        if (!this.logOb) return;
        this.logOb.createWriter(function(fileWriter) {
            //fileWriter.seek(fileWriter.length);
            var blob = new Blob([str], {
                type: 'text/plain'
            });
            fileWriter.write(blob);
        }, StateManager.fail);
    }

	clearState() {
		this.writeState("[]"); // write a blank state
	}

    readState() {
		var promise = $.Deferred();
		if (!this.logOb) {
			console.log("can not find log file");
			promise.reject(false);
			return promise;
		}
        this.logOb.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
				var data;
				try {
					data = JSON.parse(this.result);
					promise.resolve(data);
				}catch(e){
					promise.reject(false);
				}
			 };
            reader.readAsText(file);
        }, (e)=>{promise.reject(e);});
		return promise;
    }

    static registerState(url, view) {
        StateManager.states = StateManager.states || {};
        StateManager.states[url] = view;
        return StateManager;
    }

    // get the state class for the url
    static getState(url) {
        return StateManager.states[url.split('/').join('')];
    }

    // save application state
    saveState() {
		if(!window.cordova) return;
        var array = [];
        var list = mobileApp.history.history;
        try {
			// get all the cached states and save them
            for (var i = 0; i < list.length; i++) {
                var state = list[i];
                array.push({
					id:i, /*use this for sorting later*/
                    label: '#'+state.label,
                    state: state.viewInstance.getState()
                });
            }
			array.push({
					id:++i, /*use this for sorting later*/
                    label: mobileApp.currentView.route.value,
                    state: mobileApp.currentView.getState()
                }); // now get the current state and save that too
            this.writeState(JSON.stringify(array));
        } catch (e) {
			console.log(e);
            Raven.captureException(e);;
        }
    }

    // restore the application state
    restoreState(stateList) {
		// remove the state from the phone now just in case something goes wrong
		// the user can kill the app and reopen no problemo
		this.clearState();

		mobileApp.addEventListener("VIEW_STARTING",this.stateProxy);
		this.state = stateList;
		if(this.state){
			this.onLoadNextState();
		} else { // if we didn't pass in data then grab id and run restore again
			var data = this.readState();
			data.done(data => {
				this.restoreState(data);
			})
		}
    }

	onLoadNextState(e){
		if(!this.state.length) {
			mobileApp.removeEventListener("VIEW_STARTING",this.stateProxy);
			var event = new Event(MobileEvents.STATE_RESTORED);
			mobileApp.dispatchEvent(event);
			return;
		};

		var obj = this.state.shift();
		mobileApp.changeApplicationState(obj.label,{
			viewData:new State(obj.state),
			animate:false
		});
	}
}

export default StateManager;
