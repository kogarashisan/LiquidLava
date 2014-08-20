
/**
 * Implemented by most classes inside the scope folder
 * @interface
 */
_iValueContainer = {

	// fires:
	//   waits_refresh
	//   changed
	//   refreshed

	/**
	 * @type {function}
	 */
	on: null,

	getValue: function() {},

	isWaitingRefresh: function() {},

	isValueContainer: true,

	level: 0

};

/**
 * Implemented by classes inside the Views folder.
 * @interface
 */
_iViewHierarchyMember = {

	render: function() {},

	broadcastRemove: function() {},

	broadcastInDOM: function() {},

	broadcastSleep: function() {},

	broadcastWakeup: function() {}

};

/**
 * @interface
 */
_iListener = {};

/**
 * @interface
 */
iContainer = {

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
	sleep: function()  {},
	wakeup: function()  {},
	destroy: function()  {}

};