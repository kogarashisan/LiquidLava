
Lava.define(
'Lava.data.RecordAbstract',
/**
 * @lends Lava.data.RecordAbstract#
 * @extends Lava.mixin.Properties
 */
{

	Implements: 'Lava.mixin.Properties',

	isRecord: true,

	// replace the default value to save some processor time on garbage collection (it's assigned in constructor)
	_properties: null,

	_module: null,

	_fields: null,

	/**
	 * Every record must have it's own GUID. otherwise collections and ForEach loops will not be able to distinguish
	 * between records from different modules with equal ID fields.
	 */
	guid: null,

	init: function(module, fields, properties_storage_ref) {

		this.guid = Lava.guid++;
		this._module = module;
		this._fields = fields;
		this._properties = properties_storage_ref;

	},

	get: function(name) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		return this._fields[name].getValue(this, this._properties);

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		this._fields[name].setValue(this, this._properties, value);

	},

	getModule: function() {

		return this._module;

	},

	'export': function() {

		var export_record = {};

		for (var field in this._fields) {

			this._fields[field]['export'](this, export_record);

		}

		return export_record;

	}

});