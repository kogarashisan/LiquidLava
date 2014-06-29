
Firestorm.Object = {

	isEmpty: function(object_instance) {
		// it's much faster than using Object.keys
		for (var name in object_instance) {
			return false;
		}
		return true;
	},

	clone: function(object) {
		var result = {},
			key;

		for (key in object) {

			result[key] = Firestorm.clone(object[key]);

		}

		return result;
	},

	copy: function(object) {

		var result = {};
		Firestorm.extend(result, object);
		return result;

	}

};