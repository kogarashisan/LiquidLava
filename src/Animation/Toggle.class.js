
Lava.define(
'Lava.animation.Toggle',
/**
 * Primary purpose of this class: emulate animation support in cases when it's not enabled
 * (and leave the same code, that works with animations)
 *
 * @lends Lava.animation.Toggle#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	_finish: function() {

		Firestorm.Element.setStyle(this._target, 'display', this._is_reversed ? 'none' : 'block');
		this.Standard$_finish();

	}

});