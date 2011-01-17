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

var system = require('system');
// include('fs');
// include('io');
// include('binary');

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

// File System
(function(){

var fs = null;

Object.defineProperties(Engine, {

	File: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!fs) fs = require('./fs');
			return self.cached = fs.File;
		},
		configurable: true,
		enumerable: true
	},

	Directory: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!fs) fs = require('./fs');
			return self.cached = fs.Directory;
		},
		configurable: true,
		enumerable: true
	},

	getCwd: {
		get: function self(){
			if (self.cached) return self.cached;
			if (!fs) fs = require('./fs');
			return self.cached = fs.getCwd;
		},
		configurable: true,
		enumerable: true
	}

});

})();




})();
