/**
 * Converts raw AFINN data to JSON hash table.
 *
 * @package sentiment
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async   = require('async'),
    fs      = require('fs');

var accents     = "áéíóúàâêôãõÁÉÍÓÚÀÂÊÔÃÕ";
var no_accents  = "aeiouaaeoaoAEIOUAAEOAO";

/**
 * Read AFINN data from original format
 */
fs.readFile(__dirname + '/AFINN.txt', function (err, data) {
    // Storage object
    var hash = new Object(null);

    // Split lines
    var lines = data.toString().split(/\n/);
    console.dir(lines);
    async.forEach(lines, function (obj, callback) {
        var item = obj.split(/\t/);
        hash[item[0]] = Number(item[1]);
        callback();
    }, function (err) {
        if (err) throw new Error(err);

        // Write out JSON
        fs.writeFile(
            __dirname + '/AFINN.json', 
            JSON.stringify(hash), 
        function (err) {
            if (err) throw new Error(err);
            console.log('Complete.');
        });
    });
});

/**
 * Read SentiLex data from original format. SentiLex will provide 
 */
fs.readFile(__dirname + '/SentiLex-flex-PT02.txt', function (err, data) {
    // Storage object
    var hash = new Object(null);

    // Split lines
    var lines = data.toString().split(/\n/);
    // console.dir(lines);
    async.forEach(lines, function (obj, callback) {
        var items = obj.split(/;/);
        var keys = items[0].split(/[,.]/);
        var value_1 = Number(items[3].split(/=/)[1]);
        var value_2 = Number(items[4].split(/=/)[1]);
        var value = value_1 + ((isNaN(value_2) === false) ? value_2 : 0);
        console.assert(isNaN(value) === false && isFinite(value) === true);
        hash[keys[0]] = Number(value);
        hash[keys[1]] = Number(value);

        for(var i = 0; i < accents.length; ++i) {
            keys[0] = keys[0].replace(accents[i], no_accents[i]);
            keys[1] = keys[1].replace(accents[i], no_accents[i]);
        }
        hash[keys[0]] = Number(value);
        hash[keys[1]] = Number(value);

        callback();
    }, function (err) {
        if (err) throw new Error(err);

        // Write out JSON
        fs.writeFile(
            __dirname + '/SentiLex-flex-PT01.json', 
            JSON.stringify(hash), 
        function (err) {
            if (err) throw new Error(err);
            console.log('Complete.');
        });
    });
});