var test = require('tap').test;
var sentiment = require('../../lib/index')().lang('pt');

// var dataset = 'Você é desprezível.';
var dataset = 'Você é desprezível, desprezivel.';
var result = sentiment(dataset);
// console.dir(result) 
// console.dir(dataset);

test('synchronous positive', function (t) {
    t.type(result, 'object');
    console.log(result);
    t.equal(result.score, -2);
    t.equal(result.comparative, -0.5);
    t.equal(result.tokens.length, 4);
    t.equal(result.words.length, 2);
    t.end();
});