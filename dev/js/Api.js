class API {
    constructor(server) {
        this.token = null;
        this.apiPath = server + "api/club/";
        this.customerApiPath = server + "api/";
        this.saveDataTimer = 0;
    }

	sendForgotPassword(username,birthday){
		return $.ajax({
            url: this.apiPath + "forgotpass",
            type: 'POST',
			data : {username,birthday},
            dataType: 'json'
        });
	}

	getLoyaltySettings(){
		return $.ajax({
            url: this.apiPath + `settings`,
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
            dataType: 'json'
        });
	}

	generatePass(){
		return $.ajax({
            url: this.apiPath + `generate-pass/${mobileApp.currentUser.id}`,
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'POST',
            dataType: 'json'
        });
	}

	updateUserInfo(data){
		return $.ajax({
            url: this.apiPath + `user/${data.id}`,
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'PATCH',
			data : data,
            dataType: 'json'
        });
	}

	updateProfileImage(id,formData){
		return $.ajax({
            url: this.apiPath + `user/${id}/photo`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            type: "POST",
            dataType: 'json'
        });
	}

    checkAppVersion() {
        return $.ajax({
            url: this.apiPath + "check_version/",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
            dataType: 'json'
        });
    }

    /**
     *
     * @param formData
     * @returns {*}
     */
    createUserAccount(userData) {
		console.log(userData);
        return $.ajax({
            url: this.apiPath + "user/create",
            data: userData,
            dataType: 'json',
            type: 'POST'
        });
    }
    /**
     *
     * @param username
     * @param password
     * @returns {*}
     */
    login(username, password) {
        return $.ajax({
            url: this.apiPath + "login/",
            data: {
                username: username,
                password: password
            },
            type: 'POST',
            dataType: "json"
        });
    }


	/**
	 * [getLoyaltyPrograms description]
	 * @method getLoyaltyPrograms
	 * @param  {[type]} user_id [description]
	 * @return {[type]} [description]
	 */
	getLoyaltyPrograms(user_id) {
		return $.ajax({
			url: this.apiPath + `user/${user_id}/programs`,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
			}.bind(this),
			dataType: 'json',
			type: 'GET'
		});
	}


	getUserActivity(user_id) {
		return $.ajax({
			url: this.apiPath + `user/${user_id}/activity`,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
			}.bind(this),
			dataType: 'json',
			type: 'GET'
		});
	}

	/**
     *
     * @param formData
     * @returns {*}
     */
    joinProgram(customer_id,user_id,referral) {
        return $.ajax({
            url: this.apiPath + `user/${user_id}/enroll/${customer_id}`,
            data:{
                referral
            },
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            dataType: 'json',
            type: 'POST'
        });
    }

    leaveProgram(customer_id,user_id) {
        return $.ajax({
            url: this.apiPath + `user/${user_id}/leave/${customer_id}`,
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            dataType: 'json',
            type: 'POST'
        });
    }


	/**
     *
     * @param formData
     * @returns {*}
     */
    redeemReward(customer_id,user_id,id) {
        return $.ajax({
            url: this.apiPath + `user/${user_id}/customer/${customer_id}/reward/redeem/${id}`,
			beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            dataType: 'json',
            type: 'POST'
        });
    }


    /**
     *
     * @returns {*}
     */
    getCategories() {
        return $.ajax({
            url: this.apiPath + "business/categories",
            type: 'GET',
            dataType: 'json'
        });
    }


	/**
     *
     * @returns {*}
     */
    getRewards(customer_id) {
        return $.ajax({
            url: this.customerApiPath + `${customer_id}/rewards/all`,
            type: 'GET',
            dataType: 'json'
        });
    }

	/**
     *
     * @returns {*}
     */
    getEvents(customer_id) {
        return $.ajax({
            url: this.customerApiPath + `${customer_id}/events/all`,
            type: 'GET',
            dataType: 'json'
        });
    }

    getOptions() {
        if (this.token == null || this.token == undefined) {
            mobileApp.alert("No Token Found")
        }
        return $.ajax({
            url: this.apiPath + "purchaseOptions/all",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
            dataType: 'json'
        });
    }

    getUserByEmail(email) {
        return $.ajax({
            url: this.apiPath + `user/${email}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
            dataType: 'json'
        });
    }

    /**
     *
     * @returns {*}
     */
    getUser() {
        if (this.token == null || this.token == undefined) {
            mobileApp.alert("No Token Found")
        }
        return $.ajax({
            url: this.apiPath + "user/userByToken",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
            dataType: 'json'
        });
    }

    /**
     *
     * @returns {*}
     */
    saveUserData() {
        if (this.saveDataTimer) {
            clearTimeout(this.saveDataTimer);
        }

        this.saveDataTimer = setTimeout(() => {
            $.ajax({
                url: this.apiPath + "user/data/",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
                }.bind(this),
                data: {
                    app_data: JSON.stringify(mobileApp.um.currentUser.app_data)
                },
                type: 'POST',
                dataType: 'json'
            });
        });
    }

    createPurchase(data) {
        return $.ajax({
            url: this.apiPath + "purchase",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    }

    normalizeAjaxRequest(request) {
        // I take the AJAX request and return a new deferred object
        // that is able to normalize the response from the server so
        // that all of the done/fail handlers can treat the incoming
        // data in a standardized, unifor manner.

        var normalizedRequest = $.Deferred();

        // Bind the done/fail aspects of the original AJAX
        // request. We can use these hooks to resolve our
        // normalized AJAX request.
        request.then(
            // SUCCESS hook. ------ //
            // Simply pass this onto the normalized
            // response object (with a success-based resolve).
            normalizedRequest.resolve,

            // FAIL hook. -------- //
            function(xhr) {
                // Check to see what the status code of the
                // response was. A 500 response will represent
                // an unexpected error. Anything else is simply
                // a non-20x error that needs to be manually
                // parsed.
                if (xhr.status == 500) {

                    // Normalize the fail() response.
                    normalizedRequest.reject({
                            success: false,
                            data: "",
                            errors: ["Unexpected error."],
                            statusCode: xhr.statusCode()
                        },
                        "error",
                        xhr
                    );

                } else {
                    // Normalize the non-500 "failures."
                    normalizedRequest.reject(
                        $.parseJSON(xhr.responseText),
                        "success",
                        xhr
                    );
                }

            }
        );

        // Return the normalized request object. This deferred
        // object can then be used by the calling context to
        // deal with success and failure. By normalizing it, both
        // the success and error handlers will be able to assume
        // that the response is coming in the same format.
        //
        // NOTE: Calling the .promise() method creates a read-only
        // interace to the deferred object such that the receiving
        // context can only hook into the object, not mutate it.
        return (normalizedRequest.promise());
    };
}
export {
    API
}
