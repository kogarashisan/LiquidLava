
Lava.define(
'Lava.data.Record',
/**
 * @lends Lava.data.Record#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	init: function(module, fields, properties_storage_ref, raw_properties) {

		this.RecordAbstract$init(module, fields, properties_storage_ref);

		var field;

		if (typeof(raw_properties) != 'undefined') {

			for (field in fields) {

				fields[field]['import'](this, properties_storage_ref, raw_properties);

			}

		} else {

			for (field in fields) {

				fields[field].initNewRecord(this, properties_storage_ref);

			}

		}

	}

});