/*
    Primary file for the API
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
// var _data = require('./lib/data');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

// @TODO GET RID OF THIS
// helpers.sendTwilioSms('9055801151', 'Hello', function(err) {
//     console.log('This was the error', err);
// });

// TESTING
// @TODO delete this
// _data.write('test', 'newFile', { foo: 'bar' }, function(err) {
//     console.log('This was the error', err);
// });

// _data.read('test', 'newFile', function(err, data) {
//     console.log('This was the error', err, 'and this was the data', data);
// });

// _data.update('test', 'newFile', { fizz: 'buzz' }, function(err) {
//     console.log('This was the error', err);
// });

// _data.delete('test', 'newFile', function(err) {
//     console.log('This was the error', err);
// });

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, function() {
    console.log('The server is listening on port ' + config.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function() {
    console.log('The server is listening on port ' + config.httpsPort);
});

// All the server logic for both the http and https server
var unifiedServer = function(req, res) {
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data) {
        // Data event will not always be called
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        // End event will always get called
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found use the not found handlers
        var chosenHandler =
            typeof router[trimmedPath] !== 'undefined'
                ? router[trimmedPath]
                : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // Use the status code caled back by the hanlder, or default to 200
            statusCode = typeof statusCode == 'number' ? statusCode : 200;

            // Use the payload called back byt the handler, or default to an empty object
            payload = typeof payload == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log(
                'Returning this response: ' + statusCode,
                payloadString
            );
        });
    });
};

// Define a request router
var router = {
    // sample: handlers.sample
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};
