
Lava.define(
'Lava.view.container.Morph',
/**
 * @lends Lava.view.container.Morph#
 * @implements _iContainer
 *
 * Credits:
 * based on https://github.com/tomhuda/metamorph.js/
 */
{

	isMorphContainer: true,

	/**
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	_is_inDOM: false,
	_start_script_id: null,
	_end_script_id: null,

	_start_element: null,
	_end_element: null,

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},

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

	getStartElement: function() {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},

	getEndElement: function() {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},

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

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},

	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},

	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},

	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getStartElement(), html);

	},

	informInDOM: function() { this._is_inDOM = true; },

	informRemove: function() {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},

	release: function() {

		this._start_element = this._end_element = null;

	},

	refresh: function() {},

	sleep: function() {},

	wakeup: function() {},

	isInDOM: function() { return this._is_inDOM; },

	getWidget: function() { return this._widget; },

	getView: function() { return this._view; },

	destroy: function() {}

});