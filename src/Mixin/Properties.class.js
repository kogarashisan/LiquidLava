
Lava.define(
'Lava.mixin.Properties',
/**
 * Provides the `get()` and `set()` methods, and fires changed events
 * @lends Lava.mixin.Properties#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * To signal other classes that this class implements Properties
	 * @const
	 */
	isProperties: true,

	/**
	 * Hash with properties
	 * @type {Object.<name, *>}
	 */
	_properties: {},
	/**
	 * Separate listeners hash for property changed events, same as {@link Lava.mixin.Observable#_listeners}
	 * @type {Object.<string, Array.<_iListener>>}
	 */
	_property_listeners: {},

	/**
	 * Constructor
	 * @param {Object.<string, *>} properties Initial properties
	 */
	init: function(properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},

	/**
	 * Get property
	 * @param {string} name
	 * @returns {*}
	 */
	get: function(name) {

		return this._properties[name];

	},

	/**
	 * Returns true if property exists, even if it's null/undefined
	 * @param {string} name
	 * @returns {boolean}
	 */
	isset: function(name) {

		return name in this._properties;

	},

	/**
	 * Set property
	 * @param {string} name The property name
	 * @param {*} value Property value
	 */
	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	/**
	 * Perform the set operation
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * Set multiple properties at once
	 * @param {Object.<string, *>} properties_object
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	/**
	 * Return a copy of the properties hash
	 * @returns {Object.<name, *>}
	 */
	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	/**
	 * @param property_name
	 */
	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as {@link Lava.mixin.Observable#on}, but returns listener to `property_name` instead of `event_name`
	 *
	 * @param {string} property_name
	 * @param {function} fn
	 * @param {Object} context
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	onPropertyChanged: function(property_name, fn, context, listener_args) {

		return this._addListener(property_name, fn, context, listener_args, this._property_listeners);

	},

	/**
	 * Removes listeners added with `onPropertyChanged`
	 * @param {_iListener} listener
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * Same as {@link Lava.mixin.Observable#_fire}, but for property listeners
	 * @param {string} property_name
	 * @param {*} [event_args]
	 */
	_firePropertyChanged: function(property_name, event_args) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name], event_args);

		}

	}

});