require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class Admin extends DefaultAppView {
    constructor(route, viewData) {
        super(route, viewData);
        this.template = _.template(require('./template.tpl'));
        this.profile = _.template(require('./userProfile.tpl'));
    }

    attachListeners() {
        super.attachListeners();
        this.registerListener('click', this.onScanStart, '.scan');
        this.registerListener('click', this.onCreatePurchase, '.submit');
        this.registerListener('click', this.onLogout, '.logout');
        this.registerListener('click', this.onCancelScan, '.cancelScan');
        this.registerListener('click', this.onRestartScan, '.restartScan');
        this.registerListener('click', this.closeUser, '.close');
        this.registerListener('click', this.selectOption, '.option');
    }

    selectOption(e) {
        $('.option').removeClass('active');
        $(e.currentTarget).addClass('active');
    }

    closeUser(e) {
        $(e.currentTarget).parent().remove();
    }

    onLogout(e) {
        mobileApp.confirm("Are you sure you want to logout", (btn) => {
            if (btn == 2) {
                mobileApp.um.logout()
            }
        }, "Logout?", ['No', 'Logout'])
    }

    handleViewState() {
        super.handleViewState();
        this.options = mobileApp.currentUser.departments[0].options;
    }

    onRestartScan() {
        QRScanner.cancelScan();
        QRScanner.scan(this.displayContents.bind(this));
    }

    prepareScanner(err, status) {
        if (err) {
            console.error(err._message);
        } else {
            console.log('QRScanner is initialized. Status:');
            console.log(status);
            QRScanner.scan(this.displayContents.bind(this));
            QRScanner.show();
            $('.application-content')[0].style.display = 'none';
            setTimeout(() => {
                $('.application-content')[0].style.display = 'block';
            }, 400);
            this.getViewInstance().addClass('scanning');
        }
    };

    onScanStart() {
        QRScanner.prepare(this.prepareScanner.bind(this));
    }

    onCancelScan() {
        QRScanner.cancelScan();
        QRScanner.hide();
        this.getViewInstance().removeClass('scanning');
    }

    onCreatePurchase(e) {
        e.preventDefault();
        var data = new FormData(this.getViewInstance().find('.user-profile form')[0]);
        data.append('purchase_options_id', $('.option.active').attr('data-id'))
        $(e.currentTarget).addClass('active');
        var promise = mobileApp.api.createPurchase(data);
        promise.done(data => {
            $(e.currentTarget).removeClass('active').addClass("done").html('<i class="jelly-animation fa fa-check" style="color:white"></i>');
            setTimeout(() => {
                this.getViewInstance().find('.user-profile').remove();
            }, 2000);
        });
    }

    displayContents(err, text) {
        if (err) {
            // an error occurred, or the scan was canceled (error code `6`)
            console.log(err)
			if(err.code != 6) {
				mobileApp.alert('There was an error processing this request. Please contact support.',function(){},"Scanner");
			}
            this.onCancelScan();
        } else {
            // The scan completed, display the contents of the QR code:
            this.onCancelScan();
			try {
				var user = JSON.parse(text);
	            var options = this.options;
	            var content = this.profile({ user, options });
	            this.getViewInstance().find('.content').append(content);
			}catch(e){
				mobileApp.alert('There was an error scanning this QR code. Please contact The Ranch Golf and Country Club.',function(){},"Scanner");
			}

        }
    }

    transitionFinished() {}

}

export default Admin;
