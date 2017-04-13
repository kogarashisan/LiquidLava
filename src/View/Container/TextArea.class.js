
Lava.define(
'Lava.view.container.TextArea',
/**
 * @lends Lava.view.container.TextArea#
 * @extends Lava.view.container.Element
 */
{

	Extends: "Lava.view.container.Element",

	wrap: function(html) {

		if (Lava.schema.DEBUG) this._is_rendered = true;

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name;

		for (name in this._static_properties) {

			if (name != 'value') {
				properties_string += this._renderAttribute(name, this._static_properties[name]);
			} else {
				html = this._renderAttribute(name, this._property_bindings[name].getValue());
			}

		}

		for (name in this._property_bindings) {

			if (name != 'value') {
				properties_string += this._renderAttribute(name, this._property_bindings[name].getValue());
			} else {
				html = this._renderAttribute(name, this._property_bindings[name].getValue());
			}

		}

		html = Firestorm.String.escape(html, Firestorm.String.TEXTAREA_ESCAPE_REGEX);

		if (classes) properties_string += ' class="' + classes + '"';
		if (style) properties_string += ' style="' + style + '"';

		return "<" + this._tag_name + " id=\"" + this._id + "\" " + properties_string + ">"
			+ html
			+ "</" + this._tag_name + ">";

	}

});