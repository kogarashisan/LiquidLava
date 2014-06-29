
/**
 * @interface
 */
function _iObservable() {

	this.on = function(event_name, fn, context, listener_args) {};

}

/**
 * Implemented by most classes inside the scope folder
 * @interface
 * @implements _iObservable
 */
function _iValueContainer() {

	// fires:
	//   waits_refresh
	//   changed
	//   refreshed

	this.getValue = function() {};

	this.isValueContainer = true;

	this.level = 0;

}

/**
 * Implemented by classes inside the Views folder.
 * @interface
 */
function _iViewHierarchyMember() {

	this.render = function() {};

	this.broadcastRemove = function() {};

	this.broadcastInDOM = function() {};

	this.broadcastSleep = function() {};

	this.broadcastWakeup = function() {};

}

/**
 * @interface
 */
function _iListener() {}

/**
 * @interface
 */
function _iProperties() {

	this.get = function(name) {};

	this.set = function(name, value) {};

}

/**
 * @interface
 */
function iContainer() {

	wrap = function(html)  {};
	setHTML = function(html)  {};
	appendHTML = function(html)  {};
	prependHTML = function(html)  {};
	insertHTMLAfter = function(html)  {};
	remove = function()  {};

	informInDOM = function()  {};
	informRemove = function()  {};
	isInDOM = function() {};

	release = function()  {};
	refresh = function()  {};
	sleep = function()  {};
	wakeup = function()  {};
	destroy = function()  {};

}