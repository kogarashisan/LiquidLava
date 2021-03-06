
Lava.define(
'Lava.animation.BootstrapCollapse',
/**
 * Expand and collapse an element using browser transitions from Bootstrap CSS framework
 *
 * @lends Lava.animation.BootstrapCollapse#
 * @extends Lava.animation.Emulated
 */
{

	Extends: 'Lava.animation.Emulated',

	/**
	 * Fixed duration from CSS rules
	 * @type {number}
	 */
	_duration: 350,
	/**
	 * 'width' or 'height'
	 * @type {string}
	 */
	_property: 'height',
	/**
	 * The value of width (or height) of the element. Updated every time the animation starts
	 * @type {number}
	 */
	_property_value: 0,

	init: function(config, target) {

		this.Emulated$init(config, target);

		if (config.property) {
			this._property = config.property;
		}

	},

	_start: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) { // collapse an element that is currently expanded

			// explicitly set the height/width on the element to make transition happen
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '' + this._property_value);
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.removeClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, '0');

		} else { // expand a collapsed element

			Element.removeClass(this._target, 'collapse');
			Element.setStyle(this._target, this._property, 'auto');
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '0');
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.setStyle(this._target, this._property, '' + this._property_value);

		}

	},

	_end: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) {

			Element.removeClass(this._target, 'collapsing');
			Element.addClass(this._target, 'collapse');

		} else {

			Element.removeClass(this._target, 'collapsing');
			Element.addClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 'auto');

		}

	},

	_reverse: function() {

		if (this._is_reversed) {

			Firestorm.Element.setStyle(this._target, this._property, '' + this._property_value);

		} else {

			Firestorm.Element.setStyle(this._target, this._property, '0');

		}

	}

});