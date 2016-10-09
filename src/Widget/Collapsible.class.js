/**
 * Panel started to expand
 * @event Lava.widget.Collapsible#expanding
 */

/**
 * Panel started to collapse
 * @event Lava.widget.Collapsible#collapsing
 */

/**
 * Panel has fully expanded
 * @event Lava.widget.Collapsible#expanded
 */

/**
 * Panel is collapsed
 * @event Lava.widget.Collapsible#collapsed
 */

Lava.define(
'Lava.widget.Collapsible',
/**
 * Animated HTML element, which can be shown and hidden
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
		/** Is the element expanded */
		is_expanded: true,
		/** Use animation, while expanding and collapsing the element */
		is_animation_enabled: true,
		/** Content for default widget's template */
		content: ''
	},

	_role_handlers: {
		_container_view: '_handleContainerView'
	},

	/**
	 * Main container of the expandable DOM element
	 * @type {Lava.view.container.Element}
	 */
	_panel_container: null,
	/**
	 * DOM element's animation
	 * @type {Lava.animation.Abstract}
	 */
	_animation: null,
	/**
	 * The "display" CSS rule from container's element
	 * @type {string}
	 */
	_default_display: '',

	/**
	 * When animation is disabled, Toggle animation is used to show and hide the DOM element
	 * @type {string}
	 * @const
	 */
	TOGGLE_ANIMATION_CLASS: 'Toggle',

	/**
	 * Create animation, set it's direction and run it
	 * @param {boolean} is_forwards Is widget's element expanding
	 */
	_refreshAnimation: function(is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {"class": this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options['class']](animation_options, element);
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

	/**
	 * Fire widget's events and fix element's "display" CSS rule
	 */
	_onAnimationComplete: function() {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},

	/**
	 * Setter for <wp>is_expanded</wp> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setExpanded: function(value, name) {

		var new_display = 'none';

		this._set(name, value);

		if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

			new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

		}

		// if this property is set in constructor - then container does not yet exist
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

	},

	/**
	 * Handle view with main container
	 * @param {Lava.view.Abstract} view
	 */
	_handleContainerView: function(view) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || '';

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},

	/**
	 * Get `_panel_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._panel_container;

	}

});