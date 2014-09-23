Lava.define(
'Lava.scope.Binding',
/**
 * Two-way binding between a widget property and a scope path
 * @lends Lava.scope.Binding#
 */
{

	/**
	 * The scope, which is bound to property of the widget
	 * @type {_iValueContainer}
	 */
	_scope: null,
	/**
	 * Widget with bound property
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Bound property name in widget
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Listener for "changed" event
	 * @type {_tListener}
	 */
	_scope_changed_listener: null,
	/**
	 * Listener for onPropertyChanged in `_widget`
	 * @type {_tListener}
	 */
	_widget_property_changed_listener: null,

	/**
	 * Create Binding instance. Refresh widget's property value
	 * @param {_cBinding} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, widget) {

		this._widget = widget;
		this._property_name = config.property_name;
		this._scope = widget.getScopeByPathConfig(config.path_config);

		var widget_listener = true,
			scope_listener = true;

		if ('direction' in config) {

			if (config.direction == Lava.BINDING_DIRECTIONS.TO_WIDGET) {

				this._widget.set(this._property_name, this._scope.getValue());
				widget_listener = false;

			} else {

				if (Lava.schema.DEBUG && config.direction != Lava.BINDING_DIRECTIONS.FROM_WIDGET) Lava.t();

				this._scope.setValue(this._widget.get(this._property_name));
				scope_listener = false;

			}

		} else {

			this._widget.set(this._property_name, this._scope.getValue());

		}

		if (scope_listener) {
			this._scope_changed_listener = this._scope.on('changed', this.onScopeChanged, this);
		}

		if (widget_listener) {
			if (!this._scope.isSetValue) Lava.t("Binding: bound scope does not implement setValue");
			this._widget_property_changed_listener = widget.onPropertyChanged(this._property_name, this.onWidgetPropertyChanged, this);
		}

	},

	/**
	 * Scope, which is bound to widget property, has changed. Refresh widget property value
	 */
	onScopeChanged: function() {

		// avoid setting nulls to non-nullable fields.
		if (this._scope.isConnected()) {

			// turning off both of them to avoid infinite loop. From architect's point of view, better solution would be
			// to hang up developer's browser, but if it happens in production - it may have disastrous consequences.
			Lava.suspendListener(this._widget_property_changed_listener);
			Lava.suspendListener(this._scope_changed_listener);
			this._widget.set(this._property_name, this._scope.getValue());
			Lava.resumeListener(this._widget_property_changed_listener);
			Lava.resumeListener(this._scope_changed_listener);

		}

	},

	/**
	 * Widget property has changed. Refresh bound scope value
	 */
	onWidgetPropertyChanged: function() {

		Lava.suspendListener(this._widget_property_changed_listener);
		Lava.suspendListener(this._scope_changed_listener);
		this._scope.setValue(this._widget.get(this._property_name));
		Lava.resumeListener(this._widget_property_changed_listener);
		Lava.resumeListener(this._scope_changed_listener);

	},

	destroy: function() {

		this._scope_changed_listener && this._scope.removeListener(this._scope_changed_listener);
		this._widget_property_changed_listener && this._widget.removePropertyListener(this._widget_property_changed_listener);

	}

});