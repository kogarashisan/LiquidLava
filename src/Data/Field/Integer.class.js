
Lava.define(
'Lava.data.field.Integer',
/**
 * Holds integer values
 * @lends Lava.data.field.Integer#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	Shared: '_shared',

	_shared: {
		valid_value_regex: /^(\-|\+)?([1-9]\d*|0)$/
	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this._shared.valid_value_regex.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this._shared.valid_value_regex.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}

});