(function(){

// File Class

var File = exports.File = new Class({

	Implements: [Events, Options, Chain],

	$file: null,
	$path: null,

	initialize: function(path, options){
		this.setOptions(options);
		this.resolve(path);
	},

	clone: function(){
		return new this.$constructor(this.toCanonical());
	},

	resolve: function(path){
		this.$path = toCanonical(path);
	},

	'evented remove': function(){
		throw new Error('File.remove is unimplemented.');
	},

	// Information Functions

	exists: function(){
		throw new Error('File.exists is unimplemented.');
	},

	isDirectory: function(){
		throw new Error('File.isDirectory is unimplemented.');
	},

	isFile: function(){
		throw new Error('File.isFile is unimplemented.');
	},

	toCanonical: function(){
		return toCanonical(this.$path);
	},

	toString: function(){
		return this.toCanonical();
	},


	// Stat

	'evented stat:getStat': function(){
		throw new Error('File.getStat is unimplemented.');
	},

	// Directory Functions

	getParent: function(e){
		return new this.$constructor(toCanonical('..', this.toCanonical()));
	},

	'evented list': function(){
		throw new Error('File.listContents is unimplemented.');
	},

	'evented createDir': function(recurse){
		throw new Error('File.createDir is unimplemented');
	},

	'evented makeDir': function(name, recurse){
		throw new Error('File.makeDir is unimplemented.');
	},


	// IO Functions

	'evented read': function(){
		throw new Error('File.read is unimplemented.');
	},

	'evented write': function(str, append){
		throw new Error('File.write is unimplemented.');
	},

	'evented move': function(to){
		throw new Error('File.move is unimplemented.');
	}

});


// Utilities
var toCanonical = exports.toCanonical = function toCanonical(path, base){
	path = path.replace(/\/$/, '').split('/');
	base = (path[0] === '') ? [] : toCanonical(base || '').split('/');
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
