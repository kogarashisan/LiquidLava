
Lava.define(
'Lava.data.field.Guid',
/**
 * @lends Lava.data.field.Guid#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	'export': function(record, destination_object) {

		destination_object['guid'] = record.guid;

	},

	getValue: function(record, storage) {

		return record.guid;

	},

	setValue: function(record, storage, value) {

		Lava.t('Guid field is read only');

	}

});