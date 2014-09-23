
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
	 * @param storage
	 * @returns {_tGUID}
	 */
	getValue: function(record, storage) {

		return record.guid;

	},

	/**
	 * Throws an error
	 */
	setValue: function(record, storage, value) {

		Lava.t('Guid field is read only');

	}

});