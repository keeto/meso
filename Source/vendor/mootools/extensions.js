/*
---

name: Object.defineProperty

description: Fix for old implementations of defineProperty

...
*/

(function(){

if (Object.defineProperty){
	var obj = {};
	Object.defineProperty(obj, 'old', {
		get: function(){ return false; },
		getter: function(){ return true; }
	});
	if (obj.old){
		var defProp = Object.defineProperty;
		Object.defineProperty = function(obj, prop, desc){
			if (desc.get) desc.getter = desc.get;
			if (desc.set) desc.setter = desc.set;
			return defProp.call(Object, obj, prop, desc);
		};
		Object.defineProperties = function(obj, descs){
			for (var prop in descs){
				Object.defineProperty(obj, prop, descs[prop]);
			}
			return obj;
		};
	}
}

})();

/*
---

name: Class.Mutators.Extras

description: Additional Mutators for Class.

license: MIT-style license.

requires: [Class]

provides: [Class.Mutators.Static, Class.Mutators.Protected]

...
*/

(function(){

Object.append(Class.Mutators, {
	
	Static: function(items){
		this.extend(items);
	},

	Protected: function(items){
		for (var item in items){
			if (items[item] instanceof Function) items[item].protect();
			this.implement(item, items[item]);
		}
	}

});

})();

exports.into = function(){};
