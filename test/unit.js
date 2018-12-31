/**
 * Unit Tests
 */

// Dependencies
var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');

// Holder for tests
var unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return number'] = function(done) {
    var val = helpers.getANumber();
    assert.equal(typeof val, 'number');
    assert.equal(val, 1);
    done();
};

// Logs.list should call back an array and a false error
unit['logs.list should callback a false eror and an array of log names'] = function(done) {
    logs.list(true, function(err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);

        done();
    });
};

// Logs truncate should not throw if the logId doesn't exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = function(
    done
) {
    assert.doesNotThrow(function() {
        logs.truncate('I do not exist', function(err) {
            assert.ok(err);
            done();
        });
    }, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
// unit['exampleDebuggingProblem.init should not throw when called'] = function(done) {
//     assert.doesNotThrow(function() {
//         exampleDebuggingProblem.init();
//         done();
//     }, TypeError);
// };

// Export the test to the runner
module.exports = unit;
