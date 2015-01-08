
/**
 * Content of scope's enumerable has changed
 * @event Lava.scope.Foreach#changed
 */

/**
 * Scope has created a new Enumerable instance. All old UIDs are now invalid
 * @event Lava.scope.Foreach#new_enumerable
 */

/**
 * Scope has refreshed it's value from argument.
 * This event is fired before 'changed' event and may be used to sort and filter data in Foreach views.
 * @event Lava.scope.Foreach#after_refresh
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
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

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
	_own_collection: false,

	/**
	 * Scope options
	 * @type {?_cScopeForeach}
	 */
	_config: null,

	/**
	 * Scopes, on which this one depends. When they change - this scope is refreshed.
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: null,

	/**
	 * Listeners for `_binds`
	 * @type {?Array.<_tListener>}
	 */
	_bind_changed_listeners: null,

	/**
	 * Create an instance of the Foreach scope. Refresh value
	 *
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} config
	 */
	init: function(argument, view, widget, config) {

		var i = 0,
			count,
			depends,
			bind;

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level + 1;

		if (config) {

			if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(config['own_enumerable_mode']) == -1) Lava.t('Unknown value in own_enumerable_mode option: ' + config['own_enumerable_mode']);

			if (config['own_enumerable_mode'] == "DataView") {
				this._refreshDataSource = this._refreshDataSource_DataView;
				this._value = new Lava.system.DataView();
			} else {
				this._refreshDataSource = this._refreshDataSource_Enumerable;
				this._value = new Lava.system.Enumerable();
			}

			this._own_collection = true;

			if (config['depends']) {

				depends = config['depends'];
				this._binds = [];
				this._bind_changed_listeners = [];

				for (count = depends.length; i < count; i++) {

					if (depends[i].isDynamic) {

						bind = view.locateViewByPathConfig(depends[i]).getDynamicScope(view, depends[i]);

					} else {

						bind = view.getScopeByPathConfig(depends[i]);

					}

					this._binds.push(bind);
					this._bind_changed_listeners.push(bind.on('changed', this._onDependencyChanged, this));

				}

			}

		}

		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this.refreshDataSource();

	},

	/**
	 * One of scopes from `_binds` has changed, place this scope into refresh queue
	 */
	_onDependencyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Perform refresh in regular mode (without "own_enumerable_mode" option)
	 * @param {(object|Array|Lava.mixin.Properties|Lava.system.Enumerable)} argument_value value, received from argument
	 */
	_refreshDataSource: function(argument_value) {

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

	},

	_refreshDataSource_Enumerable: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");
		// unlike DataView, Enumerable does not copy UIDs, so there is no need to fire "new_enumerable"
		this._value.refreshFromDataSource(argument_value);

	},

	_refreshDataSource_DataView: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");

		if (this._value.getDataSource() != argument_value) {
			// DataView copies UIDs from original Enumerable instance
			this._fire('new_enumerable');
		}

		this._value.refreshFromDataSource(argument_value);

	},

	/**
	 * Get new value from the `_argument`, and create a new instance of local Enumerable, or update the content of the old one
	 */
	refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			this._refreshDataSource(argument_value);

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

		this._fire('after_refresh');
		this._fire('changed');

	},

	createsOwnEnumerable: function() {

		return this._config['own_enumerable_mode'];

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

		this.refreshDataSource();

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

		if (this._binds) {

			for (var i = 0, count = this._binds.length; i < count; i++) {
				this._binds[i].removeListener(this._bind_changed_listeners[i]);
			}

			this._binds = this._bind_changed_listeners = null;

		}

		this._argument.removeListener(this._argument_changed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_collection) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});