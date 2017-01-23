
Lava.define(
'Lava.view.container.Emulated',
/**
 * Virtual container that can simulate behaviour of Element and Morph containers
 * @lends Lava.view.container.Emulated#
 * @implements _iContainer
 */
{

	/**
	 * Instance belongs to Emulated container
	 * @type {boolean}
	 * @readonly
	 */
	isEmulatedContainer: true,

	/**
	 * View that owns this instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Container's settings
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is instance in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,

	/**
	 * Create Emulated container instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
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

	/**
	 * Return `html` without modifications
	 * @param {string} html
	 * @returns {string} Returns argument as-is
	 */
	wrap: function(html) { return html; },

	/**
	 * Throws exception. May be overridden by user to provide exact method of inserting content
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},

	/**
	 * Throws exception. May be overridden by user to provide exact way of removing content
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},

	/**
	 * Append `html` to the bottom of parent container
	 * @param {string} html
	 */
	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	/**
	 * Prepend `html` to the top of parent container
	 * @param {string} html
	 */
	_appendTop: function(html) {

		this._view.getParentView().getContainer().prependHTML(html);

	},

	/**
	 * Append `html` after previous view in template
	 * @param {string} html
	 */
	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	/**
	 * Append `html` before next view in template
	 * @param {string} html
	 */
	_appendBeforeNext: function(html) {

		this._view.getTemplate().getNextView(this._view).getContainer().insertHTMLBefore(html);

	},

	/**
	 * Inserts `html` to where the bottom of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.t("appendHTML is not supported or not configured");

	},

	/**
	 * Inserts `html` to where the top of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Lava.t("prependHTML is not supported or not configured");

	},

	/**
	 * Same as `prependHTML`
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		this.prependHTML(html);

	},

	/**
	 * Same as `appendHTML`
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		this.appendHTML(html);

	},

	/**
	 * Call this method immediately after content of the container has been inserted into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container's content from DOM
	 */
	informRemove: function() { this._is_inDOM = false; },

	/** Does nothing */
	refresh: function() {},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },
	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },
	/**
	 * Get `_view`
	 * @returns {Lava.view.Abstract}
	 */
	getView: function() { return this._view; },

	/** Does nothing */
	release: function() {},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {}

});