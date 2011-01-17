/*
Script: adapters.js
	Utilities for managing adapter versions and paths.

License and Copyright:
	Copyright 2010, Mark Obcena <keetology.com>
	Released under an MIT-Style License
*/

(function(){

var matcher = /v?([0-9]+)\.([0-9]+)\.([0-9]+)([a-zA-Z-][a-zA-Z0-9-]*)?/;

exports.find = function(version, adapters){
	var defined = adapters.indexOf(version);
	if (defined !== -1) return adapters[defined];
	
	var len = adapters.length, result = null;
	version = version.match(matcher);
	if (version){
		version.shift();
		version = version.map(function(e){ return e == undefined ? '' : e; });
		while (len--){
			var adapter = adapters[len].match(matcher);
			if (!adapter) continue;
				adapter.shift();
				adapter = adapter.map(function(e){ return e == undefined ? '' : e; });
			if (version[0] >= adapter[0] && version[1] >= adapter[1]
					&& version[2] >= adapter[2] && version[3] >= adapter[3]) {
				result = adapters[len];
				break;
			}
		}
	}

	return result;
};

var normalize = exports.normalize = function(path, cwd, skipCanon){
	path = typeof path == 'undefined' ? '' : path.replace(/\.js$/, '');
	if (skipCanon) return (/^\//).test(path) ? path : cwd + '/' + path;
   else return canonical(path, cwd);
};

var canonical = exports.canonical = function(path, base){
	path = path.replace(/\/$/, '').split('/');
	base = (path[0] === '') ? [] : canonical(base || '').split('/');
	for (var i = 0, len = path.length; i < len; i++){
		var part = path[i];
		switch (part){
			case '.':
				continue;
			break;
			case '..':
				var item = base.pop();
				if (!base.length && item == '') base.push('');
			break;
			default:
				base.push(part);
		}
	}
	return base.join('/');
};

})();
