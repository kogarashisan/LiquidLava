Lava.define(
'Lava.scope.Abstract',
/**
 * Abstract class for data binding
 * @lends Lava.scope.Abstract#
 * @extends Lava.mixin.Refreshable
 */
{

	Class: {
		is_abstract: true
	},

	Extends: 'Lava.mixin.Refreshable',

	/**
	 * Instance belongs to scope/Abstract
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,

	/**
	 * Scopes, bound to properties of the value of this container
	 * @type {Object.<string, Lava.scope.DataBinding>}
	 */
	_data_bindings_by_property: {},

	/**
	 * Segments, bound to properties of the value of this container.
	 * [name_source_guid} => Segment
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Get a scope, which is bound to property of the value of this container
	 * @param {string} property_name
	 * @returns {Lava.scope.DataBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name);

		}

		return this._data_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, which is bound to property of the value of this container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.suspendRefreshable();

	}

});