Lava.ClassManager.define(
'Lava.widget.DemoCalendar',
{
	Extends: 'Lava.widget.Calendar',

	_refreshData: function() {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		var prev_month_data = this._properties._displayed_month == 0
			? this._getMonthData(this._properties._displayed_year - 1, 11)
			: this._getMonthData(this._properties._displayed_year, this._properties._displayed_month - 1);

		var next_month_data = this._properties._displayed_month == 11
			? this._getMonthData(this._properties._displayed_year + 1, 0)
			: this._getMonthData(this._properties._displayed_year, this._properties._displayed_month + 1);

		this.set('_months_data', [prev_month_data, month_data, next_month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	}
});