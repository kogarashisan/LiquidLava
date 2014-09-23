/**
 * Methods to manipulate Dates
 */
Firestorm.Date = {

	/**
	 * Numbers of days in months for non-leap year
	 */
	DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	/**
	 * Get number of days in month, with respect to leap years
	 * @param {number} year
	 * @param {number} month
	 * @returns {number}
	 */
	getDaysInMonth: function(year, month) {
		return (month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0))
			? 29 // february in leap year
			: this.DAYS_IN_MONTH[month];
	}

};