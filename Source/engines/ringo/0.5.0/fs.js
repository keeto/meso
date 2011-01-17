(function(){

var fscommon = require('./../../common/fs'),
	fs = require('fs');

// Current working directory
var getCwd = exports.getCwd = function getCwd(){
	return fs.workingDirectory();
};

// fix for silly ringo for/each
var removeTree = function removeTree(path) {
	var File = java.io.File;
    if (path == undefined) {
        throw new Error('undefined path argument');
    }
    var file = file instanceof File ? file : new File(String(path));
    if (!file.isAbsolute()) file = file.getAbsoluteFile();
    if (file.isDirectory() && !fs.isLink(file.getPath())) {
		file.list().forEach(function(child){
			removeTree(join(file, child));
		});
    }
    if (!file['delete']()) {
        throw new Error("failed to remove " + path);
    }
};


// File Class

var _File = exports.File = new Class({

	Extends: fscommon.File,

	resolve: function(path, skipCanon){
		var cwd = fs.workingDirectory();
		if (!skipCanon) path = fscommon.toCanonical(path || cwd, cwd);
		this.$path = path;
		return this;
	},

	remove: function(recursive){
		if (!this.exists()) return this.onRemoveError(new Error('File does not exists.'));
		var self = this,
			err = false,
			path = this.$path;

		if (this.isDirectory()){
			var dir = this.clone();
			dir.addEvents({
				list: function(items){
					if (!recursive && items.length){
						err = true;
						self.onRemoveError('File cannot be removed; not empty.');
					}
				},
				listError: function(e){
					err = true;
					self.onRemoveError(e);
				}
			}).list();
		}

		if (!err){
			try {
				removeTree(path);
				this.onRemove();
			} catch(e){
				this.onRemoveError(e);
			}
		}

		return this;
	},

	// Info Functions

	exists: function(){
		return fs.exists(this.$path);
	},

	isDirectory: function(){
		return fs.isDirectory(this.$path);
	},

	isFile: function(){
		return fs.isFile(this.$path);
	},

	// Stat Functions

	getStat: function(){
		if (!this.exists()) return this.onStatError(new Error('File does not exists.'));
		try {
			var path = this.$path,
				size = fs.size(path),
				modified = fs.lastModified(path);
			if (size !== undefined && modified !== undefined) this.onStat({size: size, modified: modified.getTime()});
			throw new Error('Cannot read stats.');
		} catch(e){
			this.onStatError(e);
		}
		return this;
	},


	// Directory Functions

	list: function(){
		if (!this.exists()) return this.onListError(new Error('File does not exists.'));
		if (this.isFile()) return this.onListError(new Error('File is not a directory.'));
		var path = this.$path;
		try {
			var results = fs.list(path);
			this.onList(results);
		} catch(e){
			this.onListError(e);
		}
		return this;
	},

	createDir: function(recurse){
		var self = this;
		if (this.exists()){
			if (this.isFile()) return this.onCreateDirError(new Error('File is not a directory'));
			return this.onCreateDir();
		} else {
			var path = this.$path,
				parent = this.getParent();
			if (!recurse && !parent.exists()) return this.onCreateDirError(new Error('File cannot be created as directory.'));
			try {
				fs.makeTree(path);
				self.onCreateDir();
			} catch(e){
				self.onCreateDirError(e);
			}
		}
		return this;
	},

	makeDir: function(dir, recurse){
		var file = new this.$constructor(fscommon.toCanonical(dir, this.$path));
		file.addEvents({
			createDir: this.onMakeDir.bind(this),
			createDirError: this.onMakeDirError.bind(this)
		}).createDir(recurse);
		return this;
	},

	// File Functions

	read: function(){
		if (!this.exists()) return this.onReadError(new Error('File does not exists.'));
		if (this.isDirectory()) return this.onReadError(new Error('File is a directory.'));
		var path = this.$path;
		try {
			var file = fs.open(path, {read: 1});
			var data = file.read();
			file.close();
			this.onRead(data);
		} catch(e){
			this.onReadError(e);
		}
		return this;
	},

	write: function(data, append){
		if (this.isDirectory()) return this.onReadError(new Error('File is a directory.'));
		var path = this.$path;
		try {
			var options = {binary: data instanceof Binary};
			options.write = 1;
			if (append) options.append = 1;
			var file = fs.open(path, options);
			file.write(data);
			file.flush();
			file.close();
			this.onWrite(data);
		} catch(e){
			this.onWriteError(e, data);
		}
		return this;
	},

	move: function(to){
		if (to == null) return this.onMoveError(new Error('Destination argument `to` is required.'));
		if (!this.exists()) return this.onMoveError(new Error('File does not exists.'));
		to = fscommon.toCanonical(to, fs.workingDirectory());
		try {
			fs.move(this.$path, to);	
			this.onMove(to);
		} catch(e){
			this.onMoveError(e);
		}
		return this;
	}

});

})();
