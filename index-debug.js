/*
    Primary file for the API
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
var app = {};

// Init function
app.init = function() {
    // Start the server
    debugger;
    server.init();
    debugger;

    // Start the workers
    debugger;
    workers.init();
    debugger;

    // Start the CLI, but make sure it starts last
    debugger;
    setTimeout(function() {
        cli.init();
    }, 50);
    debugger;

    // Set foo at 1
    debugger;
    var foo = 1;
    console.log('Just assigned 1 to foo');
    debugger;

    // Incremented foo
    foo++;
    console.log('Just increated foo');
    debugger;

    // Squared foo
    foo = foo * foo;
    console.log('Just squared foo');
    debugger;

    // Convert foo to a string
    foo = foo.toString();
    console.log('Just converted foo to string');
    debugger;

    // Call the init script that will throw
    exampleDebuggingProblem.init();
    console.log('Just called the library');
    debugger;
};

// Execute
app.init();

// Export the app
module.exports = app;
