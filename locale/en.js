
Lava.locales.en = {
	/**
	 * How many plural forms does this language have.
	 */
	count_plurals: 2,
	/**
	 * Get the index of plural form
	 * @param {number} n
	 * @returns {number}
	 */
	pluralize: function(n) {
		return +(n != 1);
	},
	booleans: ['No', 'Yes'],
	day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	first_day_offset: 0 // starts from Sunday. Must be "1" if the first day of week is Monday.
};