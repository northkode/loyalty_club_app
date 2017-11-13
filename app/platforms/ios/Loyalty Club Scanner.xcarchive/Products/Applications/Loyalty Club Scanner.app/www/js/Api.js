class API {
    constructor(server) {
        this.token = null;
        this.apiPath = server + "api/club/";
        this.customerApiPath = server + "api/";
        this.saveDataTimer = 0;
    }

    sendForgotPassword(username, birthday) {
        return $.ajax({
            url: this.apiPath + "forgotpass",
            type: 'POST',
            data: {
                username,
                birthday
            },
            dataType: 'json'
        });
    }

    getLoyaltySettings() {
        return $.ajax({
            url: this.apiPath + `settings`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            }.bind(this),
            type: 'GET',
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
     * @param username
     * @param password
     * @returns {*}
     */
    login(username, password) {
        return $.ajax({
            url: this.customerApiPath + `${this.customerId}/login/`,
            data: {
                username: username,
                password: password
            },
            type: 'POST',
            dataType: "json"
        });
    }
    /**
     *
     * @param username
     * @param password
     * @returns {*}
     */
    getCustomerId(id) {
        return $.ajax({
            url: this.apiPath + "customer/" + id,
            type: 'GET',
            dataType: "json"
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
            url: this.customerApiPath + `${this.customer_id}/employee/byToken`,
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
        return;
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
            url: this.customerApiPath + `${this.customer_id}/purchase`,
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
