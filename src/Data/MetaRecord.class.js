
Lava.define(
'Lava.data.MetaRecord',
/**
 * Record for {@link Lava.data.MetaStorage} module
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	/**
	 * Instance belongs to MetaRecord class
	 * @type {boolean}
	 * @const
	 */
	isMetaRecord: true,

	init: function(meta_storage, fields, properties_ref) {

		this.RecordAbstract$init(meta_storage, fields, properties_ref);

		for (var field in fields) {

			fields[field].initNewRecord(this, properties_ref);

		}

	}

});