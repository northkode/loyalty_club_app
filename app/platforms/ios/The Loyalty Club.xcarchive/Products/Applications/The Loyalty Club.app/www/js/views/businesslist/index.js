require('./styles.scss');
import DefaultAppView from "../../framework/core/DefaultAppView";

class BusinessList extends DefaultAppView {

	constructor(route, viewData) {
		super(route, viewData);
		this.template = _.template(require('./template.tpl'));
	}

	attachListeners() {
		super.attachListeners();
		this.registerListener('click', this.customerSelected, '.customer');
	}

	customerSelected(e) {
		var id = $(e.currentTarget).attr('data-id');
		for (var i = 0; i < this.viewData.category.customers.length; i++) {
			var customer = this.viewData.category.customers[i];
			if (customer.id == id) {
				break;
			}
		}

<<<<<<< HEAD
		// if i am logged in make sure the programs i'm browsing show my enrolled status
		if(mobileApp.currentUser){
		 	var customers = mobileApp.currentUser.programs.filter(program => { return program.id == customer.id });
			if(customers.length == 1){
				customer = customers[0]; // use the customer data from the logged in person so it shows points and other activity
			}
		}
		mobileApp.changeApplicationState('#program',{viewData:customer});
	}

	transitionFinished() { }
=======
		mobileApp.changeApplicationState('#program',{viewData:customer});
	}

	transitionFinished() {

	}
>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f

}

export default BusinessList;
