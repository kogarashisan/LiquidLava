
Lava.define(
'Lava.widget.Tabs',
/**
 * Tabs widget
 * @lends Lava.widget.Tabs#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tabs',

	_properties: {
		/**
		 * Collection of objects with tab data
		 * @type {Lava.system.Enumerable}
		 */
		_tabs: null,
		/**
		 * Active tab object
		 * @type {Lava.mixin.Properties}
		 */
		active_tab: null
	},

	_property_descriptors: {
		active_tab: {setter: '_setActiveTab'}
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	/**
	 * Reference to <wp>_tabs</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_tab_objects: null,

	init: function(config, widget, parent_view, template, properties) {

		this._tab_objects = new Lava.system.Enumerable();
		this._properties._tabs = this._tab_objects;

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var sugar_tabs,
			i,
			count,
			tab;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				tab = sugar_tabs[i];
				this.addTab({
					name: tab.name || '',
					is_enabled: ("is_enabled" in tab) ? tab.is_enabled : true,
					is_hidden: ("is_hidden" in tab) ? tab.is_hidden : false,
					is_active: ("is_active" in tab) ? tab.is_active : false,
					title_template: tab.title,
					content_template: tab.content
				});

			}

		}

	},

	/**
	 * Tab header was clicked. Switch active tab
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onTabHeaderClicked: function(dom_event_name, dom_event, view, template_arguments) {

		var tab = template_arguments[0]; // tab object
		if (tab.get('is_enabled')) {
			this._setActiveTab(tab);
		}
		// to remove dotted outline in FF. This can be done with CSS, but CSS will disable it completely
		view.getContainer().getDOMElement().blur();
		dom_event.preventDefault();

	},

	/**
	 * Create a new tab
	 * @param {Object} properties The properties of the new tab
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} Created object with tab data
	 */
	addTab: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addTab. Plain object expected.");

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			is_active: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);

		if (Lava.schema.DEBUG && tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) Lava.t('Tabs: added tab cannot be active and disabled/hidden at the same time');

		if (this._properties.active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._setActiveTab(tab);

		}

		if (tab.get('is_active') && this._properties.active_tab != tab) {
			if (this._properties.active_tab) {
				this._properties.active_tab.set('is_active', false);
			}
			this._set('active_tab', tab);
		}

		this._tab_objects.push(tab);

		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_active', this._onTabIsActiveChanged, this);

		return tab;

	},

	/**
	 * "is_active" property of tab object has changed. Update active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabIsActiveChanged: function(tab) {

		if (tab.get('is_active')) {

			this._setActiveTab(tab);

		} else if (this._properties.active_tab == tab) {

			this._setActiveTab(null);

		}

	},

	/**
	 * Change currently active tab
	 * @param {Lava.mixin.Properties} new_tab
	 */
	_setActiveTab: function(new_tab) {

		var old_active_tab = this._properties.active_tab;

		if (old_active_tab != new_tab) {

			this._set('active_tab', new_tab);
			if (new_tab) new_tab.set('is_active', true);
			if (old_active_tab) old_active_tab.set('is_active', false);

		}

	},

	/**
	 * If currently active tab was disabled or hidden - choose new active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabStateChanged: function(tab) {

		if (tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) {

			this._fixActiveTab();

		}

	},

	/**
	 * Get all objects with tab data
	 * @returns {Array.<Lava.mixin.Properties>}
	 */
	getTabObjects: function() {

		return this._tab_objects.getValues();

	},

	/**
	 * Remove a tab object, returned by `addTab`
	 * @param {Lava.mixin.Properties} tab_object
	 */
	removeTab: function(tab_object) {

		this._tab_objects.removeValue(tab_object);

		if (this._properties.active_tab == tab_object) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tab_objects.each(function(tab) {
			var result = null;
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				result = false;
			}
			return result;
		});

		this._setActiveTab(active_tab);

	},

	/**
	 * Remove all tabs
	 */
	removeAllTabs: function() {

		var tabs = this._tab_objects.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this._setActiveTab(null);

	},

	/**
	 * Reorder tabs
	 * @param {Array.<number>} indices
	 */
	reorderTabs: function(indices) {

		this._tab_objects.reorder(indices);

	},

	/**
	 * Sort tabs
	 * @param {_tLessCallback} callback
	 */
	sortTabs: function(callback) {

		this._tab_objects.sort(callback);

	},

	destroy: function() {

		this.removeAllTabs();
		this._tab_objects.destroy();
		this._tab_objects = this._properties._tab_objects = null;

		this.Standard$destroy();

	}

});