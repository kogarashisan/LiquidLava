
Lava.define(
'Lava.view.container.Emulated',
/**
 * @lends Lava.view.container.Emulated#
 * @implements iContainer
 */
{

	isEmulatedContainer: true,

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	_config: null,
	guid: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	_is_inDOM: false,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._config = config;
		this._widget = widget;

		if (('options' in config)) {

			if ('appender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.appender]) Lava.t('[Emulated container] wrong appender: ' + config.options.appender);
				this.appendHTML = this['_append' + config.options.appender]
			}

			if ('prepender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.prepender]) Lava.t('[Emulated container] wrong prepender: ' + config.options.prepender);
				this.prependHTML = this['_append' + config.options.prepender]
			}

		}

	},

	wrap: function(html) { return html; },

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},

	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	_appendTop: function(html) {

		this._view.getParentView().getContainer().prependHTML(html);

	},

	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	_appendBeforeNext: function(html) {

		this._view.getTemplate().getNextView(this._view).getContainer().insertHTMLBefore(html);

	},

	/**
	 * Note: this function is replaced in constructor
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.t("appendHTML is not supported or not configured");

	},

	prependHTML: function(html) {

		Lava.t("prependHTML is not supported or not configured");

	},

	insertHTMLBefore: function(html) {

		this.prependHTML(html);

	},

	insertHTMLAfter: function(html) {

		this.appendHTML(html);

	},

	informInDOM: function() { this._is_inDOM = true; },

	informRemove: function() { this._is_inDOM = false; },

	refresh: function() {},

	sleep: function() {},

	wakeup: function() {},

	isInDOM: function() { return this._is_inDOM; },

	getWidget: function() { return this._widget; },

	getView: function() { return this._view; },

	release: function() {},

	destroy: function() {}

});