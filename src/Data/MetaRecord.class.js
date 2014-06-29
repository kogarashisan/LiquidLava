
Lava.define(
'Lava.data.MetaRecord',
/**
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	isMetaRecord: true,

	init: function(meta_storage, fields, properties_storage_ref) {

		this.RecordAbstract$init(meta_storage, fields, properties_storage_ref);

		for (var field in fields) {

			fields[field].initNewRecord(this, properties_storage_ref);

		}

	}

});