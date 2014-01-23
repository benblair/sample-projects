var fs = require('fs');
var child_process = require('child_process');
var path = require('path');

// NOTE: You'll have to install pdftotext (http://linuxappfinder.com/package/poppler-utils).
// The sample file CDW_QUOTE_ANON.PDF contains an anonymized real CDW quote. The accompanying
// text file was generated with pdftotext -layout. You can regenerate it easily. It's just
// there for convinience.

var parseLine = function (line, results) {
    line = line.replace(/^\s+|\s+$/g, '');
    line = line.replace(/\s{2,}/g, ' ');

    var words = line.split(' ');

    var index;
    if ((/^\d+$/.test(words[0])) && (/^\d+$/.test(words[1]))) {
	results.items.push({});
	index = results.items.length - 1;
	results.items[index]["quantity"] = words[0];
	results.items[index]["unitPrice"] = words[words.length-2];
	results.items[index]["extendedPrice"] = words[words.length-1];
    }
    else if (words[0] === "Mfg#:") {
	index = results.items.length - 1;
	results.items[index]["mfgPart"] = words[1];
    }
};

var parseText = function (text, callback) {
    var results = {
        items: [],
        addresses: [],
        warranties: [],
        leaseOptions: [],
        softwareItems: [],
        hardwareItems: [],
        textBlocks: []
    };
    // Start by looking at the converted text file manually. See what patterns you can find
    // and start with simple a RegExp to pull those out.
    // callback(new Error('Parse Not Implemented!'));

    var lines = text.split('\n');
    var i;

    for (i = 0; i < lines.length; i++) {
	parseLine(lines[i], results);
    }

    // Once you have results, you can return them by passing them back to the callback, with null
    // as the error value:
    callback(null, results);
};

var parse = function (filename, callback) {

    var workingDir = (process.env.TMPDIR || './');
    var outputFile = path.resolve(workingDir, 'out.txt');
    // Note, you may want to try other pdftotext args. -layout seems to be good, but please explore.
    var cmd = "pdftotext -layout " + filename + " " + outputFile;

    child_process.exec(cmd, function(err) {
        if (err) {
            return callback(err);
        }
        fs.readFile(outputFile, { encoding: 'utf8'}, function (err, text) {
            if (err) {
                return callback(err);
            }
            parseText(text, callback);
        });
    });
};

module.exports.parse = parse;
