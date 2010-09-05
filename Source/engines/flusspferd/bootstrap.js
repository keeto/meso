var global = this;
(function(){

var adapter = require('./../../lib/adapters'),
	flusspferd = require('flusspferd'),
	system = require('system');

var version = flusspferd.version.split('.');
version = ((version.length < 3) ? [version[0], version[1], 0] : version).join('.');

var Engine;
try {
	Engine = require('./' + adapter.find(version, require('./versions').versions) + '/engine').engine;
} catch(e){
	print(e);
	Engine = null;
	print('codex: No adapter found for "ringo" version ' + version + '. Engine object will not be exported.');
}

if (Engine) global.Engine = Engine;

system.args.shift();
require.paths.push(require('fs-base').workingDirectory());
require(adapter.normalize(system.args[0], ""));

})();
