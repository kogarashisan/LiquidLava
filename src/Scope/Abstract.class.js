Lava.define(
'Lava.scope.Abstract',
/**
 @lends Lava.scope.Abstract#
 @extends Lava.mixin.Refreshable
 */
{

	Implements: 'Lava.mixin.Refreshable',

	isValueContainer: true,

	/**
	 * @type {Object.<string, Lava.scope.DataBinding>}
	 */
	_data_bindings_by_property: {},

	/**
	 * [name_source_guid} => Segment
	 * @type {Object.<Lavadoc._tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * @param {string} property_name
	 * @returns {Lava.scope.DataBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name, this.level);

		}

		return this._data_bindings_by_property[property_name];

	},

	/**
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope, this.level);

		}

		return this._data_segments[name_source_scope.guid];

	},

	destroy: function() {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.destroyRefreshable();

	}

});