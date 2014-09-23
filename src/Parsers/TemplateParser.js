
Lava.TemplateParser._parse = Lava.TemplateParser.parse;

/**
 * Parse and compile a template
 * @param {string} input
 * @param {_cView=} view_config View config for applying directives
 * @returns {_tTemplate}
 */
Lava.TemplateParser.parse = function(input, view_config) {

	return Lava.parsers.Common.compileTemplate(this.parseRaw(input), view_config);

};

/**
 * Parse template, but do not compile
 * @param {string} input
 * @returns {_tRawTemplate}
 */
Lava.TemplateParser.parseRaw = function(input) {

	if (this.yy.is_parsing) Lava.t("Calling TemplateParser.parseRaw() recursively will break the parser. Please, create another instance.");

	var result;

	this.lexer.x_pure_blocks_mode = false;
	this.lexer.x_export_arguments = null;
	this.yy.preserve_whitespace = false;

	try {

		this.yy.is_parsing = true;
		result = this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return result;

};

Lava.TemplateParser.yy = {

	is_parsing: false,
	/** @const */
	CONTROL_ATTRIBUTE_PREFIX: 'x:',
	preserve_whitespace: false,

	x_lexer_tag_name: null,
	x_lexer_is_fragment: false,

	/**
	 * Filters out attributes starting with 'x:' prefix, and puts them into separate property named 'x'.
	 * Control attributes are split by colon, resulting array is then used as path inside the 'x' object
	 * (similar to class paths)
	 *
	 * @param {{
		 *      attributes: Object.<string, string>,
		 *      x: _cRawX
		 * }} tag_config
	 * @param {Array.<_cRawAttribute>} raw_attributes
	 */
	_parseControlAttributes: function(tag_config, raw_attributes) {

		var i = 0,
			count = raw_attributes.length,
			attribute,
			normalized_path,
			current_object,
			segment_name,
			segments_count,
			name,
			x = {},
			attributes = {};

		for (; i < count; i++) {

			attribute = raw_attributes[i];
			if (attribute.name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

				current_object = x;
				normalized_path = attribute.name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length).split(':');
				segments_count = normalized_path.length;

				while (segments_count) {

					segments_count--;
					segment_name = normalized_path.shift();

					if (Lava.schema.DEBUG && segment_name == '') Lava.t("Malformed control attribute: " + attribute.name);

					if (segments_count) {

						if (!(segment_name in current_object)) current_object[segment_name] = {};
						current_object = current_object[segment_name];
						if (typeof(current_object) != 'object') Lava.t("Conflicting control attribute: " + attribute.name);

					} else {

						if (segment_name in current_object) Lava.t('Conflicting control attribute: ' + attribute.name);
						current_object[segment_name] = attribute.value;

					}

				}

			} else {

				if (attribute.name in attributes) Lava.t('Duplicate attribute on tag: ' + attribute.name);
				attributes[attribute.name] = attribute.value;

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in x) {
			tag_config.x = x;
			break;
		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in attributes) {
			tag_config.attributes = attributes;
			break;
		}

	},

	/**
	 * @param {string} tag_name
	 * @param {Array.<_cRawAttribute>=} raw_attributes
	 * @returns {(_cRawTag|_cRawDirective)}
	 */
	parseRawTag: function(tag_name, raw_attributes) {

		var result = {};

		if (raw_attributes) {
			this._parseControlAttributes(result, raw_attributes);
		}

		if (tag_name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

			result.type = 'directive';
			result.name = tag_name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length);

		} else {

			result.type = 'tag';
			result.name = tag_name;

		}

		return /** @type {(_cRawTag|_cRawDirective)} */ result;

	},

	validateTagEnd: function(start_object, end_name) {

		var start_name = (start_object.type == 'directive')
			? this.CONTROL_ATTRIBUTE_PREFIX + start_object.name
			: start_object.name;

		if (start_name != end_name) Lava.t('End tag ("' + end_name + '") does not match the start tag ("' + start_name + '")');

	},

	parseDynamicBlockInit: function(config, string) {

		var i = string.indexOf('/'),
			name = string.substr(0, i);

		if (Lava.schema.DEBUG && i == -1) Lava.t();
		if (Lava.schema.DEBUG && !(name[0] in Lava.parsers.Common.locator_types)) Lava.t("Malformed class name locator: " + string);

		config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
		config.real_class = string.substr(i);
		config.name = config.real_class.substr(1); // cut the slash to match the end block

		if (Lava.schema.DEBUG && (!config.class_locator.name || !config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + string);

	}

};