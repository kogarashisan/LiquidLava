
Lava.define(
'Lava.animation.Collapse',
/**
 * Expand (forwards) and collapse (backwards) an element. May operate with either height (default) or width property.
 * Adjusts animation duration dynamically, depending on distance
 *
 * @lends Lava.animation.Collapse#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',
	Shared: ['_shared'],

	/**
	 * Animation config
	 */
	_shared: {
		default_config: {
			// duration is set dynamically
			transition_name: 'outQuad',
			animators: [{
				type: 'Integer',
				property: 'height',
				delta: 0 // actual height will be set at run time
			}]
		}
	},

	/**
	 * Property to animate
	 * @type {string}
	 */
	_property: 'height',

	/**
	 * Minimal animation duration, milliseconds
	 * @type {number}
	 * @const
	 */
	DURATION_BIAS: 200,

	init: function(config, target) {

		var new_config = {};
		Firestorm.extend(new_config, this._shared.default_config);
		Firestorm.extend(new_config, config);

		// assuming that the first animator is Integer
		if (Lava.schema.DEBUG && !new_config.animators[0].property) Lava.t("Collapse: malformed animation config");
		this._property = new_config.animators[0].property;

		this.Standard$init(new_config, target);

	},

	start: function(started_time) {

		// in case we are starting from collapsed state
		Firestorm.Element.setStyle(this._target, this._property, 'auto');
		// assuming that target is element
		var property_value = Firestorm.Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
		this._animators[0].delta = property_value;
		this.setDuration(this.DURATION_BIAS + Math.floor(property_value)); // time depends on distance, to make it smoother

		this.Standard$start(started_time);

	},

	_finish: function() {

		if (!this._is_reversed) {

			// animation has expanded the container, height (or width) must be unlocked to allow element to adapt it's dimensions
			// (otherwise, if children nodes are added or removed - height will remain the same)
			Firestorm.Element.setStyle(this._target, this._property, 'auto');

		}

		this.Standard$_finish();

	}

});