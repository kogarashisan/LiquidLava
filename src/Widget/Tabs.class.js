
Lava.define(
'Lava.widget.Tabs',
/**
 * @lends Lava.widget.Tabs#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tabs',

	_properties: {
		/** @type {Lava.system.Enumerable} */
		_tabs: null,
		active_tab: null
	},

	_property_descriptors: {
		active_tab: {setter: '_setActiveTab'}
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	_include_handlers: {
		tab_include: '_getTabInclude'
	},

	/**
	 * @type {Lava.system.Enumerable}
	 */
	_tabs: null,

	init: function(config, widget, parent_view, template, properties) {

		this._tabs = new Lava.system.Enumerable();
		this._properties._tabs = this._tabs;

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var sugar_tabs,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				this.addTab(sugar_tabs[i]);

			}

		}

	},

	_onTabHeaderClicked: function(dom_event_name, dom_event, view, template_arguments) {

		var tab = template_arguments[0];
		if (tab.get('is_enabled')) {
			this._setActiveTab(tab);
		}
		// to remove dotted outline in FF. This can be done with CSS, but CSS will disable it completely
		view.getContainer().getDOMElement().blur();
		dom_event.preventDefault();

	},

	/**
	 * @param {Object} properties
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.content Read only
	 * @param {_tTemplate} properties.title Read only
	 */
	addTab: function(properties) {

		if (Lava.schema.DEBUG && (properties.title && !Array.isArray(properties.title)) || (properties.content && !Array.isArray(properties.content))) Lava.t('Tabs: title and content must be templates');

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			is_active: false,
			title: null,
			content: null
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

		this._tabs.push(tab);

		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_active', this._onTabIsActiveChanged, this);

		return tab;

	},

	_onTabIsActiveChanged: function(tab) {

		if (tab.get('is_active')) {

			this._setActiveTab(tab);

		} else if (this._properties.active_tab == tab) {

			this._setActiveTab(null);

		}

	},

	_setActiveTab: function(new_tab) {

		var old_active_tab = this._properties.active_tab;

		if (old_active_tab != new_tab) {

			this._set('active_tab', new_tab);
			if (new_tab) new_tab.set('is_active', true);
			if (old_active_tab) old_active_tab.set('is_active', false);

		}

	},

	_onTabStateChanged: function(tab) {

		if (tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) {

			this._fixActiveTab();

		}

	},

	getTabs: function() {

		return this._tabs.getValues();

	},

	removeTab: function(tab) {

		this._tabs.removeValue(tab);

		if (this._properties.active_tab == tab) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tabs.each(function(tab) {
			var result = null;
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				result = false;
			}
			return result;
		});

		this._setActiveTab(active_tab);

	},

	_getTabInclude: function(template_arguments) {

		return template_arguments[0].get(template_arguments[1]);

	},

	removeAllTabs: function() {

		var tabs = this._tabs.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this._setActiveTab(null);

	},

	reorderTabs: function(indices) {

		this._tabs.reorder(indices);

	},

	sortTabs: function(callback) {

		this._tabs.sort(callback);

	},

	destroy: function() {

		this.removeAllTabs();
		this._tabs.destroy();
		this._tabs = this._properties._tabs = null;

		this.Standard$destroy();

	}

});