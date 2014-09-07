
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * @param element
	 * @returns {{x: number, y: number}}
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (['body', 'html'].indexOf(element.tagName.toLowerCase()) != -1))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});