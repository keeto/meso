(function(){

var fscommon = require('./../../common/fs');

// Current working directory
var getCwd = exports.getCwd = function getCwd(){
	return system.getcwd();
};


// Directory Class
var _Directory = exports.Directory = new Class({

	Extends: fscommon.Directory,

	resolve: function(path){
		var file,
			cwd = system.getcwd();
		path = fscommon.toCanonical(path || cwd, cwd);
		file = new Directory(path);
		if (file.exists() && !file.isDirectory()) throw new Error('Path "'+path+'" is not a directory.');
		this.$path = path;
		this.$file = file;
		return this;
	},

	remove: function(recursive){
		if (!this.exists()) return this.onRemoveError(new Error('Directory does not exists.'));
		var self = this,
			path = this.$path,
			file = this.$file;
		var handler = function(){
			try {
				file.remove();
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
						var file;
						try {
							file = new _Directory(fscommon.toCanonical(item, path));
						} catch(e){
							file = new _File(fscommon.toCanonical(item, path));
						} finally {
							file.remove(true);
						}
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

	move: function(to){
		if (to == null) return this.onMoveError(new Error('Destination argument `to` is required.'));
		if (!this.exists()) return this.onMoveError(new Error('Directory does not exists.'));
		var path = this.$path;
		to = fscommon.toCanonical(to, system.getcwd());
		// Cheating because v8cgi doesn't have Directory move
		try {
			var proc = new (require('process').Process),
				command = ['mv', '"' + path + '"', '"' + to + '"'].join(' '),
				results = proc.exec2(command);

			if (results.err !== '') throw new Error(results.err);
			this.onMove(to);
		} catch(e){
			this.onMoveError(e);
		}
		return this;
	},

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

	getStat: function(){
		if (!this.exists()) return this.onStatError(new Error('Directory does not exists.'));
		var file = this.$file;
		try {
			var stat = file.stat();
			if (stat) return this.onStat({size: stat.size, modified: stat.mtime});
			throw new Error('Cannot read stats.');
		} catch(e){
			this.onStatError(e);
		}
		return this;
	},

	list: function(){
		if (!this.exists()) return this.onListError(new Error('Directory does not exists.'));
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

	create: function(recurse){
		var self = this;
		if (this.exists()){
			return this.onCreate();
		} else {
			var file = this.$file,
				parent = this.getParent();
			function handler(){
				try {
					file.create();
					self.onCreate();
				} catch(e){
					self.onCreateError(e);
				}
			}
			if (recurse){
				parent.addEvents({
					create: handler,
					createError: this.onCreateError.bind(this)
				}).create(recurse);
			} else {
				handler();
			}
		}
		return this;
	},

	makeDir: function(dir, recurse){
		if (dir == null) return this.onMakeDirError('Argument dirName is required.');
		var file = new this.$constructor(fscommon.toCanonical(dir, this.toCanonical()));
		file.addEvents({
			create: this.onMakeDir.bind(this),
			createError: this.onMakeDirError.bind(this)
		}).create(recurse);
		return this;
	}

});


// File Class
var _File = exports.File = new Class({

	Extends: fscommon.File,

	resolve: function(path){
		var file,
			cwd = system.getcwd();
		path = fscommon.toCanonical(path || cwd, cwd);
		file = new File(path);
		if (file.exists() && !file.isFile()) throw new Error('Path "'+path+'" is not a directory.');
		this.$path = path;
		this.$file = file;
		return this;
	},

	remove: function(){
		if (!this.exists()) return this.onRemoveError(new Error('File does not exists.'));
		var file = this.$file;
		try {
			file.remove();
			this.onRemove();
		} catch(e){
			this.onRemoveError(e);
		}
		return this;
	},

	move: function(to){
		if (to == null) return this.onMoveError(new Error('Destination argument `to` is required.'));
		if (!this.exists()) return this.onMoveError(new Error('File does not exists.'));
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
			if (stat) return this.onStat({size: stat.size, modified: stat.mtime});
			throw new Error('Cannot read stats.');
		} catch(e){
			this.onStatError(e);
		}
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
			file.close();
			this.onWrite(data);
		} catch(e){
			this.onWriteError(e, data);
		}
		return this;
	}

});

})();
