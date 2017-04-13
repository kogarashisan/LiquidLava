
/**
 * Content of scope's enumerable has changed
 * @event Lava.scope.Foreach#changed
 */

/**
 * Scope has created a new Enumerable instance. All old UIDs are now invalid
 * @event Lava.scope.Foreach#new_enumerable
 */

Lava.define(
'Lava.scope.Foreach',
/**
 * Designed to serve data to Foreach view. Transforms value of Argument into Enumerable
 *
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Scope's argument
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,
	/**
	 * Listens to changes in `_observable`. Event name varies
	 * @type {_tListener}
	 */
	_observable_listener: null,
	/**
	 * Holds argument value, when it's instance of Observable. Used to remove listener
	 * @type {Lava.mixin.Observable}
	 */
	_observable: null,
	/**
	 * Has this instance created a new Enumerable instance to serve data, or is it using the instance
	 * which was returned from `_argument`
	 * @type {boolean}
	 */
	_own_collection: false,

	/**
	 * Create an instance of the Foreach scope. Refresh value
	 *
	 * @param {Lava.scope.Argument} argument
	 */
	init: function(argument) {

		this.guid = Lava.guid++;
		this._argument = argument;
		this.level = argument.level + 1;

		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this._refreshDataSource();

	},

	/**
	 * Get new value from the `_argument`, and create a new instance of local Enumerable, or update the content of the old one
	 */
	_refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			if (argument_value.isCollection) {

				if (this._own_collection) {

					this._value.destroy();
					this._own_collection = false;
					this._value = null;

				}

				if (this._value != argument_value) {
					this._value = argument_value;
					this._fire('new_enumerable');
				}

			} else if (this._own_collection) {

				this._value.refreshFromDataSource(argument_value);

			} else {

				this._createCollection(argument_value);

			}

			if (this._observable_listener == null) {

				if (argument_value.isCollection) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_collection) {

			this._value.removeAll();

		} else {

			// will be called only when "own_enumerable_mode" is off, cause otherwise this._own_collection is always true
			this._createCollection(null);

		}

		this._fire('changed');

	},

	/**
	 * Create the local instance of Enumerable
	 * @param {*} argument_value
	 */
	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_collection = true;
		this._fire('new_enumerable');

	},

	/**
	 * Get rid of old Observable and it's listener (argument result has changed)
	 */
	_flushObservable: function() {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},

	/**
	 * Argument has changed
	 */
	onDataSourceChanged: function() {

		if (this._observable_listener) this._flushObservable();
		this._queueForRefresh();

	},

	/**
	 * Argument's result has not changed (the same object), but that object itself has changed
	 */
	_onObservableChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Update value from argument
	 */
	_doRefresh: function() {

		this._refreshDataSource();

	},

	/**
	 * Get scope's value
	 * @returns {Lava.system.Enumerable}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._argument.removeListener(this._argument_changed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_collection) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});