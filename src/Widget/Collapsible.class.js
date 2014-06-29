
Lava.define(
'Lava.widget.Collapsible',
/**
 * @lends Lava.widget.Collapsible#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible',

	_property_descriptors: {
		is_expanded: {type: 'Boolean', setter: '_setExpanded'},
		is_animation_enabled: {type: 'Boolean'}
	},

	_properties: {
		is_expanded: true,
		is_animation_enabled: true,
		content: ''
	},

	_role_handlers: {
		_container_view: '_handleContainerView'
	},

	_panel_container: null,
	_animation: null,
	_default_display: null,

	TOGGLE_ANIMATION_CLASS: 'Toggle',

	_refreshAnimation: function(is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {class: this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options.class](animation_options, element);
			this._animation.on('complete', this._onAnimationComplete, this);

		}

		// content may be re-rendered and the old element reference may become obsolete
		this._animation.setTarget(element);

		if (is_forwards) {

			this._animation.resetDirection();

		} else {

			this._animation.reverseDirection();

		}

		this._animation.safeStart();

	},

	_onAnimationComplete: function() {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},

	_setExpanded: function(name, value) {

		var new_display = 'none';

		if (this._properties.is_expanded != value) {

			this._set(name, value);

			if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

				new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

			}

			// if this property is set in constructor - than container does not yet exist
			if (this._panel_container) {

				this._panel_container.setStyle('display', new_display);

			}

			if (this._is_inDOM) {

				this._fire(value ? 'expanding' : 'collapsing');

				if (this._properties.is_animation_enabled && this._panel_container) {

					this._refreshAnimation(value);

				} else {

					this._fire(value ? 'expanded' : 'collapsed');

				}

			}

		}

	},

	_handleContainerView: function(view, template_arguments) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || null;

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},

	getMainContainer: function() {

		return this._panel_container;

	}

});