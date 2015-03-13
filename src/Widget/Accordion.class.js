/**
 * Panel is expanding
 * @event Lava.widget.Accordion#panel_expanding
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

/**
 * Panel is collapsing
 * @event Lava.widget.Accordion#panel_collapsing
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

Lava.define(
'Lava.widget.Accordion',
/**
 * Collection of expandable panels
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
		/**
		 * Collection of "panel" <b>objects</b> (objects with properties for panel <b>widgets</b>)
		 * @type {Lava.system.Enumerable}
		 */
		_panels: null,
		/** If accordion is enabled - then it closes all other open panels when any panel is opened */
		is_enabled: true
	},

	_role_handlers: {
		panel: '_handlePanelRole'
	},

	/**
	 * Reference to the <wp>_panels</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_panels: null,
	/**
	 * Accordion's panels
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_panel_widgets: [],
	/**
	 * Panels, that are currently expanded
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_active_panels: [],
	/**
	 * Objects with listeners for accordion's panels
	 * @type {Object.<string, Object.<string, _tListener>>}
	 */
	_listeners_by_panel_guid: {},

	/**
	 * @param config
	 * @param {boolean} config.options.keep_new_panels_expanded If you add another expanded panel to accordion - it's collapsed by default.
	 *  You may set this option to keep it expanded - in this case all expanded panels will be collapsed as soon as any panel is expanded by user
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
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

			data = this._config.storage.panels;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},

	/**
	 * Create a panel inside accordion
	 * @param {Object} properties Plain object with panel's data
	 * @param {boolean} properties.is_expanded Initial "expanded" state
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} The {@link Lava.mixin.Properties} instance with panel's data
	 */
	addPanel: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addPanel. Plain object expected.");

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},

	/**
	 * Get panel objects
	 * @returns {Array.<Lava.widget.Standard>}
	 */
	getPanelObjects: function() {

		return this._panels.getValues();

	},

	/**
	 * Get a copy of `_panel_widgets`
	 * @returns {Array}
	 */
	getPanelWidgets: function() {

		return this._panel_widgets.slice();

	},

	/**
	 * Handle a panel inside accordion instance
	 * @param {Lava.widget.Standard} view
	 */
	_handlePanelRole: function(view) {

		this.registerPanel(view);

	},

	/**
	 * Add panel widget instance to Accordion. Panel does not need to be inside accordion
	 * @param {Lava.widget.Standard} panel_widget
	 */
	registerPanel: function(panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_new_panels_expanded'];

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

	/**
	 * Remove all references to panel widget from local members
	 * @param {Lava.widget.Standard} panel_widget
	 */
	_removePanel: function(panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},

	/**
	 * Stop controlling this panel widget
	 * @param {Lava.widget.Standard} panel_widget
	 */
	unregisterPanel: function(panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},

	/**
	 * Panel is expanding. Close all other panels
	 * @param {Lava.widget.Standard} panel
	 */
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

		this._fire('panel_expanding', {
			panel: panel
		});

	},

	/**
	 * Handler of panel's "collapsing" event
	 * @param {Lava.widget.Standard} panel
	 */
	_onPanelCollapsing: function(panel) {

		Firestorm.Array.exclude(this._active_panels, panel);
		this._fire('panel_collapsing', {
			panel: panel
		});

	},

	/**
	 * Turn accordion functionality on and off. When accordion is off - it will not control state of it's panels
	 * (when a panel is expanded - other panels are not closed)
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsEnabled: function(value, name) {

		var turnoff_panels = [],
			i = 0,
			last_index;

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

	},

	/**
	 * Remove references to destroyed panel
	 * @param panel
	 */
	_onPanelDestroy: function(panel) {

		this._removePanel(panel);

	},

	/**
	 * Remove all panels, added by `addPanel`
	 */
	removeNativePanels: function() {

		this._panels.removeAll();

	},

	/**
	 * Stop controlling all panels and remove panels which were added by `addPanel`
	 */
	removeAllPanels: function() {

		var panel_widgets = this._panel_widgets.slice(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},

	/**
	 * Remove a panel, added by `addPanel`
	 * @param {Lava.mixin.Properties} panel The panel object, returned by `addPanel`
	 */
	removePanel: function(panel) {

		this._panels.removeValue(panel); // everything else will be done by destroy listener

	},

	/**
	 * Collapse all panels in Accordion
	 */
	collapseAll: function() {

		var panels = this._active_panels.slice();

		for (var i = 0, count = panels.length; i < count; i++) {

			panels[i].set('is_expanded', false);

		}

	},

	destroy: function() {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}

});