/**
 * Example TLS Client
 * COnnects to port 6000 and sends the word "ping" to the server
 */

// Dependencies
var tls = require('tls');
var fs = require('fs');
var path = require('path');

// Server options
var options = {
    ca: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // Only required because we're using a self signed certificate
};

// Define the message to send
var outboundMessage = 'ping';

// Create the client
var client = tls.connect(
    6000,
    options,
    function() {
        // Send the message
        client.write(outboundMessage);
    }
);

// When the srver writes back, log what it says then kill the client
client.on('data', function(inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log('I wrote ' + outboundMessage + ' and they said ' + messageString);
    client.end();
});
