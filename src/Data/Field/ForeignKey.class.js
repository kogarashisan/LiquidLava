
Lava.define(
'Lava.data.field.ForeignKey',
/**
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Integer
 */
{

	Extends: 'Lava.data.field.Integer',

	_shared: {
		valid_value_regex: /^\d+$/
	},

	isForeignKey: true,

	_default: 0

});