/*
Script: meso.js
	General importer for Meso.

License and Copyright:
	Copyright 2010, Mark Obcena <keetology.com>
	Released under an MIT-Style License
*/

(function(){

var adapter = require('./lib/adapters');

exports.setup = function(global, engine){
	if (typeof global != 'object'){
		throw new TypeError('meso: Argument `global` to meso.setup() must be an object.');
	}

	require('./vendor/mootools/mootools').into(global);
	
	engine = engine.toString().split('#');
	var name = engine[0], version = engine[1];
	if (name === '' || version === ''){
		throw new TypeError('meso: Argument `engine` to meso.setup must be a string <engineName>#<engineVersion>');
	} else {
		var Engine;
		try {
			Engine = require('./engines/' + name + '/' + adapter.find(version, require('./engines/'+ name + '/versions').versions) + '/engine.js').engine;
		} catch(e){
			Engine = null;
			throw new Error('meso: No adapter found for "' + name + '" version ' + version + '.');
		}
		if (Engine) global.Engine = Engine;
	}

	return Engine;
};

})();
