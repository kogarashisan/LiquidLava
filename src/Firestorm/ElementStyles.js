
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * @param element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

		document.id(element).setStyle(name, value);

	},

	/**
	 * Rounds numbers and adds 'px' before setting them to element.
	 *
	 * @param element
	 * @param {string} name
	 * @param {(Array.<(number)>)} value
	 */
	setPixels: function(element, name, value) {

		var style = '';

		for (var i = 0, count = value.length; i < count; i++) {

			if (Firestorm.schema.DEBUG && typeof value[i] != "number") Firestorm.t("Invalid argument passed to setPixels");
			style += Math.round(value[i]) + 'px ';

		}

		this.setStyle(element, name, style);

	},

	getStyle: function(element, name) {

		return document.id(element).getStyle(name, value);

	},

	setOpacity: function(element, value) {

		document.id(element).set('opacity', value);

	},

	getOpacity: function(element) {

		return document.id(element).get('opacity');

	},

	addClass: function(element, class_name) {

		document.id(element).addClass(class_name);

	},

	removeClass: function(element, class_name) {

		document.id(element).removeClass(class_name);

	},

	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});