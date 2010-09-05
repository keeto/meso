
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

exports.normalize = function(path, cwd){
	path = path.replace(/\.js$/, '');
	return (/^\//).test(path) ? path : cwd + '/' + path;
};

})();
