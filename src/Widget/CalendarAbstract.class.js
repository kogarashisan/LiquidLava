
Lava.define(
'Lava.widget.CalendarAbstract',
/**
 * Base class for calendar widgets
 * @lends Lava.widget.CalendarAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'calendar',

	_properties: {
		/** Currently selected year */
		_current_year: 0,
		/** Currently selected month */
		_current_month: 0,
		/** Currently selected day */
		_current_day: 0
	},

	/**
	 * Get data, which is used to build the month selection view
	 * @param {string} locale_name
	 * @returns {Array}
	 */
	_getMonthDescriptors: function(locale_name) {

		var i,
			result = [],
			month_names = Lava.locales[locale_name].short_month_names;

		for (i = 0; i < 12; i++) {

			result[i] = new Lava.mixin.Properties({
				index: i,
				title: month_names[i]
			});

		}

		return result;

	},

	/**
	 * Split array of month descriptors into rows
	 * @param {Array} descriptors
	 * @returns {Array}
	 */
	_getMonthDescriptorRows: function(descriptors) {

		var result = [];
		result.push(descriptors.slice(0, 4));
		result.push(descriptors.slice(4, 8));
		result.push(descriptors.slice(8, 12));
		return result;

	},

	/**
	 * Get descriptors for rendering the day names, with respect to cultural offset
	 * @param {string} locale
	 * @returns {Array}
	 */
	_getWeekDays: function(locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			result = [],
			daynames = Lava.locales[locale].short_day_names,
			i,
			descriptor;

		for (i = 0; i < 7; i++) {
			descriptor = new Lava.mixin.Properties({
				index: i,
				title: daynames[culture_offset]
			});
			result.push(descriptor);
			culture_offset = (culture_offset + 1) % 7;
		}

		return result;

	},

	/**
	 * Get data, which is needed to display a month in template
	 * @param {number} year
	 * @param {number} month
	 * @param {string} locale_name
	 * @returns {{year: number, index: number, weeks: Array}}
	 */
	_renderMonthData: function(year, month, locale_name) {

		var culture_offset = Lava.locales[locale_name].first_day_offset,
			first_day_in_sequence = new Date(Date.UTC(year, month)),
			first_day_of_week = (first_day_in_sequence.getDay() - culture_offset + 7) % 7;

		if (first_day_of_week) { // the first day of month does not start at beginning of the row

			// Date object will correct the wrong arguments
			first_day_in_sequence = new Date(Date.UTC(year, month, 1 - first_day_of_week));

		}

		return {
			year: year,
			index: month,
			weeks: this._renderMonthWeeksData(first_day_in_sequence)
		}

	},

	/**
	 * Render 6 rows of 7 days
	 * @param {Date} start_date Date of the first day in the first row (day of week always starts from zero)
	 */
	_renderMonthWeeksData: function(start_date) {

		var year = start_date.getUTCFullYear(),
			month = start_date.getUTCMonth(),
			day = start_date.getUTCDate(),
			milliseconds = start_date.getTime(),
			day_of_week = 0, // 0 - 6
			days_in_month = Firestorm.Date.getDaysInMonth(year, month),
			i = 0,
			result = [],
			week = [];

		week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		do {

			if (day == days_in_month) {
				day = 1;
				month++;
				if (month == 12) {
					month = 0;
					year++;
				}
				days_in_month = Firestorm.Date.getDaysInMonth(year, month);
			} else {
				day++;
			}
			day_of_week = (day_of_week + 1) % 7;
			i++;
			milliseconds += 86400000; // 24 hours

			if (day_of_week == 0) {
				result.push(week);
				week = [];
			}

			week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		} while (i < 42); // 7*6

		return result;

	},

	/**
	 * Create a structure, which is used to display a day number in calendar template
	 * @param {number} year
	 * @param {number} month
	 * @param {number} day Day index in month, 0..30
	 * @param {number} day_of_week Weekday index, 0..6
	 * @param milliseconds Absolute time of the day
	 * @returns {{year: number, month: number, day: number, day_of_week: number, milliseconds: number, is_today: boolean}}
	 */
	_renderDayData: function(year, month, day, day_of_week, milliseconds) {
		return {
			year: year,
			month: month,
			day: day,
			day_of_week: day_of_week,
			milliseconds: milliseconds,
			is_today: this._properties._current_day == day
				&& this._properties._current_month == month
				&& this._properties._current_year == year
		};
	}

});