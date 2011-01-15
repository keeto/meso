/*
---

script: engines/node.js

description: nodejs engine adapter.

license: MIT-style license

authors:
- Mark Obcena

provides: [Engine]

...
*/

(function(){

var system = require('sys'),
	normalize = require('path').normalize,
	url = require('url');

var Engine = exports.engine = {
	name: 'node',
	adapter: '0.2.0'
};

// Base objects
Object.append(Engine, {
	global: global,
	system: system,
	args: process.argv,
	env: process.env,
	setTimeout: setTimeout
});


// Standard IO
(function(){

var stdio = null;

Object.defineProperties(Engine, {

	stdin: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdIn();
		},
		configurable: true,
		enumerable: true
	},

	stdout: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdOut(process.stdout);
		},
		configurable: true,
		enumerable: true
	},

	stderr: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!stdio) stdio = require('./stdio');
			return self.cached = new stdio.StdOut(process.stdout);
		},
		configurable: true,
		enumerable: true
	}

});

})();

Engine.__defineGetter__('cwd', function(){
	return process.cwd();
});

})();
