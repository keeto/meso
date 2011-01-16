(function(){

var fscommon = require('./../../common/fs');

// Current working directory
var getCwd = exports.getCwd = function getCwd(){
	return system.getcwd();
};


// File Class
var _File = exports.File = new Class({

	Extends: fscommon.File,

	initialize: function(path){
		this.resolve(path);
	},

	resolve: function(path, skipCanon){
		var file,
			cwd = system.getcwd();
		if (!skipCanon) path = fscommon.toCanonical(path || cwd, cwd);
		file = new File(path);
		if (file.exists() && !file.isFile()) return this.resolveDir(path, true);
		this.$path = path;
		this.$file = file;
		return this;
	},

	resolveDir: function(path, skipCanon){
		var file,
			cwd = system.getcwd();
		if (!skipCanon) path = fscommon.toCanonical(path || cwd, cwd);
		file = new Directory(path);
		if (file.exists() && !file.isDirectory()) return this.resolve(path, true);
		this.$path = path;
		this.$file = file;
		return this;
	},

	remove: function(recursive){
		if (!this.exists()) return this.onRemoveError(new Error('File does not exists.'));
		var self = this,
			File = this.$constructor,
			path = this.toCanonical(),
			file = this.$file;

		var handler = function(){
			try {
				file.remove();
				self.onRemove();
			} catch(e){
				self.onRemoveError(e);
			}
		};

		if (recursive && this.isDirectory()){
			var dir = this.clone();
			dir.addEvents({
				list: function(contents){
					contents.each(function(item){
						new File(fscommon.toCanonical(item, path)).remove(true);
					});
					file.remove();
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
		return this.$file.exists();
	},

	isDirectory: function(){
		var result,
			file = this.$file;
		if (file.exists() && file.isDirectory){
			return file.isDirectory();
		} else {
			result = false;
		}
		return result;
	},

	isFile: function(){
		var result,
			file = this.$file;
		if (file.exists() && file.isFile){
			return file.isFile();
		} else {
			result = false;
		}
		return result;
	},

	// Stat Functions
	
	getStat: function(){
		if (!this.exists()) return this.onStatError(new Error('File does not exists.'));
		var file = this.$file;
		try {
			var stat = file.stat();
			if (stat) this.onStat({size: stat.size, modified: stat.modified});
			throw new Error('Cannot read stats.');
		} catch(e){
			this.onStatError(e);
		}
		return this;
	},

	// Dir Functions
	
	list: function(){
		if (!this.exists()) return this.onListError(new Error('File does not exists.'));
		if (this.isFile()) return this.onListError(new Error('File is not a directory.'));
		var file = this.$file,
			results = [];
		try {
			results.append(file.listFiles());
			results.append(file.listDirectories());
			results.sort();
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
			this.resolveDir(this.toCanonical(), true);
			var file = this.$file,
				parent = this.getParent();
			function handler(){
				try {
					file.create();
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
		var file = new this.$constructor(fscommon.toCanonical(dir, this.toCanonical()));
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
		var file = this.$file;
		try {
			file.open('r');
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
		var file = this.$file;
		try {
			file.open(append ? 'a' : 'w');
			file.write(data);
			file.flush();
			file.close();
			this.onWrite(data);
		} catch(e){
			this.onWriteError(e, data);
		}
		return this;
	}

	// TODO
	/*
	move: function(to){
		if (!this.exists()) return this.onMoveError(new Error('File does not exists.'));
		if (this.isDirectory()) return this.moveDir(to);
		if (this.isFile()) return this.moveFile(to);
		return this;
	},

	moveFile: function(to){
		var file = this.$file;
		to = fscommon.toCanonical(to, system.getcwd());
		try {
			file.move(to);
			this.onMove(to);
		} catch(e){
			this.onMoveError(e);
		}
		return this;
	},

	moveDir: function(to){
		var file = this.$file;
		to = fscommon.toCanonical(to, system.getcwd());
		try {
			var target = new this.$constructor(target);
			if (target.exists() && !target.isDirectory()) throw new Error('Target is not a directory');
			var dir = this.
		} catch(e){
			this.onMoveError(e);
		}
	}
	*/

});

})();
