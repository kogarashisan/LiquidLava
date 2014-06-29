
Firestorm.extend(Firestorm.Element, {

	/**
	 * @param element
	 * @returns {{x: number, y: number}}
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (element.tagName == 'body' || element.tagName == 'html'))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});