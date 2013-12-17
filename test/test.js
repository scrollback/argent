var argent = require('../index.js'),
	assert = require('assert');

var test = argent(function(str, phone, num, user, cb) {
	console.log(arguments);
}, [
	argent.string,
	argent.string(/\d+/),
	argent.number,
	argent.and(argent.object, argent.all(['name', 'email'])),
	argent.function
]);


console.log(1);
test(function() {});

console.log(2);
test('asdf', 34, function() {});

console.log(3);
test('asdf', {}, function() {});

console.log(4);
test({name: 'hah', email: 'rew'});
