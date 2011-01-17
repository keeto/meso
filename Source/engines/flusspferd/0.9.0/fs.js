(function(){

var fscommon = require('./../../common/fs'),
	fsbase = require('fs-base');

var getCwd = exports.getCwd = function(){
	return fsbase.workingDirectory();
};

var _File = exports.File = new Class({

	Extends: fscommon.File,

	resolve: function(path, skipCanon){
		var cwd = fsbase.workingDirectory();
		if (!skipCanon) path = fscommon.toCanonical(path || cwd, cwd);
		this.$path = path;
		return this;
	},

	remove: function(recursive){
		if (!this.exists()) return this.onRemoveError(new Error('File does not exists.'));
		if (this.isDirectory()) return this.removeDir(recursive);
		if (this.isFile()) return this.removeFile();
		return this;
	},

	removeFile: function(){
		var path = this.$path;
		try {
			fsbase.remove(path);
			this.onRemove();
		} catch(e){
			this.onRemoveError();
		}
		return this;
	},

	removeDir: function(recursive){
		var self = this,
			path = this.$path,
			File = this.$constructor;

		var handler = function(){
			try {
				fsbase.removeDirectory(path);
				self.onRemove();
			} catch(e){
				self.onRemoveError(e);
			}
		};

		if (recursive){
			var dir = this.clone();
			dir.addEvents({
				list: function(contents){
					contents.each(function(item){
						new File(fscommon.toCanonical(item, path)).remove(true);
					});
					handler();
				},
				listError: this.onRemoveError.bind(this)
			}).list();
		} else {
			handler();
		}
		return this;
	},

	// Info Functions

	exists: function(){
		return fsbase.exists(this.$path);
	},

	isDirectory: function(){
		return fsbase.isDirectory(this.$path);
	},

	isFile: function(){
		return fsbase.isFile(this.$path);
	},

	// Stat Functions

	getStat: function(){
		if (!this.exists()) return this.onStatError(new Error('File does not exists.'));
		try {
			var path = this.$path,
				size = fsbase.size(path),
				modified = fsbase.lastModified(path);
			if (size !== undefined && modified !== undefined) return this.onStat({size: size, modified: modified.getTime()});
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
			var results = fsbase.list(path);
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
			function handler(){
				try {
					fsbase.makeDirectory(path);
					self.onCreateDir();
				} catch(e){
					self.onCreateDirError(e);
				}
			}
			if (recurse){
				parent.addEvents({
					createDir: handler,
					createDirError: this.onCreateDirError.bind(this)
				}).createDir(recurse);
			} else {
				handler();
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
			var file = fsbase.openRaw(path, {read: 1});
			var data = file.readWhole();
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
			var options = {};
			options.write = 1;
			if (append) options.append = 1;
			var file = fsbase.openRaw(path, options);
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
		to = fscommon.toCanonical(to, fsbase.workingDirectory());
		try {
			fsbase.move(this.$path, to);	
			this.onMove(to);
		} catch(e){
			this.onMoveError(e);
		}
		return this;
	}

});

})();
