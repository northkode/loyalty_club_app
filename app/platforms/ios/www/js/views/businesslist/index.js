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

		mobileApp.changeApplicationState('#program',{viewData:customer});
	}

	transitionFinished() {

	}

}

export default BusinessList;
