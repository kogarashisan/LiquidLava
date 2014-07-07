Lava.define(
'Lava.scope.Foreach',
/**
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Implements: 'Lava.mixin.Refreshable',
	isValueContainer: true,

	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_argument_waits_refresh_listener: null,
	_argument_changed_listener: null,
	_argument_refreshed_listener: null,

	/**
	 * @type {Lava.system.Enumerable}
	 */
	_value: null,
	_collection_listener: null,
	_collection: null,
	_own_collection: false,

	init: function(argument) {

		this._argument = argument;
		this.level = argument.level;

		if (this._argument.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}
		this._argument_waits_refresh_listener = this._argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this._argument_refreshed_listener = this._argument.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshDataSource();

	},

	_refreshDataSource: function() {

		var data_source = this._argument.getValue();

		if (data_source && data_source.isEnumerable) {

			if (this._own_collection) {

				this._value.destroy();
				this._own_collection = false;

			}

			if (this._collection_listener == null) {

				this._collection_listener = data_source.on('collection_changed', this.onCollectionChanged, this);
				this._collection = data_source;

			}

			if (this._value != data_source) {
				this._value = data_source;
				this._fire('new_enumerable');
			}

		} else {

			if (this._own_collection && typeof(data_source == 'object') && this._value.hasSourceObject()) {

				this._value.updateFromSourceObject(data_source);

			} else {

				if (this._own_collection) {

					this._value.destroy();

				}

				this._own_collection = true;
				// do not bind any listeners, cause this collection must not be modified by hands (it would make a design flaw)
				this._value = new Lava.system.Enumerable(data_source);
				this._fire('new_enumerable');

			}

		}

	},

	onDataSourceChanged: function() {

		this._is_dirty = true;

		if (this._collection_listener) {

			this._collection.removeListener(this._collection_listener);
			this._collection_listener = null;
			this._collection = null;

		}

		this._queueForRefresh();

	},

	onCollectionChanged: function() {

		this._is_dirty = true;

		this._queueForRefresh();

	},

	_doRefresh: function() {

		this._refreshDataSource();

		this._fire('changed');

	},

	getValue: function() {

		return this._value;

	},

	sleep: function() {

		Lava.suspendListener(this._argument_changed_listener);
		this._collection_listener && Lava.suspendListener(this._collection_listener);

	},

	wakeup: function() {

		if (this._collection_listener) {

			if (this._argument.getValue() != this._collection) {

				this._collection.removeListener(this._collection_listener);
				this._collection_listener = null;
				this._collection = null;

			} else {

				Lava.resumeListener(this._collection_listener);

			}

		}

		this._refreshDataSource();
		Lava.resumeListener(this._argument_changed_listener);
		this._is_dirty = false;

	},

	destroy: function() {

		this._argument.removeListener(this._argument_waits_refresh_listener);
		this._argument.removeListener(this._argument_changed_listener);
		this._argument.removeListener(this._argument_refreshed_listener);
		this._collection_listener && this._collection.removeListener(this._collection_listener);

		if (this._own_collection) {

			this._value.destroy();

		}

		this.destroyRefreshable();

	}

});