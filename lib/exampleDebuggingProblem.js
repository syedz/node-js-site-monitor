/**
 * Library that demonstrates something throwing ewhen it's init() is called
 */

// Container for the module
var example = {};

// Init function
example.init = function() {
    // This is an error created intentionally (bar is not defined)
    var foo = bar;
};

// Export the module
module.exports = example;
