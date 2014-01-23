var assert = require('assert');
var parser = require('../index');

var TEST_PDF_FILE = './test/CDW_QUOTE_ANON.PDF';
/*
 * Run these tests with
 *
 *    $ npm test
 * 
 * Note: this isn't quite the canonical way to write tests in Mocha[1]. You'd usually
 * invoke the functionality you're testing once in an "it" call and make many assertions
 * on each requirement of the output. I structured it this way so that the test output
 * will more closely align with your progress. More and more tests will pass as you get
 * closer, instead of having a single test that succeeds or fails.
 *
 * These tests are written in Mocha[1]. See the docs there for more details.
 *
 * [1] http://visionmedia.github.io/mocha/
 */

describe('PDF Parsing', function() {
    it('should parse the pdf and return a valid structure', function (callback) {
        // there are 34 items in the inventory
        parser.parse(TEST_PDF_FILE, function (err, results) {
            assert.ifError(err);
            assert(results && results.items && results.items.length > 0);
            callback();
        });
    });
    it('should parse invoice items from the pdf', function (callback) {
        // there are 34 items in the inventory
        parser.parse(TEST_PDF_FILE, function (err, results) {
            assert.ifError(err);
            assert(results && results.items);
            assert.equal(results.items.length, 34);
            assert.equal(results.items[0].quantity, 3);
            assert.equal(results.items[0].unitPrice, 2100);
            assert.equal(results.items[0].extendedPrice, 6300);
            assert.equal(results.items[0].mfgPart, 'MBL-P72-04219');
            callback();
        });
    });
    // Remove the .skip if you're feeling more ambitious.
    it.skip('should read addresses from the pdf', function (callback) {
        parser.parse(TEST_PDF_FILE, function (err, results) {
            assert.ifError(err);
            assert(results && results.addresses);
            assert.equal(results.addresses.length, 4);
            assert.equal(results.addresses[0].name, 'XXXX LLC');
            assert(/1234 MAIN ST\w+XXX/ig.test(results.addresses[0].street));
            assert.equal(results.addresses[0].city, 'CHICAGO');
            assert.equal(results.addresses[0].state, 'IL');
            assert.equal(results.addresses[0].zip, '60601');
            callback();
        });
    });
});
