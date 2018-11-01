/*
    Request Handlers
*/

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
    // Check that all required fields are filled out
    var firstName =
        typeof data.payload.firstName == 'string' &&
        data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;
    var lastName =
        typeof data.payload.lastName == 'string' &&
        data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;
    var phone =
        typeof data.payload.phone == 'string' &&
        data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false;
    var password =
        typeof data.payload.password == 'string' &&
        data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;
    var tosAgreement =
        typeof data.payload.tosAgreement == 'boolean' &&
        data.payload.tosAgreement == true
            ? true
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't alrady exist
        _data.read('users', phone, function(err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    // Create the user object
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashPassword: hashedPassword,
                        tosAgreement: tosAgreement
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                Error: 'Could not create the new user'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        Error: "Could not has the user's password"
                    });
                }
            } else {
                // User already exists
                callback(400, {
                    Error: 'A user with that phone number already existss'
                });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Don't let them access anyone else's
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    var phone =
        typeof data.queryStringObject.phone == 'string' &&
        data.queryStringObject.phone.trim().length == 10
            ? data.queryStringObject.phone.trim()
            : false;

    if (phone) {
        // Lookup the user
        _data.read('users', phone, function(err, data) {
            if (!err && data) {
                console.log(data);
                // Remove the hashed password from the user object before returning it to the requester
                delete data.hashPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO: Only let an authenticatd user update their own object. Don't let them update anyone else's.
handlers._users.put = function(data, callback) {
    // Check for required field
    var phone =
        typeof data.payload.phone == 'string' &&
        data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false;

    // Check for optional fields
    var firstName =
        typeof data.payload.firstName == 'string' &&
        data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;
    var lastName =
        typeof data.payload.lastName == 'string' &&
        data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;
    var password =
        typeof data.payload.password == 'string' &&
        data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

    // Error if phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, function(err, userData) {
                if (!err && userData) {
                    // Update the fields if necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                Error: 'Could not update the user.'
                            });
                        }
                    });
                } else {
                    callback(400, { Error: 'Specified user does not exist.' });
                }
            });
        } else {
            callback(400, { Error: 'Missing fields to update.' });
        }
    } else {
        callback(400, { Error: 'Missing required field.' });
    }
};

// Users - delete
// Required field: phone
// @TODO: Only let an authenticated user delete their object. Don't let them delete anyone else's
// @TODO: Cleanup (delete) any other data files associated with this user
handlers._users.delete = function(data, callback) {
    // Check that the phone number is valid
    var phone =
        typeof data.queryStringObject.phone == 'string' &&
        data.queryStringObject.phone.trim().length == 10
            ? data.queryStringObject.phone.trim()
            : false;

    if (phone) {
        // Lookup the user
        _data.read('users', phone, function(err, data) {
            if (!err && data) {
                _data.delete('users', phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            Error: 'Could not delete the specified user'
                        });
                    }
                });
            } else {
                callback(400, { Error: 'Could not find the specified user' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// Sample handler
// handlers.sample = function(data, callback) {
//     // Callback a http status code, and a payload object
//     callback(406, { name: 'sample handler' });
// };

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the module
module.exports = handlers;
