
/**
 * Value of this PropertyBinding instance has changed
 * @event Lava.scope.PropertyBinding#changed
 */

Lava.define(
'Lava.scope.PropertyBinding',
/**
 * Scope, that is designed to bind to a property of a view
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @readonly
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * View's property name, to which this instance is bound
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Scope's bound view (also the scope's owner view, which created the instance)
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Listener for onPropertyChanged in bound view
	 * @type {_tListener}
	 */
	_property_changed_listener: null,

	/**
	 * PropertyBinding supports "assigns" - one-way binding of widget's property to any {@link Lava.scope.Argument} value
	 * @type {Lava.scope.Argument}
	 */
	_assign_argument: null,

	/**
	 * Create the PropertyBinding instance. Refresh value from view's property or set value from assign
	 * @param {Lava.view.Abstract} view Scope's owner view, to which it's bound
	 * @param {string} property_name
	 * @param {_cAssign} assign_config Config for the Argument, in case this scope is created in "assign" mode
	 */
	init: function(view, property_name, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._value = this._assign_argument.getValue();
            if (typeof this._value == 'undefined' && !view.isset(this._property_name)) {
                // if property is not defined, and we assign undefined to it - nothing will happen.
                // We must define this property, cause inner views can be dependent on it
                view.set(this._property_name, null);
            }
			view.set(this._property_name, this._value);
			this.level = this._assign_argument.level + 1;

		} else {

			// this is needed to order implicit inheritance
			// (in custom widget property setters logic and in view.Foreach, while refreshing children).
			// Zero was added to simplify examples from site documentation - it's not needed by framework
			this.level = view.depth || 0;

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * PropertyBinding is always bound to it's view
	 * @returns {boolean} Always returns <kw>true</kw>
	 */
	isConnected: function() {

		return true;

	},

	/**
	 * Value of "assign" argument has changed. Set view's property and schedule refresh
	 */
	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();

	},

	/**
	 * View's property has changed. Schedule refresh
	 */
	onContainerPropertyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set property value to the bound view
	 * @param {*} value
	 */
	setValue: function(value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();

	},

	_doRefresh: function() {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	destroy: function() {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});