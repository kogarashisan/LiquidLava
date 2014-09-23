
Lava.define(
'Lava.data.field.Boolean',
/**
 * Field that holds boolean values (<kw>true</kw> or <kw>false</kw>)
 * @lends Lava.data.field.Boolean#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * @type {boolean}
	 */
	_default: false,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'boolean');

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason && typeof(value) != 'boolean') {

			reason = "Value is not boolean type";

		}

		return reason;

	}

});