var argent = function(fn, spec) {
	return function() {
		var i=0, j=0, args=[];
		while(j<spec.length) {
			if(i<arguments.length && spec[j].test(arguments[i])) { 
				args[j] = arguments[i];
				i++; j++;
			} else {
				args[j] = spec[j]._def;
				j++;
			}
		}
		return fn.apply(this, args);
	};
};

function helper(name, fn, modfn, opt) {
	var i;
	opt = opt || {};
	opt.def = opt.def || function(d) { this._def = d; };
	
	argent[name] = function() {
		var mod = [].splice.call(arguments, 0),
			constraint = Object.create(opt);
		
		if(!fn) fn = function() { return true; };
		
		constraint.test = (mod && modfn? function(v) { 
			return fn(v) && modfn.apply(null, [v].concat(mod)); 
		}: fn);
		
		return constraint;
	}
	for(i in opt) argent[name][i] = opt[i];
	argent[name].test = fn;
}

/*
	How this works
	--------------
	
	helper() is called with the name and two functions. The first is
	used when the spec uses the basic helper [argent.myHelper] while
	both functions are used when the helper has been customized
	[argent.myHelper(default, additionalConstraints)]
	
	When the helper is called as a function (customization mode),
	the first parameter is treated as a default value (if it passes
	the basic constraint for that helper) and all remaining params
	are passed to the modfn.
	
	Example: Consider the 'string' constraint:
	
	In the basic mode [argent.string], it just verifies that typeof
	argument is string. This helper can be further customized by 
	requiring that arguments must also match a supplied regex
	[argent.string(myRegex)], providing a default value 
	[argent.string(def)], or both [argent.string(def, myRegex)].
	
	When argent.string sees only one parameter, we check if that
	parameter satisfies the basic constraint typeof == string to
	decide between treating that parameter as a regex or a default
	value.

*/

helper('string', 
	function(v) { return typeof v === 'string'; }, 
	function(v, regex) { return regex.test? regex.test(v): true; }
);

helper('number', function(v) { return typeof v === 'number'; });
helper('boolean', function(v) { return typeof v === 'boolean'; });

/*
	The 'function' helper can be further constrained with the number
	of arguments in the callback function's specification
*/
helper('function',
	function(v) { return typeof v === 'function'; },
	function(v, length) { return v.length === length; }
);

helper('array',
	function(v) { return Object.prototype.toString.call(v) === "[object Array]" }
);


helper('object', function(v) { return typeof v === 'object' && v !== null; });

/*
	The 'all' and 'any' helpers check property names on objects; use an
	an 'and' helper to combine them with an 'object' helper.
*/
helper(
	'all', null,
	function(v, props) {
		var i, l;
		for(i=0, l=props.length; i<l; i++) {
			if(typeof v[props[i]] === 'undefined') return false;
		}
		return true;
	}
);

helper(
	'one', null,
	function(v, props) {
		var i, l;
		for(i=0, l=props.length; i<l; i++) {
			if(typeof v[props[i]] !== 'undefined') return true;
		}
		return true;
	}
);

helper('anything', null);
helper('defined', function(v) { return typeof v !== 'undefined'; });
helper('nonnull', function(v) { return typeof v !== 'undefined' && v !== null; });
helper('truthy', function(v) { return !!v; });

helper('or', null,
	function(v) {
		var i, l;
		for(i=1, l=arguments.length; i<l; i++) {
			if(arguments[i].test(v)) return true;
		}
		return false;
	}
);

helper('and', null,
	function(v) {
		var i, l;
		for(i=1, l=arguments.length; i<l; i++) {
			if(!arguments[i].test(v)) return false;
		}
		return true;
	}
);


module.exports = argent;