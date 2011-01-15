(function(){

var StdIo = new Class({

	Implements: [Events, Chain],

	initialize: function(pipe){
		this.$pipe = pipe;
	}

});

var StdIn = new Class({

	Extends: StdIo,

	read: function(){
		this.$opened = true;
		while (this.$opened){
			var ch = this.$pipe.readLine();
			this.onRead(ch.replace(/\n$/, ''));
		}
		return this;
	},

	onRead: function(data){
		this.fireEvent('read', data);
		return this;
	},

	close: function(){
		this.$opened = false;
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
