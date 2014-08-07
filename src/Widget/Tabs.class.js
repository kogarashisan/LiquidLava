
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
		_active_tab: null
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	_include_handlers: {
		tab_include: '_getTabInclude'
	},

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

			sugar_tabs = this._config.storage.tabs.value;
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
			this.set('_active_tab', tab);
		}
		dom_event.preventDefault();

	},

	/**
	 * @param {Object} properties
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.content_template Read only
	 * @param {_tTemplate} properties.title_template Read only
	 */
	addTab: function(properties) {

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);
		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);

		if (this._properties._active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._set('_active_tab', tab);

		}

		this._tabs.push(tab);
		return tab;

	},

	_onTabStateChanged: function(tab) {

		if (!tab.get('is_enabled') || tab.get('is_hidden')) {

			this._fixActiveTab();

		}

	},

	getTabs: function() {

		return this._tabs.getValues();

	},

	removeTab: function(tab) {

		this._tabs.removeValue(tab);

		if (this._properties._active_tab == tab) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tabs.each(function(tab) {
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				return false;
			}
		});

		this.set('_active_tab', active_tab);

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

		this.set('_active_tab', null);

	},

	setActiveTab: function(tab) {

		this.set('_active_tab', tab);

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