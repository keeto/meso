/*
---

script: engines/v8cgi.js

description: v8cgi engine adapter.

license: MIT-style license

authors:
- Mark Obcena

provides: [Engine]

...
*/

(function(){

var Engine = exports.engine = {
	name: 'v8cgi',
	adapter: '0.8.2'
};

// Base objects
Object.append(Engine, {
	global: global,
	system: system,
	args: system.argsv,
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

Object.defineProperty(Engine, 'cwd', {
	get: function(){
		return system.getcwd();
	},
	configurable: true,
	enumerable: true
});

Engine.File = new Class({

	Implements: [Events, Options],

	initialize: function(filename, options){
		this.file = new File(filename);
		this.file.open('rw');
	},

	read: function(){
		var data = this.file.read();
		this.onRead(data);
		return this;
	},

	onRead: function(data){
		this.fireEvent('read', data);
	},

	write: function(data){
		this.file.write(data);
		this.onWrite(data);
		return this;
	},

	onWrite: function(data){
		this.fireEvent('write', data);
	},

	flush: function(){
		this.file.flush();
	}

});

})();

