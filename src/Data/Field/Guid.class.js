
Lava.define(
'Lava.data.field.Guid',
/**
 * Returns record's `guid` property
 * @lends Lava.data.field.Guid#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	'export': function(record, destination_object) {

		destination_object['guid'] = record.guid;

	},

	/**
	 * Get record's `guid` property
	 * @param record
	 * @param properties
	 * @returns {_tGUID}
	 */
	getValue: function(record, properties) {

		return record.guid;

	},

	/**
	 * Throws an error
	 */
	setValue: function(record, properties, value) {

		Lava.t('Guid field is read only');

	}

});