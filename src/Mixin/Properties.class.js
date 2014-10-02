
/**
 * Property has changed
 * @event Lava.mixin.Properties#property_changed
 * @type {Object}
 * @property {string} name The name of the changed property
 */

Lava.define(
'Lava.mixin.Properties',
/**
 * Provides the `get()` and `set()` methods, and fires property changed events
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
	 * Hash with property values
	 * @type {Object.<name, *>}
	 */
	_properties: {},
	/**
	 * Separate listeners hash for property changed events, same as {@link Lava.mixin.Observable#_listeners}
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_property_listeners: {},

	/**
	 * Allows the mixin to be used as full-featured class
	 * @param {Object.<string, *>} properties Initial properties
	 */
	init: function(properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},

	/**
	 * Get property
	 * @param {string} name Property name
	 * @returns {*} Property value
	 */
	get: function(name) {

		return this._properties[name];

	},

	/**
	 * Returns <kw>true</kw> if property exists, even if it's null/undefined
	 * @param {string} name Property name
	 * @returns {boolean} True, if property exists
	 */
	isset: function(name) {

		return name in this._properties;

	},

	/**
	 * Set property
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	/**
	 * Perform the set operation
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * Set multiple properties at once
	 * @param {Object.<string, *>} properties_object A hash with new property values
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	/**
	 * Return a copy of the properties hash
	 * @returns {Object.<name, *>} Copy of `_properties` object
	 */
	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	/**
	 * Fire the 'property_changed' event for Observable interface, and Properties' native {@link Lava.mixin.Properties#onPropertyChanged} event
	 * @param {string} property_name The name of the changed property
	 */
	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as {@link Lava.mixin.Observable#on}, but returns listener to `property_name` instead of `event_name`
	 *
	 * @param {string} property_name Name of the property to listen for changes
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] May be usable when one callback responds to changes of different properties
	 * @returns {_tListener} Listener construct, which may be removed or suspended later
	 */
	onPropertyChanged: function(property_name, fn, context, listener_args) {

		return this._addListener(property_name, fn, context, listener_args, this._property_listeners);

	},

	/**
	 * Removes listeners added with {@link Lava.mixin.Properties#onPropertyChanged}
	 * @param {_tListener} listener The listener structure, returned from {@link Lava.mixin.Properties#onPropertyChanged}
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * Same as {@link Lava.mixin.Observable#_fire}, but for property listeners
	 * @param {string} property_name Name of the changed property
	 */
	_firePropertyChanged: function(property_name) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name]);

		}

	}

});