
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Get element's dimensions
	 * @param element
	 * @returns {{x: number, y: number}} An object with element's dimensions
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (['body', 'html'].indexOf(element.tagName.toLowerCase()) != -1))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});