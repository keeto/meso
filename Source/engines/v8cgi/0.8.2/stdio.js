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
		var buffer = [];
		while (this.$opened){
			var ch = this.$pipe(1);
			if (ch === '\n'){
				this.onRead(buffer.join(''));
				buffer = [];
				continue;
			}
			buffer.push(ch);
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
		this.$pipe(str);
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
