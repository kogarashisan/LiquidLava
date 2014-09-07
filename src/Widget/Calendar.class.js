
Lava.define(
'Lava.widget.Calendar',
/**
 * @lends Lava.widget.Calendar#
 * @extends Lava.widget.CalendarAbstract#
 */
{

	Extends: 'Lava.widget.CalendarAbstract',

	_property_descriptors: {
		value: {type: 'Date', setter: '_setValue'}
	},

	_properties: {
		value: null, // the current Date object
		_selected_view: 'days',
		_weekdays: null, // culture-dependent list of week days
		_months: null, // template data
		_month_year_string: null, // Example: "May 2014" - displayed above the days_table
		_today_string: null, // Example: "24 May 2014" - displayed on the "today" button
		_selection_start: 0, // in milliseconds
		_selection_end: 0,
		_displayed_year: null,
		_displayed_month: null,
		_month_descriptors: null,
		_month_descriptor_rows: null
	},

	_event_handlers: {
		today_click: '_onTodayClick', // click on the current date to select it
		previous_month_click: '_onPreviousMonthClick',
		next_month_click: '_onNextMonthClick',
		days_view_month_name_click: '_onSwitchToMonthViewClick', // while in the 'days' view - click on the month name above the days
		//close_month_view_click: '_onCloseMonthsViewClick', // on 'months' select view: close it and return to the 'days' view
		month_click: '_onMonthClick', // on 'months' view - select month
		day_click: '_onDayClick',
		previous_year_click: '_onPreviousYearClick',
		next_year_click: '_onNextYearClick'
	},

	_role_handlers: {
		_year_input: '_handleYearInput'
	},

	_year_input: null,
	_months_cache: {},

	init: function(config, widget, parent_view, template, properties) {

		var current_date = new Date(),
			storage = this._properties,
			locale_object = Lava.locales[Lava.schema.LOCALE];

		// not using UTC values here to allow user to see the day in his own timezone
		storage._current_year = current_date.getFullYear();
		storage._current_month = current_date.getMonth();
		storage._current_day = current_date.getDate();

		storage._displayed_year = storage._current_year;
		storage._displayed_month = storage._current_month;

		storage._weekdays = this._getWeekDays(Lava.schema.LOCALE);
		storage._month_descriptors = this._getMonthDescriptors(Lava.schema.LOCALE);
		storage._month_descriptor_rows = this._getMonthDescriptorRows(storage._month_descriptors);

		this.CalendarAbstract$init(config, widget, parent_view, template, properties);

		if (this._properties.value == null) {
			this._setValue(current_date, 'value');
		}

		this.set(
			'_today_string',
			storage._current_day + ' ' + locale_object.month_names[storage._current_month] + ' ' + storage._current_year
		);

		this._refreshData();

	},

	_refreshData: function() {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		this.set('_months', [month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	},

	_getMonthData: function(year, month) {

		var month_key = year + '' + month;

		if (!(month_key in this._months_cache)) {
			this._months_cache[month_key] = this._renderMonth(year, month, Lava.schema.LOCALE);
		}

		return this._months_cache[month_key];

	},

	_onPreviousMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month = this._properties._displayed_month;
		if (month == 0) {
			this.set('_displayed_year', this._properties._displayed_year - 1);
			this.set('_displayed_month', 11);
		} else {
			this.set('_displayed_month', month - 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	_onNextMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month = this._properties._displayed_month;
		if (month == 11) {
			this.set('_displayed_year', this._properties._displayed_year + 1);
			this.set('_displayed_month', 0);
		} else {
			this.set('_displayed_month', month + 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	_onTodayClick: function(dom_event_name, dom_event, view, template_arguments) {

		var time = Date.UTC(this._properties._current_year, this._properties._current_month, this._properties._current_day);
		this._select(this._properties._current_year, this._properties._current_month, time);
		dom_event.preventDefault();

	},

	_onDayClick: function(dom_event_name, dom_event, view, template_arguments) {

		var day = template_arguments[0];
		this._select(day.year, day.month, day.milliseconds);
		dom_event.preventDefault(); // cancel selection

	},

	_select: function(year, month, milliseconds) {

		this.set('_selection_start', milliseconds);
		this.set('_selection_end', milliseconds);
		if (this._properties._displayed_month != month) {
			this.set('_displayed_year', year);
			this.set('_displayed_month', month);
			this._refreshData();
		}

		this.set('value', new Date(milliseconds));

	},

	_onSwitchToMonthViewClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_selected_view', 'months');
		if (this._year_input) {
			this._year_input.set('value', this._properties._displayed_year + '');
		}
		dom_event.preventDefault();

	},

	/*_onCloseMonthsViewClick: function(dom_event_name, dom_event, view, template_arguments) {

		this._refreshData();
		this.set('_selected_view', 'days');

	},*/

	_onPreviousYearClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_displayed_year', this.get('_displayed_year') - 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	_onNextYearClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_displayed_year', this.get('_displayed_year') + 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	_onMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month_descriptor = template_arguments[0];
		this.set('_displayed_month', month_descriptor.get('index'));
		this.set('_selected_view', 'days');
		this._refreshData();

	},

	_handleYearInput: function(view, template_arguments) {

		this._year_input = view;
		view.onPropertyChanged('value', this._onYearInputValueChanged, this);

	},

	_markInputAsInvalid: function() {

		// do not add the class to the container itself, just to the element
		// cause we do not need it to stay after refresh or render
		var element = this._year_input.getMainContainer().getDOMElement();
		if (element) {
			Firestorm.Element.addClass(element, this._config.options['invalid_input_class']);
		}

	},

	_clearInvalidInputState: function() {

		var element = this._year_input.getMainContainer().getDOMElement();
		if (element) {
			Firestorm.Element.removeClass(element, this._config.options['invalid_input_class']);
		}

	},

	_onYearInputValueChanged: function(widget) {

		var value = widget.get('value');

		// maxlength is also set on input in the template
		if (value.length > 2 && value.length < 6 && /^\d+$/.test(value)) {
			this.set('_displayed_year', +value);
			this._clearInvalidInputState();
		} else {
			this._markInputAsInvalid();
		}

	},

	_setValue: function(value, name) {

		var year = value.getFullYear(),
			month = value.getMonth(),
			day = value.getDate(),
			new_time = Date.UTC(year, month, day); // normalize for selection

		this.set('_displayed_year', year);
		this.set('_displayed_month', month);

		this.set('_selection_start', new_time);
		this.set('_selection_end', new_time);

		this._set('value', value);

		this._refreshData();

	}

});