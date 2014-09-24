
Lava.define(
'Lava.data.Record',
/**
 * Standard module's record
 *
 * @lends Lava.data.Record#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	/**
	 * @param module
	 * @param fields
	 * @param properties_ref
	 * @param {Object} raw_properties Object with record field values from server
	 */
	init: function(module, fields, properties_ref, raw_properties) {

		this.RecordAbstract$init(module, fields, properties_ref);

		var field;

		if (typeof(raw_properties) != 'undefined') {

			for (field in fields) {

				fields[field]['import'](this, properties_ref, raw_properties);

			}

		} else {

			for (field in fields) {

				fields[field].initNewRecord(this, properties_ref);

			}

		}

	}

});