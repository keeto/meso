(function(){

var StdIo = new Class({

	Implements: [Events, Chain],

	initialize: function(pipe){
		this.$pipe = pipe;
	}

});

var StdIn = new Class({

	Extends: StdIo,

	open: function(){
		if (!this.$pipe){
			this.$pipe = process.openStdin();
			this.$pipe.setEncoding('utf8');
			this.$pipe.addListener('data', this.onRead.bind(this));
		}
		return this;
	},

	read: function(){
		this.open();
		this.$pipe.resume();
	},

	onRead: function(data){
		this.fireEvent('read', data.replace(/\n$/, ''));
		return this;
	},

	close: function(){
		if (this.$pipe) this.$pipe.pause();
		return this;
	}

});

var StdOut = new Class({

	Extends: StdIo,

	write: function(str){
		this.$pipe.write(str);
		this.onWrite(str);
		return this;
	},

	onWrite: function(str){
		this.fireEvent('write', str);
		return this;
	}

});

exports.StdIn = StdIn;
exports.StdOut = StdOut;

})();

