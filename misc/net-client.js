/**
 * Example TCP (Net) Client
 * COnnects to port 6000 and sends the word "ping" to the server
 */

// Dependencies
var net = require('net');

// Define the message to send
var outboundMessage = 'ping';

// Create the client
var client = net.createConnection({ port: 6000 }, function() {
    // Send the message
    client.write(outboundMessage);
});

// When the srver writes back, log what it says then kill the client
client.on('data', function(inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log('I wrote ' + outboundMessage + ' and they said ' + messageString);
    client.end();
});
