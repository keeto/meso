/*
Script: v8cgi/bootstrap.js
	Bootstrapper for v8cgi engine.

License and Copyright:
	Copyright 2010, Mark Obcena <keetology.com>
	Released under an MIT-Style License
*/

(function(){

// MooTools import
require('./../../vendor/mootools/mootools').into(global);

var adapter = require('./../../lib/adapters'),
	print = function(str){ return system.stdout(str + '\n'); };

var Engine;
try {
	Engine = require('./' + adapter.find(v8cgi.version, require('./versions').versions) + '/engine.js').engine;
} catch(e){
	Engine = null;
	print('meso: No adapter found for "v8cgi" version ' + v8cgi.version + '. Engine object will not be exported.');
}

if (Engine) global.Engine = Engine;

system.args.shift();
require(adapter.normalize(system.args[0], system.getcwd()));

})();
