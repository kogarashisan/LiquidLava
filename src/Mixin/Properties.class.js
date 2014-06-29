
Lava.define(
'Lava.mixin.Properties',
/**
 * @lends Lava.mixin.Properties#
 * @extends Lava.mixin.Observable
 * @implements _iProperties
 */
{

	Extends: 'Lava.mixin.Observable',

	// to signal other classes that this class implements Properties
	isProperties: true,

	// the actual container for properties, [property_name] => value
	_properties: {},
	_property_listeners: {},

	init: function(properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},

	get: function(name) {

		return this._properties[name];

	},

	isset: function(name) {

		return name in this._properties;

	},

	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * @param {Object} properties_object
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as 'on' method in Observable, but returns listener to property_name instead of event_name
	 *
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} [context]
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	onPropertyChanged: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._property_listeners)

	},

	/**
	 * @param {_iListener} listener
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * @param {string} property_name
	 * @param {*} event_args
	 */
	_firePropertyChanged: function(property_name, event_args) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name], event_args);

		}

	}

});