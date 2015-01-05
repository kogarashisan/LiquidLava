
Lava.define(
'Lava.view.container.Morph',
/**
 * Container, that represents two &lt;script&gt; tags with content between them
 * @lends Lava.view.container.Morph#
 * @implements _iContainer
 *
 * Credits:
 * based on https://github.com/tomhuda/metamorph.js/
 */
{

	/**
	 * Instance belongs to Morph container
	 * @type {boolean}
	 * @const
	 */
	isMorphContainer: true,

	/**
	 * View, that owns this instance of container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for the Morph container
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is this instance currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * ID of the first &lt;script&gt; tag
	 * @type {string}
	 */
	_start_script_id: null,
	/**
	 * ID of the second &lt;script&gt; tag
	 * @type {string}
	 */
	_end_script_id: null,

	/**
	 * Reference to the first &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_start_element: null,
	/**
	 * Reference to the second &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_end_element: null,

	/**
	 * Create Morph container instance
	 * @param {Lava.view.Abstract} view
	 * @param {Object} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},

	/**
	 * Retrieve both &lt;script&gt; tags from DOM into local references,
	 * at the same time applying fixes for old browsers
	 */
	_getElements: function() {

		var start_element = document.getElementById(this._start_script_id),
			end_element = document.getElementById(this._end_script_id);

		/**
		 * In some cases, Internet Explorer can create an anonymous node in
		 * the hierarchy with no tagName. You can create this scenario via:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		 *     div.firstChild.firstChild.tagName //=> ""
		 *
		 * If our script markers are inside such a node, we need to find that
		 * node and use *it* as the marker.
		 **/
		while (start_element.parentNode.tagName === "") {

			start_element = start_element.parentNode;

		}

		/**
		 * When automatically adding a tbody, Internet Explorer inserts the
		 * tbody immediately before the first <tr>. Other browsers create it
		 * before the first node, no matter what.
		 *
		 * This means the the following code:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		 *
		 * Generates the following DOM in IE:
		 *
		 *     + div
		 *       + table
		 *         - script id='first'
		 *         + tbody
		 *           + tr
		 *             + td
		 *               - "hi"
		 *           - script id='last'
		 *
		 * Which means that the two script tags, even though they were
		 * inserted at the same point in the hierarchy in the original
		 * HTML, now have different parents.
		 *
		 * This code reparents the first script tag by making it the tbody's
		 * first child.
		 **/
		if (start_element.parentNode !== end_element.parentNode) {

			end_element.parentNode.insertBefore(start_element, end_element.parentNode.firstChild);

		}

		this._start_element = start_element;
		this._end_element = end_element;

	},

	/**
	 * Get `_start_element`
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},

	/**
	 * Get `_end_element`
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},

	/**
	 * Render the container with `html` inside
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		this._start_element = this._end_element = null;

		/*
		 * We replace chevron by its hex code in order to prevent escaping problems.
		 * Check this thread for more explaination:
		 * http://stackoverflow.com/questions/8231048/why-use-x3c-instead-of-when-generating-html-from-javascript
		 */
		return "<script id='" + this._start_script_id + "' type='x'>\x3C/script>"
			+ html
			+ "<script id='" + this._end_script_id + "' type='x'>\x3C/script>";

	},

	/**
	 * Replace the content between container's tags. Requires container to be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Remove container's content and it's tags from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},

	/**
	 * Insert html before the second &lt;script&gt; tag
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Insert html after the first &lt;script&gt; tag
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},

	/**
	 * Insert html after the second &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},

	/**
	 * Insert html before the first &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getStartElement(), html);

	},

	/**
	 * Call this method after inserting rendered container into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container from DOM
	 */
	informRemove: function() {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},

	/**
	 * Forget references to both DOM &lt;script&gt; elements
	 */
	release: function() {

		this._start_element = this._end_element = null;

	},

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

	/** Free resources and make this instance unusable */
	destroy: function() {}

});