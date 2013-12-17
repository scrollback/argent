argent
======

Declarative handling of optional parameters

## Usage ##

```javascript
var argent = require('argent');

var myWrappedFunction = argent(function(arg1, arg2, arg3) {
	// function body goes here.
}, [
	argent.string.regex(/[\d-]*/).def('default value'),
	argent.and(argent.object, argent.all(['prop1', 'prop2']), argent.one(['prop3, prop4])),
	argent.function
]);
```