(function(){

// File Class

var File = exports.File = new Class({

	Implements: [Events, Chain],

	$file: null,
	$path: null,

	initialize: function(path){
		this.$path = path;
	},

	clone: function(){
		return new this.$constructor(this.toCanonical());
	},

	resolve: function(path){
		throw new Error('File.resolve is unimplemented.');
	},

	remove: function(){
		throw new Error('File.remove is unimplemented.');
	},

	onRemove: function(){
		this.fireEvent('remove', arguments);
	},

	onRemoveError: function(){
		this.fireEvent('removeError', arguments);
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
	
	getStat: function(){
		throw new Error('File.getStat is unimplemented.');
	},

	onStat: function(data){
		this.fireEvent('stat', arguments);
	},

	onStatError: function(e){
		this.fireEvent('statError', arguments);
	},

	// Directory Functions
	
	list: function(){
		throw new Error('File.listContents is unimplemented.');
	},

	onList: function(contents){
		this.fireEvent('list', arguments);
		return this;
	},

	onListError: function(e){
		this.fireEvent('listError', arguments);
		return this;
	},

	createDir: function(recurse){
		throw new Error('File.createDir is unimplemented');
	},

	onCreateDir: function(data){
		this.fireEvent('createDir', arguments);
	},

	onCreateDirError: function(data){
		this.fireEvent('createDirError', arguments);
	},

	makeDir: function(name, recurse){
		throw new Error('File.makeDir is unimplemented.');
	},

	onMakeDir: function(data){
		this.fireEvent('makeDir', arguments);
	},

	onMakeDirError: function(e){
		this.fireEvent('makeDirError', arguments);
	},

	getParent: function(e){
		return new this.$constructor(toCanonical('..', this.toCanonical()));
	},


	// IO Functions

	read: function(){
		throw new Error('File.read is unimplemented.');
	},

	onRead: function(data){
		this.fireEvent('read', arguments);
		return this;
	},

	onReadError: function(error){
		this.fireEvent('readError', arguments);
		return this;
	},

	write: function(str, append){
		throw new Error('File.write is unimplemented.');
	},

	onWrite: function(data){
		this.fireEvent('write', arguments);
		return this;
	},

	onWriteError: function(error, data){
		this.fireEvent('writeError', arguments);
		return this;
	},

	move: function(to){
		throw new Error('File.move is unimplemented.');
	},

	onMove: function(to){
		this.fireEvent('move', arguments);
	},

	onMoveError: function(e, to){
		this.fireEvent('moveError', arguments);
	}
});


// Utilities
var toCanonical = exports.toCanonical = function toCanonical(path, base){
	path = path.split('/');
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
