
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
 * Visitor for {@link Lava.TemplateWalker}
 * @interface
 */
_iVisitor = {
	enter: function(walker, block_type, block) {},
	leave: function(walker, block_type, block) {},
	enterRegion: function(walker, region_name) {},
	leaveRegion: function(walker, region_name) {},
	visitView: function(walker, node) {},
	visitWidget: function(walker, node) {},
	visitString: function(walker, node) {},
	visitInclude: function(walker, node) {},
	visitStaticValue: function(walker, node) {},
	visitStaticEval: function(walker, node) {},
	visitStaticTag: function(walker, node) {}
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