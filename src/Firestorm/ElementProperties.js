
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	setProperty: function(element, name, value) {

		document.id(element).set(name, value);

	},

	getProperty: function(element, name) {

		return document.id(element).get(name);

	},

	removeProperty: function(element, name) {

		document.id(element).setProperty(name, null);

	},

	hasAttribute: function(element, name) {

		return Slick.hasAttribute(element, name);

	},

	getAttribute: function(element, name) {

		return Slick.getAttribute(element, name);

	}

});