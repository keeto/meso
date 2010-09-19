/*
Script:	node/bootstrap.js
	Bootstrapper for NodeJS engine.

License and Copyright:
	Copyright 2010, Mark Obcena <keetology.com>
	Released under an MIT-Style License
*/

(function(){

var adapter = require('./../../lib/adapters'),
	print = function(str){ return process.stdout.write(str + '\n'); };

// Vendor in Paths
require.paths.unshift(adapter.canonical(module.filename + '/../../../vendor/'));

// MooTools import
require('mootools/mootools').into(global);
print(require.paths.toString());

var Engine;
try {
	Engine = require('./' + adapter.find(process.version, require('./versions').versions) + '/engine.js').engine;
} catch(e){
	Engine = null;
	print('meso: No adapter found for "node" version ' + process.version + '. Engine object will not be exported.');
}

if (Engine) global.Engine = Engine;

process.argv.splice(0,2);
require(adapter.normalize(process.argv[0], process.cwd()));

})();
