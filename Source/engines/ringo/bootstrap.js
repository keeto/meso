(function(){

var adapter = require('./../../lib/adapters'),
	ringo = require('ringo/engine');

var version = (ringo.version.length < 3 ? [ringo.version[0], ringo.version[1], 0] : ringo.version).join('.');

var Engine;
try {
	Engine = require('./' + adapter.find(version, require('./versions').versions) + '/engine.js').engine;
} catch(e){
	Engine = null;
	print('codex: No adapter found for "ringo" version ' + version + '. Engine object will not be exported.');
}

if (Engine) global.Engine = Engine;

system.args.shift();
require(adapter.normalize(system.args[0], require('fs-base').workingDirectory()));

})();
