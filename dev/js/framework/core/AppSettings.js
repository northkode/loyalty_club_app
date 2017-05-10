class AppSettings {

	constructor(){
		this.logOb = null;
		this.timer = 0;
	}

    init() {
		var promise = $.Deferred();
		this.settings = {};
		if(!window.cordova) return promise.resolve();
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dir) => {
            dir.getFile("settings.txt", {
                create: true
            }, (file) => {
                this.logOb = file;
				var p = this.getSettings();
				p.done((data) => { this.settings = data; promise.resolve(true) });
				p.fail(() => { this.settings = {}; promise.resolve(true); });
            });
        },(e)=>{
			promise.reject(e);
		});
		return promise;
    }

	setItem(key,value) {
		this.settings[key] = value;
		if(this.timer) { clearTimeout(this.timer); }
		this.timer = setTimeout(this.writeSettings.bind(this),300);
	}

	removeItem(key,value) {
		delete this.settings[key];
		if(this.timer) { clearTimeout(this.timer); }
		this.timer = setTimeout(this.writeSettings.bind(this),300);
	}

	getItem(key) {
		return this.settings[key];
	}

	getSettings(){
		var p = $.Deferred();
		var promise = this.readSettings();
		promise.done(settings => {
			p.resolve(settings);
		});
		promise.fail(result => {
			p.resolve({});
		})
		return p;
	}

    fail(e) {
        console.log("FileSystem Error");
        console.dir(e);
    }

    writeSettings() {
        if (!this.logOb) return;
        this.logOb.createWriter((fileWriter) => {
            var blob = new Blob([JSON.stringify(this.settings)], {
                type: 'text/plain'
            });
            fileWriter.write(blob);
        }, AppSettings.fail);
    }

	clearSettings() {
		this.settings = {};
		this.writeSettings(); // write a blank state
	}

    readSettings() {
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
					if(this.result == ''){ this.result = '{}'; }
					data = JSON.parse(this.result);
					promise.resolve(data);
				}catch(e){
					promise.reject({});
				}
			 };
            reader.readAsText(file);
        }, (e)=>{promise.reject(e);});
		return promise;
    }

}

export default AppSettings;
