
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Set one CSS property in element's "style" attribute
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

		document.id(element).setStyle(name, value);

	},

	/**
	 * Set CSS property, which accepts a list of pixel values (like <str>"border: 1px 2px 3px 4px"</str>)
	 * Rounds numbers and adds 'px' before setting them to element
	 *
	 * @param {HTMLElement} element
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

	/**
	 * Get value of CSS style property
	 * @param {HTMLElement} element
	 * @param {string} name Name of the property, like <str>"height"</str>
	 * @returns {*}
	 */
	getStyle: function(element, name) {

		return document.id(element).getStyle(name);

	},

	/**
	 * Set element's opacity
	 * @param {HTMLElement} element
	 * @param {(string|number)} value 0 <= value <= 1
	 */
	setOpacity: function(element, value) {

		document.id(element).set('opacity', value);

	},

	/**
	 * Get element's opacity
	 * @param {HTMLElement} element
	 * @returns {*}
	 */
	getOpacity: function(element) {

		return document.id(element).get('opacity');

	},

	/**
	 * Add another class to collection of element's classes. Will not do anything, if class already exists
	 * @param {HTMLElement} element
	 * @param {string} class_name The class name to add
	 */
	addClass: function(element, class_name) {

		document.id(element).addClass(class_name);

	},

	/**
	 * Remove a class from the list of element's classes. Will do nothing, if class does not exist
	 * @param {HTMLElement} element
	 * @param {string} class_name
	 */
	removeClass: function(element, class_name) {

		document.id(element).removeClass(class_name);

	},

	/**
	 * Add a list of classes to element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	/**
	 * Remove a list of classes from an element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});