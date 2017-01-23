
Lava.define(
'Lava.data.MetaRecord',
/**
 * Record for {@link Lava.data.MetaStorage} module
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.Record
 */
{

	Extends: 'Lava.data.Record',

	/**
	 * Instance belongs to MetaRecord class
	 * @type {boolean}
	 * @readonly
	 */
	isMetaRecord: true,

	/**
	 * GUID of external record (or object), to which this instance is attached
	 * @type {number}
	 * @readonly
	 */
	ext_guid: 0,
	/**
	 * Optional external record instance, which owns `ext_guid`
	 * @type {Object}
	 */
	_original_record: null,

	/**
	 * @param module
	 * @param fields
	 * @param properties_ref
	 * @param raw_properties
	 * @param {Object} original_record Optional external record instance, to which this record is attached
	 */
	init: function(module, fields, properties_ref, raw_properties, original_record) {

		this.Record$init(module, fields, properties_ref, raw_properties);

		if (original_record) {

			this._original_record = original_record;

		}

	},

	/**
	 * Get `_original_record`
	 * @returns {?Object}
	 */
	getOriginalRecord: function() {

		return this._original_record;

	}

});