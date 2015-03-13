
/**
 * Implemented by most classes inside the Scope folder
 * @interface
 */
_iValueContainer = {

	// fires:
	//   changed

	/**
	 * Add a listener
	 * @type {function}
	 */
	on: null,

	getValue: function() {},

	isWaitingRefresh: function() {},

	isValueContainer: true,

	level: 0

};

/**
 * Implemented by classes inside the Views folder
 * @interface
 */
_iViewHierarchyMember = {

	render: function() {},
	broadcastRemove: function() {},
	broadcastInDOM: function() {}

};

/**
 * Interface of Lava.view.container classes
 * @interface
 */
_iContainer = {

	wrap: function(html)  {},
	setHTML: function(html)  {},
	appendHTML: function(html)  {},
	prependHTML: function(html)  {},
	insertHTMLAfter: function(html)  {},
	insertHTMLBefore: function(html)  {},
	remove: function()  {},

	informInDOM: function()  {},
	informRemove: function()  {},
	isInDOM: function() {},

	release: function()  {},
	refresh: function()  {},
	destroy: function()  {}

};