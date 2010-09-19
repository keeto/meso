/*
Script: ringo/bootstrap.js
	Bootstrapper for RingoJS engine.

License and Copyright:
	Copyright 2010, Mark Obcena <keetology.com>
	Released under an MIT-Style License
*/

(function(){

var adapter = require('./../../lib/adapters'),
	ringo = require('ringo/engine');

// Vendor in Paths
require.paths.unshift(adapter.canonical(module.id + '/../../../vendor/'));

// MooTools import
require('mootools/mootools').into(global);

var version = (ringo.version.length < 3 ? [ringo.version[0], ringo.version[1], 0] : ringo.version).join('.');

var Engine;
try {
	Engine = require('./' + adapter.find(version, require('./versions').versions) + '/engine.js').engine;
} catch(e){
	Engine = null;
	print('meso: No adapter found for "ringo" version ' + version + '. Engine object will not be exported.');
}

if (Engine) global.Engine = Engine;

system.args.shift();
require(adapter.normalize(system.args[0], require('fs-base').workingDirectory()));

})();
