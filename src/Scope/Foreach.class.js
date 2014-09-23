
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
	 * @const
	 */
	isValueContainer: true,

	/**
	 * Scope's argument
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.mixin.Refreshable#event:waits_refresh}
	 * @type {_tListener}
	 */
	_argument_waits_refresh_listener: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,
	/**
	 * Listener for {@link Lava.mixin.Refreshable#event:refreshed}
	 * @type {_tListener}
	 */
	_argument_refreshed_listener: null,

	/**
	 * The owner Foreach view
	 * @type {Lava.view.Foreach}
	 */
	_view: null,
	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Scope's value
	 * @type {Lava.system.Enumerable}
	 */
	_value: null,
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
	_own_enumerable: false,

	/**
	 * Should this scope create it's own instance of Enumerable, when argument's value is also Enumerable
	 * (or it will use argument's value). May be used to apply sorting and filtering
	 * @type {boolean}
	 */
	_create_own_enumerable: false,
	/**
	 * When local Enumerable is refreshed from argument, scope instance may call it's widget to apply sorting and filtering
	 * @type {string}
	 */
	_after_refresh_callback: null,

	/**
	 * Create an instance of the Foreach scope. Refresh value
	 *
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} options
	 */
	init: function(argument, view, widget, options) {

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level;

		if (this._argument.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}

		if (options) {
			this._create_own_enumerable = options['create_own_enumerable'] || false;
			this._after_refresh_callback = options['after_refresh_callback'] || null;
		}

		this._argument_waits_refresh_listener = this._argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this._argument_refreshed_listener = this._argument.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshDataSource();

	},

	/**
	 * Get new value from the `_argument`, and create a new instance of local Enumerable, or update the content of the old one
	 */
	_refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			if (argument_value.isEnumerable) {

				if (this._create_own_enumerable) {

					this._createOrUpdateCollection(argument_value);

				} else {

					if (this._own_enumerable) {

						this._value.destroy();
						this._own_enumerable = false;
						this._value = null;

					}

					if (this._value != argument_value) {
						this._value = argument_value;
						this._fire('new_enumerable');
					}

				}

			} else {

				this._createOrUpdateCollection(argument_value);

			}

			if (this._observable_listener == null) {

				if (argument_value.isEnumerable) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_enumerable) {

			this._value.removeAll();

		} else {

			this._createCollection(null);

		}

		if (this._after_refresh_callback) {
			this._widget[this._after_refresh_callback](this._value, argument_value, this._view);
		}

	},

	/**
	 * Depending on current value, create new Enumerable instance or update the old one
	 * @param {*} argument_value
	 */
	_createOrUpdateCollection: function(argument_value) {

		if (this._own_enumerable) {

			this._value.setSourceObject(argument_value);
			this._value.updateFromSourceObject();

		} else {

			this._createCollection(argument_value);

		}

	},

	/**
	 * Create the local instance of Enumerable
	 * @param {*} argument_value
	 */
	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_enumerable = true;
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
		this._is_dirty = true;
		this._queueForRefresh();

	},

	/**
	 * Argument's result has not changed (the same object), but that object itself has changed
	 */
	_onObservableChanged: function() {

		this._is_dirty = true;
		this._queueForRefresh();

	},

	/**
	 * Update value from argument
	 */
	_doRefresh: function() {

		this._refreshDataSource();
		this._fire('changed');

	},

	/**
	 * Get scope's value
	 * @returns {Lava.system.Enumerable}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Stop listening to events
	 */
	sleep: function() {

		Lava.suspendListener(this._argument_changed_listener);
		this._observable_listener && Lava.suspendListener(this._observable_listener);
		this.suspendRefreshable();

	},

	/**
	 * Resume event listeners and refresh state
	 */
	wakeup: function() {

		if (this._observable_listener) {

			if (this._argument.getValue() != this._observable) {

				this._flushObservable();

			} else {

				Lava.resumeListener(this._observable_listener);

			}

		}

		this._refreshDataSource();
		Lava.resumeListener(this._argument_changed_listener);
		this._is_dirty = false;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._argument.removeListener(this._argument_waits_refresh_listener);
		this._argument.removeListener(this._argument_changed_listener);
		this._argument.removeListener(this._argument_refreshed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_enumerable) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});