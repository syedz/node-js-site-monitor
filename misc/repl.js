/**
 * Example REPL (Read Eval Print Loop) server
 * Take in the world "fizz" and logout "buzz"
 */

// Dependencies
var repl = require('repl');

// Start the REPL
repl.start({
    prompt: '>',
    eval: function(str) {
        // Evaluation function for incoming inputs
        console.log('At the evaluation stage: ', str);

        // If the user said "fizz", say "buzz" back to them
        if (str.indexOf('fizz') > -1) {
            console.log('buzz');
        }
    }
});
