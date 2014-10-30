
Lava.define(
'Lava.system.DataView',
/**
 * Holds a subset of values from {@link Lava.system.Enumerable}, preserving item UIDs.
 * Can remove, filter and sort existing values, but can't be used to add new values.
 *
 * @lends Lava.system.DataView#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @const
	 */
	isDataView: true,

	/**
	 * @type {Lava.system.Enumerable}
	 */
	_data_source: null,

	/**
	 * Create DataView instance
	 * @param {Lava.system.Enumerable} data_source
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

	},

	setDataSource: function(data_source) {

		if (Lava.schema.DEBUG && !data_source.isCollection) Lava.t("Wrong argument supplied for DataView constructor");
		this._data_source = data_source;

	},

	refreshFromDataSource: function (data_source) {

		this.setDataSource(data_source);
		this.refresh();

	},

	getDataSource: function() {

		return this._data_source;

	}

});