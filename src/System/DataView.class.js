
Lava.define(
'Lava.system.DataView',
/**
 * Holds a subset of values from {@link Lava.system.Enumerable}, preserving item UIDs.
 * Can remove, filter and sort existing values, but can't be used to add new values.
 *
 * This class is used to display paginated and filtered data.
 *
 * @lends Lava.system.DataView#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @type {boolean}
	 * @readonly
	 */
	isDataView: true,

	/**
	 * The existing collection, which provides data for this instance
	 * @type {Lava.system.CollectionAbstract}
	 */
	_data_source: null,

	/**
	 * Create DataView instance
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;
		data_source && this.refreshFromDataSource(data_source);

	},

	/**
	 * Refresh the DataView from it's Enumerable
	 */
	refresh: function() {

		this._data_names = this._data_source.getNames();
		this._data_values = this._data_source.getValues();
		this._data_uids = this._data_source.getUIDs();
		this._count = this._data_uids.length;
		this._fire('collection_changed');

	},

	/**
	 * Set new `_data_source`
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	setDataSource: function(data_source) {

		if (Lava.schema.DEBUG && !data_source.isCollection) Lava.t("Wrong argument supplied for DataView constructor");
		this._data_source = data_source;

	},

	/**
	 * Set `_data_source` and refresh from it
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	refreshFromDataSource: function (data_source) {

		this.setDataSource(data_source);
		this.refresh();

	},

	/**
	 * Get `_data_source`
	 * @returns {Lava.system.CollectionAbstract}
	 */
	getDataSource: function() {

		return this._data_source;

	}

});