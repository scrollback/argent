argent
======

Declarative handling of optional parameters

## Usage ##

```javascript
var argent = require('argent');

var wrappedFunction = argent(function(arg1, arg2, arg3) {
	// function body goes here.
}, [
	argent.string.regex(/\w+/).def('default value'),
	argent.and(argent.object, argent.all(['prop1', 'prop2']), argent.one(['prop3, prop4])),
	argent.function
]);

wrappedFunction('hello', fooFunction); // function sees arg1='hello', arg2=undefined, arg3=fooFunction
wrappedFunction({prop1: 1, prop2: 2, prop4: 4}); // function sees arg1=undefined, arg2=[object], arg3=undefined
wrappedFunction(fooFunction); // function sees arg1=undefined, arg2=undefined, arg3=fooFunction
```
