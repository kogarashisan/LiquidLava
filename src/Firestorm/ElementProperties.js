
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Set a property on an element
	 * @param {HTMLElement} element Target element
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	setProperty: function(element, name, value) {

		document.id(element).set(name, value);

	},

	/**
	 * Get element's property
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @returns {*}
	 */
	getProperty: function(element, name) {

		return document.id(element).get(name);

	},

	/**
	 * Remove property from the element
	 * @param {HTMLElement} element
	 * @param {string} name
	 */
	removeProperty: function(element, name) {

		document.id(element).setProperty(name, null);

	},

	/**
	 * Does an element have an attribute
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {boolean} True, if attribute exists
	 */
	hasAttribute: function(element, name) {

		return Slick.hasAttribute(element, name);

	},

	/**
	 * Get attribute value from the element
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {string} The attribute value
	 */
	getAttribute: function(element, name) {

		return Slick.getAttribute(element, name);

	}

});