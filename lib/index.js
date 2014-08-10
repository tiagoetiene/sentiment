/**
 * AFINN-based sentiment analysis for Node.js
 *
 * @package sentiment
 * @author Andrew Sliwinski <andrewsliwinski@acm.org>
 */

/**
 * Dependencies
 */
var extend = require('extend-object');
var afinn = require('../build/AFINN.json');
var sentilex = require('../build/SentiLex-flex-PT01.json');

/**
 * Tokenizes an input string.
 *
 * @param {String} Input
 *
 * @return {Array}
 */
function tokenize (input) {
    return input
            .replace(/[^a-zA-ZáéíóúàâêôãõÁÉÍÓÚÀÂÊÔÃÕ ]+/g, '')
            .replace('/ {2,}/',' ')
            .toLowerCase()
            .split(' ');
}

/**
 * Performs sentiment analysis on the provided input "phrase".
 *
 * @param {String} Input phrase
 * @param {Object} Optional sentiment additions to AFINN (hash k/v pairs)
 *
 * @return {Object}
 */
module.exports = function (phrase, inject, callback) {

    var lang = 'en';
    var table = null;

    function run(phrase, inject, callback) {
        // Parse arguments
        if (typeof phrase === 'undefined') phrase = '';
        if (typeof inject === 'undefined') inject = null;
        if (typeof inject === 'function') callback = inject;
        if (typeof callback === 'undefined') callback = null;
        if (lang === 'pt') { 
            table = sentilex
        } else if(lang === 'en') { 
            table = afinn
        }
        else { 
            table = afinn;
        }

        // Merge
        if (inject !== null) {
            table = extend(table, inject);
        }

        // Storage objects
        var tokens      = tokenize(phrase),
            score       = 0,
            words       = [],
            positive    = [],
            negative    = [];

        // Iterate over tokens
        var len = tokens.length;
        while (len--) { 
            var obj = tokens[len];
            var item = table[obj];
            if (typeof item === 'undefined') continue;

            words.push(obj);
            if (item > 0) positive.push(obj);
            if (item < 0) negative.push(obj);

            score += item;
        }

        // Handle optional async interface
        var result = {
            score:          score,
            comparative:    score / tokens.length,
            tokens:         tokens,
            words:          words,
            positive:       positive,
            negative:       negative
        };

        if (callback === null) return result;
        process.nextTick(function () {
            callback(null, result);
        });

        return run;
    }

    run.lang = function( _ ) {
        if(!arguments.length)
            return lang;
        lang = _;
        return run;
    }

    if(!arguments.length) return run;
    return run(phrase, inject, callback);
};
