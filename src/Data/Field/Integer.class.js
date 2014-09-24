
Lava.define(
'Lava.data.field.Integer',
/**
 * Holds integer values
 * @lends Lava.data.field.Integer#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Numbers, consisting of digits and optionally a sign
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^(\-|\+)?([1-9]\d*|0)$/,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}

});