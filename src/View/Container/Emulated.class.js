
Lava.define(
'Lava.view.container.Emulated',
/**
 * @lends Lava.view.container.Emulated#
 * @implements iContainer
 */
{

	isEmulatedContainer: true,

	Shared: ['_appenders'],

	_appenders: {
		bottom: '_appendBottom',
		'after-previous': '_appendAfterPrevious'
	},

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	_is_inDOM: false,

	_placement: null,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		this._config = config;
		this._widget = widget;

		if (('options' in config) && config.options.placement) {
			this._placement = config.options.placement;
			if (config.options.placement in this._appenders) {
				this.appendHTML = this[this._appenders[config.options.placement]];
			}
		}

	},

	wrap: function(html) { return html; },

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.throw("setHTML: container is not in DOM");

		Lava.throw('call to setHTML() in emulated container');

	},

	remove: function() {

		if (!this._is_inDOM) Lava.throw("remove: container is not in DOM");

		Lava.throw('call to remove() in emulated container');

	},

	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	/**
	 * Note: this function is replaced in constructor
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.throw("appendHTML: placement is not supported");

	},

	prependHTML: function(html) {

		Lava.throw('call to prependHTML() in emulated container');

	},

	insertHTMLAfter: function(html) {

		Lava.throw('call to insertHTMLAfter() in emulated container');

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