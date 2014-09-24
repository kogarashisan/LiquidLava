/**
 * Settings for the Firestorm library
 */
Firestorm.schema = {
	dom: {
		/**
		 * Allow using of Range API, if browser is capable of it
		 * @const
		 */
		PREFER_RANGE_API: true
	},
	/**
	 * Perform DEBUG checks. May be <kw>false</kw> in production,
	 * but it's strictly recommended to keep it <kw>true</kw> during development and testing
	 * @define
	 */
	DEBUG: true
};