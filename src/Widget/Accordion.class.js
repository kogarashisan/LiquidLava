
Lava.define(
'Lava.widget.Accordion',
/**
 * @lends Lava.widget.Accordion#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'accordion',

	_property_descriptors: {
		is_enabled: {type: 'Boolean', setter: '_setIsEnabled'}
	},

	_properties: {
		/** @type {Lava.system.Enumerable} */
		_panels: null,
		is_enabled: true
	},

	_role_handlers: {
		panel: '_handlePanelRole'
	},

	_include_handlers: {
		panel_include: '_getPanelInclude'
	},

	_panels: null,
	_panel_widgets: [],
	_active_panels: [],
	_listeners_by_panel_guid: {},

	init: function(config, widget, parent_view, template, properties) {

		this._panels = new Lava.system.Enumerable();
		this._properties._panels = this._panels;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var data,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.panels) {

			data = this._config.storage.panels.value;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},

	addPanel: function(properties) {

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},

	getPanels: function() {

		return this._panels.getValues();

	},

	getPanelWidgets: function() {

		return this._panel_widgets.slice();

	},

	_getPanelInclude: function(template_arguments) {

		return template_arguments[0].get(template_arguments[1]);

	},

	_handlePanelRole: function(view, template_arguments) {

		this.registerPanel(view);

	},

	registerPanel: function(panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_expanded_on_add'];

		if (panel_widget.get('is_expanded')) {

			if (this._active_panels.length && collapse_on_add && this._properties.is_enabled) {

				panel_widget.set('is_expanded', false);

			} else {

				this._active_panels.push(panel_widget);

			}

		}

		this._panel_widgets.push(panel_widget);

		this._listeners_by_panel_guid[panel_widget.guid] = {
			// note: if panel is outside of the widget, this listener may never fire
			destroy: panel_widget.on('destroy', this._onPanelDestroy, this, null, true),
			expanding: panel_widget.on('expanding', this._onPanelExpanding, this),
			collapsing: panel_widget.on('collapsing', this._onPanelCollapsing, this)
		};

	},

	_removePanel: function(panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},

	unregisterPanel: function(panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},

	_onPanelExpanding: function(panel) {

		var turnoff_panels,
			i = 0,
			count;

		if (this._properties.is_enabled) {

			turnoff_panels = this._active_panels.slice();
			for (i = 0, count = turnoff_panels.length; i < count; i++) {

				turnoff_panels[i].set('is_expanded', false);

			}

			this._active_panels = [panel];

		} else {

			this._active_panels.push(panel);

		}

	},

	_onPanelCollapsing: function(panel) {

		Firestorm.Array.exclude(this._active_panels, panel);

	},

	_setIsEnabled: function(name, value) {

		var turnoff_panels = [],
			i = 0,
			last_index;

		if (this._properties.is_enabled != value) {

			if (value) {

				if (this._active_panels.length > 1) {

					last_index = this._active_panels.length - 1;
					// slice is needed for the listeners
					turnoff_panels = this._active_panels.slice(0, last_index);
					for (; i < last_index; i++) {
						turnoff_panels[i].set('is_expanded', false);
					}
					// keep expanded only the last opened panel
					this._active_panels = [this._active_panels[last_index]];

				}

			}

			this._set(name, value);

		}

	},

	_onPanelDestroy: function(panel) {

		this._removePanel(panel);

	},

	removeNativePanels: function() {

		this._panels.removeAll();

	},

	removeAllPanels: function() {

		var panel_widgets = this._panel_widgets.clone(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},

	removePanel: function(panel) {

		this._panels.remove(panel); // everything else will be done by destroy listener

	},

	destroy: function() {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}

});