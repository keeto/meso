/*
---

script: engines/ringo.js

description: ringojs/helma-ng engine adapter.

license: MIT-style license

authors:
- Mark Obcena

provides: [Engine]

...
*/

(function(){

include('system');
include('fs');
include('io');
include('binary');

var Engine = exports.engine = {
	name: 'ringo',
	adapter: '0.5'
};

// Base objects
Object.append(Engine, {
	global: global,
	system: system,
	args: system.args,
	env: system.env,
	setTimeout: null
});


// Standard IO
(function(){

var stdio = null;

Object.defineProperties(Engine, {

	stdin: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdIn(system.stdin);
		},
		configurable: true,
		enumerable: true
	},

	stdout: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdOut(system.stdout);
		},
		configurable: true,
		enumerable: true
	},

	stderr: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdOut(system.stderr);
		},
		configurable: true,
		enumerable: true
	}

});

})();

Engine.__defineGetter__('cwd', function(){
	return file.cwd();
});


})();
