(function(){

var fscommon = require('./../../common/fs'),
	fs = require('fs'),
	pathutil = require('path');

var getCwd = exports.getCwd = function(){
	return process.cwd();
};

var _File = exports.File = new Class({

	Extends: fscommon.File,

	resolve: function(path, skipCanon){
		var cwd = process.cwd();
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
		fs.unlink(path, function(e){
			if (e) this.onRemoveError(e);
			else this.onRemove();
		}.bind(this));
		return this;
	},

	removeDir: function(recursive){
		var self = this,
			path = this.$path,
			File = this.$constructor;

		var handler = function(){
			fs.rmdir(path, function(e){
				if (e) self.onRemoveError(e);
				else self.onRemove();
			});
		};

		if (recursive){
			var dir = this.clone();
			dir.addEvents({
				list: function(contents){
					var counter = contents.length;
					if (!counter) handler();
					else contents.each(function(item){
						counter--;
						new File(fscommon.toCanonical(item, path), {
							onRemove: function(){
								if (!counter) handler();
							}
						}).remove(true);
					});
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
		return pathutil.existsSync(this.$path);
	},

	isDirectory: function(){
		return (this.exists()) ? fs.statSync(this.$path).isDirectory() : false;
	},

	isFile: function(){
		return (this.exists()) ? fs.statSync(this.$path).isFile() : false;
	},

	// Stat Functions

	getStat: function(){
		if (!this.exists()) return this.onStatError(new Error('File does not exists.'));
		fs.stat(this.$path, function(e, stat){
			if (e) this.onStatError(e);
			else this.onStat({size: stat.size, modified: stat.mtime.getTime()});
		}.bind(this));
		return this;
	},

	// Directory Functions

	list: function(){
		if (!this.exists()) return this.onListError(new Error('File does not exists.'));
		if (this.isFile()) return this.onListError(new Error('File is not a directory.'));
		fs.readdir(this.$path, function(e, list){
			if (e) this.onListError(e);
			else this.onList(list);
		}.bind(this));
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
			var handler = function handler(){
				fs.mkdir(path, 493, function(e){
					if (e) self.onCreateDirError(e);
					else self.onCreateDir(path);
				});
			};
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
		fs.readFile(path, function(e, data){
			if (e) this.onReadError(e);
			else this.onRead(data);
		}.bind(this));
		return this;
	},

	write: function(data, append){
		if (this.isDirectory()) return this.onReadError(new Error('File is a directory.'));
		var self = this,
			path = this.$path;
		if (this.exists()){
			fs.open(path, append ? 'a+' : 'w+', function(e, file){
				if (e) self.onWriteError(e);
				else fs.write(file, data, function(e){
					if (e) self.onWriteError(e);
					else self.onWrite(data);
				});
			});
		} else {
			fs.writeFile(path, data, function(e){
				if (e) self.onWriteError(e);
				else self.onWrite(data);
			});
		}
		return this;
	},

	move: function(to){
		if (to == null) return this.onMoveError(new Error('Destination argument `to` is required.'));
		if (!this.exists()) return this.onMoveError(new Error('File does not exists.'));
		var path = this.$path;
		to = fscommon.toCanonical(to, process.cwd());
		// Cheating again..
		var exec = require('child_process').exec,
			command = ['mv', '"' + path + '"', '"' + to + '"'].join(' ');

		var child = exec(command, function(e, stdout, stderr){
			if (e) return this.onMoveError(e);
			if (stderr) return this.onMoveError(stderr);
			this.onMove(to);
		}.bind(this));
		return this;
	}

});

})();
