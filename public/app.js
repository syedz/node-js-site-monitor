/**
 * Frontend logic for the Application
 */

// Container for the frontend application
var app = {};

// Config
app.config = {
    sessionToken: false
};

// AJAX Client (for the restful API)
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
    // Set defaults
    headers = typeof headers == 'object' && headers !== null ? headers : {};
    path = typeof path == 'string' ? path : '/';
    method =
        typeof method == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1
            ? method.toUpperCase()
            : 'GET';
    queryStringObject = typeof queryStringObject == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof payload == 'object' && payload !== null ? payload : {};
    callback = typeof callback == 'function' ? callback : false;

    // For each query string parameters sent, add it to the path
    var requestUrl = path + '?';
    var counter = 0;

    for (queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // If at leaset one query string parameter has already been added, prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }

            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // For each header send, add it to the request
    for (const headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config, sessionToken.id);
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            // Callback if requested
            if (callback) {
                try {
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse);
                } catch (e) {
                    callback(statusCode, false);
                }
            }
        }
    };

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
};
