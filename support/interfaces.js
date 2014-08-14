
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

	this.wrap = function(html)  {};
	this.setHTML = function(html)  {};
	this.appendHTML = function(html)  {};
	this.prependHTML = function(html)  {};
	this.insertHTMLAfter = function(html)  {};
	this.insertHTMLBefore = function(html)  {};
	this.remove = function()  {};

	this.informInDOM = function()  {};
	this.informRemove = function()  {};
	this.isInDOM = function() {};

	this.release = function()  {};
	this.refresh = function()  {};
	this.sleep = function()  {};
	this.wakeup = function()  {};
	this.destroy = function()  {};

}