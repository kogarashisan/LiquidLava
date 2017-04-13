/**
 * Common methods and properties for working with widget templates
 */
Lava.parsers.Common = {

	/**
	 * Same as regex in {@link Firestorm.String}, but without quotes and backslash
	 */
	UNQUOTE_ESCAPE_REGEX: /[\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	/**
	 * Input types, to which a special container is applied - {@link Lava.view.TextInputElement}.
	 * That container contains fixes for IE8-9
	 */
	TEXTLIKE_INPUTS: {
		date: true,
		"datetime-local": true,
		week: true,
		time: true,
		month: true,
		email: true,
		tel: true,
		text: true,
		url: true,
		search: true,
		range: true,
		password: true,
		color: true,
		number: true
	},

	/**
	 * The only allowed options on view's hash
	 * @type {Array.<string>}
	 */
	_allowed_hash_options: [
		'id',
		'label',
		'escape_off',
		'as'
	],
	/**
	 * Allowed "x:" attributes on elements
	 * @type {Array.<string>}
	 */
	_allowed_control_attributes: [
		'dom-event',
		'class-event',
		'bind',
		'style',
		'classes',
		'container_class',
		'type',
		'options',
		'label',
		'resource_id',
		'widget'
	],
	/**
	 * Words, that cannot be used as a label
	 * @type {Array.<string>}
	 */
	_reserved_labels: ['parent', 'widget', 'this', 'root', 'event_object', 'event_args'],

	/**
	 * When widgets are referenced in expressions - they are prefixed with these special characters, which define the kind of reference
	 * @type {Object.<string, string>}
	 */
	locator_types: {
		'#': 'Id',
		'@': 'Label',
		'$': 'Name'
	},

	/**
	 * A widget locator with a name (`_identifier_regex`) after dot. Examples: <str>"@accordion.accordion_panel"</str>,
	 * <str>"$tree.Tree$node"</str>.
	 */
	_locator_regex: /^[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\.([a-zA-Z\_][\$a-zA-Z0-9\_]*)/,
	/**
	 * Valid name of a variable
	 * @type {RegExp}
	 */
	_identifier_regex: /^[a-zA-Z\_][\$a-zA-Z0-9\_]*/,

	/**
	 * Special setters for some properties in view config
	 * @type {Object.<string, string>}
	 */
	_view_config_property_setters: {
		id: 'setViewConfigId',
		label: 'setViewConfigLabel'
	},

	/**
	 * For each type of item in raw templates: callbacks that return it's "compiled" version
	 * @type {Object.<string, string>}
	 */
	_compile_handlers: {
		string: '_compileString',
		include: '_compileInclude',
		expression: '_compileExpression',
		directive: '_compileDirective',
		block: '_compileBlock',
		tag: '_compileTag', // plain html tag, which should be converted to string
		// depending on attributes, tag may be treated as one of the following types:
		view: '_compileView', // element with x:type='view'
		container: '_compileContainer', // element with x:type='container'
		static: '_compileStaticContainer', // element with x:type='static'
		widget: '_compileWidget', // element with x:widget='WidgetName'
		sugar: '_compileSugar' // element with it's name in schema.sugar_map
	},

	LITERALS: {
		'null': null,
		'undefined': void 0,
		'true': true,
		'false': false
	},

	/**
	 * Translate name of the view to name of it's class
	 * @param {string} name
	 * @returns {string}
	 */
	_viewNameToClass: function(name) {

		return Lava.schema.parsers.view_name_to_class_map[name] || name;

	},

	/**
	 * Store values from view's hash as config properties
	 * @param {_cView} view_config
	 * @param {Object} raw_hash
	 */
	_parseViewHash: function(view_config, raw_hash) {

		for (var name in raw_hash) {

			if (Lava.schema.DEBUG && this._allowed_hash_options.indexOf(name) == -1) {
				Lava.t("Hash option is not supported: " + name + ((('as' in raw_hash) && !raw_hash['as']) ? ". Probably, you are missing the '=' sign between 'as' and it's value: as=" + name : ''));
			}

			if (name in this._view_config_property_setters) {
				this[this._view_config_property_setters[name]](view_config, raw_hash[name]);
			} else {
				view_config[name] = raw_hash[name];
			}

		}

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: config property setters

	/**
	 * Check {@link _cView#id} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} id
	 */
	setViewConfigId: function(view_config, id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(id)) Lava.t();
		view_config.id = id;

	},

	/**
	 * Check {@link _cView#label} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} label
	 */
	setViewConfigLabel: function(view_config, label) {

		if (Lava.schema.DEBUG && !Lava.VALID_LABEL_REGEX.test(label)) Lava.t("Malformed view label");
		if (Lava.schema.DEBUG && this._reserved_labels.indexOf(label) != -1) Lava.t("Label name is reserved: " + label);
		view_config.label = label;

	},

	// End: config property setters
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: block handlers

	/**
	 * Compile a raw directive. Directives either produce widget configs, or modify the config of their parent view
	 * @param {_tTemplate} result
	 * @param {_cRawDirective} directive
	 * @param {_cView} view_config
	 */
	_compileDirective: function(result, directive, view_config) {

		var directive_result = Lava.parsers.Directives.processDirective(
				directive,
				view_config,
				// code style: to ensure, that view/widget directives are at the top
				(result.length == 0 || (result.length == 1 && typeof(result[0]) == 'string' && Lava.EMPTY_REGEX.test(result[0])))
			);

		if (directive_result) {

			if (typeof(directive_result) == 'string') {

				this._compileString(result, directive_result);

			} else {

				result.push(directive_result);

			}

		}

	},

	/**
	 * Compile raw include (push as is)
	 * @param {_tTemplate} result
	 * @param {_cInclude} include_config
	 */
	_compileInclude: function(result, include_config) {

		result.push(include_config);

	},

	/**
	 * Compile raw string (push or append to the last string in result)
	 * @param {_tTemplate} result
	 * @param {string} string
	 */
	_compileString: function(result, string) {

		var lastIndex = result.length - 1,
			// lastIndex may be -1, but this will eval correctly
			append_string = typeof (result[lastIndex]) == 'string';

		if (append_string) {

			result[lastIndex] += string;

		} else {

			result.push(string);

		}

	},

	/**
	 * Compile raw block (represents a view)
	 * @param {_tTemplate} result
	 * @param {_cRawBlock} raw_block
	 */
	_compileBlock: function(result, raw_block) {

		/** @type {_cView} */
		var config = {
				type: 'view',
				"class": null
			},
			i = 0,
			count;

		if (Lava.schema.parsers.PRESERVE_VIEW_NAME) {
			config.view_name = raw_block.name;
		}

		if ('arguments' in raw_block) {

			if (Lava.schema.DEBUG && raw_block.arguments.length > 1) Lava.t('Block may have no more than one argument');
			if (raw_block.arguments.length) {
				config.argument = raw_block.arguments[0];
			}

		}

		if ('class_locator' in raw_block) {
			config.class_locator = raw_block.class_locator;
			config.real_class = raw_block.real_class;
			config['class'] = Lava.schema.view.DEFAULT_CLASS_LOCATOR_GATEWAY;
		} else {
			config['class'] = this._viewNameToClass(raw_block.name);
		}

		if (raw_block.prefix == '$') {
			config.container = {type: 'Morph'};
		}

		this._parseViewHash(config, raw_block.hash); // before content, so directives could be parsed into the config

		if ('content' in raw_block) {
			config.template = this.compileTemplate(raw_block.content, config);
		} else {
			config.template = [];
		}

		if ('else_content' in raw_block) {
			config.else_template = this.compileTemplate(raw_block.else_content);
		}

		if ('elseif_arguments' in raw_block) {
			config.elseif_arguments = raw_block.elseif_arguments;
			config.elseif_templates = [];
			for (count = raw_block.elseif_content.length; i < count; i++) {
				config.elseif_templates.push(this.compileTemplate(raw_block.elseif_content[i]));
			}
		}

		result.push(config);

	},

	/**
	 * Compile raw expression view. Will produce a view config with class="Expression"
	 * @param {_tTemplate} result
	 * @param {_cRawExpression} raw_expression
	 */
	_compileExpression: function(result, raw_expression) {

		if (raw_expression.arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		var config = {
			type: 'view',
			"class": 'Expression',
			argument: raw_expression.arguments[0]
		};

		if (raw_expression.prefix == '$') {

			config.container = {type: 'Morph'};

		}

		result.push(config);

	},

	/**
	 * Serialize the tag back into text
	 * @param {_tTemplate} result
	 * @param {_cRawTag} tag
	 */
	_compileTag: function(result, tag) {

		if (Lava.schema.DEBUG && Lava.parsers.Directives.hasDirective(tag.name)) Lava.logWarning("A tag looks like directive: " + tag.name + ". Did you forget the 'x:' prefix?");

		var is_void = Lava.isVoidTag(tag.name),
			tag_start_text = "<" + tag.name
				+ this.renderTagAttributes(tag.attributes)
				+ (is_void ? '/>' : '>'),
			inner_template,
			count;

		this. _compileString(result, tag_start_text);

		if (Lava.schema.DEBUG && is_void && tag.content) Lava.t("Void tag with content: " + tag.name);

		if (!is_void) {

			if (tag.content) {

				inner_template = this.compileTemplate(tag.content);
				count = inner_template.length;

				if (count && typeof (inner_template[0]) == 'string') {

					this._compileString(result, inner_template.shift());
					count--;

				}

				if (count) {

					result.splice.apply(result, [result.length, 0].concat(inner_template));

				}

			}

			this. _compileString(result, "</" + tag.name + ">");

		}

	},

	/**
	 * Compile raw tag with x:type="view". Will produce a {@link Lava.view.View} with an Element container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileView: function(result, raw_tag) {

		var view_config = {
				type: 'view',
				"class": 'View',
				container: this._toContainer(raw_tag)
			},
			x = raw_tag.x;

		this._parseViewAttributes(view_config, raw_tag);

		if ('content' in raw_tag) {
			view_config.template = this.compileTemplate(raw_tag.content, view_config);
			if (Lava.schema.DEBUG) {
				if (Lava.isVoidTag(raw_tag.name)) Lava.t("Void tag with content: " + raw_tag.name);
				if (raw_tag.name == 'textarea') {
					if (view_config.template.length > 1) Lava.t("You can have only static text content inside textarea view. However, you can bind it's 'value' attribute");
					if (view_config.template.length == 1 && (typeof view_config.template[0] != 'string' || Firestorm.String.TEXTAREA_ESCAPE_REGEX.test(view_config.template[0])))
						Lava.t("Inside textarea view you can have only static text content without these special characters: &<>\'\". However, you can bind it's 'value' attribute. Tip: this is done on purpose, to avoid problems with escaping.");
				}
			}
		}

		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in view_config.container) || ('static_properties' in view_config.container) || ('static_styles' in view_config.container)))
				Lava.t("View container with resource_id: all properties must be moved to resources");
			view_config.container.resource_id = this.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile raw tag with x:type="container". Extract the wrapped view and set this tag as it's container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileContainer: function(result, raw_tag) {

		var x = raw_tag.x,
			inner_template,
			view_config,
			container_config,
			container_config_directive = null,
			name;

		if (Lava.schema.DEBUG) {

			if (Lava.isVoidTag(raw_tag.name)) Lava.t("Attempt to use a void tag as container: " + raw_tag.name);
			if (raw_tag.name == 'textarea') Lava.t("textarea tag can not be a container, only a view");
			if (!raw_tag.content) Lava.t("Empty container tag");
			this._assertControlAttributesValid(x);

			if (('options' in x) || ('label' in x)) {

				Lava.t("Please move x:options and x:label from container element to the wrapped view");

			}

		}

		inner_template = this.asBlocks(raw_tag.content);

		// inside there may be either a single view, or x:container_config, followed by the view
		if (inner_template.length == 1) {

			view_config = this.compileAsView(inner_template);

		} else if (inner_template.length == 2) {

			container_config_directive = inner_template[0];
			view_config = this.compileAsView([inner_template[1]]);

		} else {

			Lava.t("Malformed content of tag with type='container'");

		}

		if (Lava.schema.DEBUG && view_config.container) Lava.t("Wrapped view already has a container");
		container_config = this._toContainer(raw_tag);
		view_config.container = container_config;

		if (container_config_directive) {
			if (Lava.schema.DEBUG && (container_config_directive.type != 'directive' || container_config_directive.name != 'container_config'))
				Lava.t("Malformed content of tag with type='container'");
			Lava.parsers.Directives.processDirective(container_config_directive, view_config, true);
		}

		if (Lava.schema.DEBUG) {

			if ('id' in view_config) Lava.t("Please, move the id attribute from inner view's hash to wrapping container: " + view_config.id);

			if (('static_properties' in container_config) && ('property_bindings' in container_config)) {

				for (name in container_config.property_bindings) {

					if (name in container_config.static_properties)
						Lava.t("Same property can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

			if (('static_styles' in container_config) && ('style_bindings' in container_config)) {

				for (name in container_config.static_styles) {

					if (name in container_config.style_bindings)
						Lava.t("Same style can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) view_config.id = raw_tag.attributes.id;
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in container_config) || ('static_properties' in container_config) || ('static_styles' in container_config)))
				Lava.t("Element container with resource_id: all properties must be moved to resources");
			container_config.resource_id = this.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile tag with x:type="static"
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileStaticContainer: function(result, raw_tag) {

		var name,
			block;

		if (Lava.schema.DEBUG) {

			if (!raw_tag.x.resource_id) Lava.t("Static container requires resource id");
			for (name in raw_tag.x) {
				if (['type', 'resource_id'].indexOf(name) == -1) Lava.t("Unknown control attribute on static container: " + name);
			}

		}

		block = {
			type: 'static_tag',
			resource_id: this.parseResourceId(raw_tag.x.resource_id),
			name: raw_tag.name
		};

		if ('attributes' in raw_tag) Lava.t("Static container with resource_id: all attributes must be moved to resources");

		if (raw_tag.content) {
			block.template = this.compileTemplate(raw_tag.content);
		}

		result.push(block);

	},

	/**
	 * Compile a tag which belongs to widget's sugar. Parse it into tag config using {@link Lava.system.Sugar} class instance
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileSugar: function(result, raw_tag) {

		var schema = Lava.sugar_map[raw_tag.name],
			widget_config,
			sugar,
			result_config;

		if ('parse' in schema) {

			result_config = schema.parse(raw_tag);

		} else {

			widget_config = Lava.getWidgetConfig(schema.widget_title);
			sugar = Lava.getWidgetSugarInstance(schema.widget_title);
			result_config = sugar.parse(widget_config.sugar, raw_tag, schema.widget_title);

		}

		result.push(result_config);

	},

	/**
	 * Compile tag with x:widget="WidgetName". Represents a widget with explicitly defined Element container
	 *
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileWidget: function(result, raw_tag) {

		var config = this.createDefaultWidgetConfig();

		config['extends'] = raw_tag.x.widget;
		config.container = this._toContainer(raw_tag);

		this._parseViewAttributes(config, raw_tag);
		// Otherwise, there will be ambiguity between the target of the attribute (widget or it's container)
		// to set resource_id with x:widget - rewrite the declaration to x:type='container' with <x:widget> inside
		if (Lava.schema.DEBUG && raw_tag.x && ('resource_id' in raw_tag.x)) Lava.t("x:widget attribute is not compatible with resource_id attribute");
		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		result.push(config);

	},

	// End: block handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Assign some attributes of an element to `view_config`
	 * @param {_cView} view_config
	 * @param {_cRawTag} raw_tag
	 */
	_parseViewAttributes: function(view_config, raw_tag) {

		var x = raw_tag.x,
			name;

		if (x) {

			if (Lava.schema.DEBUG) this._assertControlAttributesValid(x);
			if ('options' in x) {

				if (typeof(x.options) != 'object') Lava.t("Malformed x:options");
				view_config.options = x.options;

			}
			if ('label' in x) this.setViewConfigLabel(view_config, x.label);

			if ('class-event' in x) {

				if (Lava.schema.DEBUG && typeof(x['class-event']) != 'object') Lava.t("Malformed x:class-event attribute");

				view_config.class_events = view_config.class_events || {};

				for (name in x['class-event']) {

					view_config.class_events[name] = Lava.ExpressionParser.parse(x['class-event'][name], Lava.ExpressionParser.PRESETS.class_events);

				}

			}

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) this.setViewConfigId(view_config, raw_tag.attributes.id);

	},

	/**
	 * Check validity of control attributes and throw exception, in case they are invalid
	 * @param {_cRawX} x
	 */
	_assertControlAttributesValid: function(x) {

		for (var name in x) {
			if (this._allowed_control_attributes.indexOf(name) == -1) {

                var common_misspellings = {
					'dom-events': 'dom-event',
					'class-events': 'class-event',
                    events: 'dom-event',
                    event: 'dom-event',
                    styles: 'style',
                    class: 'classes',
                    option: 'options'
                };

                Lava.t("Unknown control attribute - 'x:" + name + "'." + ((name in common_misspellings) ? " Did you mean 'x:" + common_misspellings[name] + "'?" : ''));
            }
		}

	},

	/**
	 * Convert raw tag to an Element container config
	 * @param {_cRawTag} raw_tag
	 * @returns {_cElementContainer}
	 */
	_toContainer: function(raw_tag) {

		var container_config = {
				type: 'Element',
				tag_name: raw_tag.name
			};

		if ('attributes' in raw_tag) this._parseContainerStaticAttributes(container_config, raw_tag.attributes);
		if ('x' in raw_tag) this._parseContainerControlAttributes(container_config, raw_tag.x);

		if (raw_tag.name == 'textarea') {

			container_config.type = 'TextArea'

		} else if (raw_tag.name == 'input') {

			var type;
			if (container_config.static_properties && container_config.static_properties.type) {
				type = container_config.static_properties.type.toLower();
			}

			if (type == 'checkbox' /* || type == 'radio' */) {

				container_config.type = 'CheckboxElement';

			} else if (type in this.TEXTLIKE_INPUTS) {

				container_config.type = 'TextInputElement';

			} else {

				container_config.type = 'InputElement';

			}

		}

		return /** @type {_cElementContainer} */ container_config;

	},

	/**
	 * Take raw control attributes, parse them, and store in `container_config`
	 * @param {_cElementContainer} container_config
	 * @param {_cRawX} x
	 */
	_parseContainerControlAttributes: function(container_config, x) {

		var i,
			count,
			name;

		if ('dom-event' in x) {

			if (Lava.schema.DEBUG && typeof(x['dom-event']) != 'object') Lava.t("Malformed x:dom-event attribute");

			container_config.dom_events = {};

			for (name in x['dom-event']) {

				container_config.dom_events[name] = Lava.ExpressionParser.parse(x['dom-event'][name], Lava.ExpressionParser.PRESETS.dom_events);

			}

		}

		// Attribute binding. Example: x:bind:src="<any_valid_expression>"
		if ('bind' in x) {

			if (typeof(x.bind) != 'object') Lava.t("Malformed x:bind attribute");
			container_config.property_bindings = this._parseBindingsHash(x.bind);

		}

		if ('style' in x) {

			if (typeof(x.style) != 'object') Lava.t("Malformed x:style attribute");
			container_config.style_bindings = this._parseBindingsHash(x.style);

		}

		if ('classes' in x) {

			var args = Lava.ExpressionParser.parse(x.classes, Lava.ExpressionParser.PRESETS.expressions),
				class_bindings = {};

			for (i = 0, count = args.length; i < count; i++) {

				class_bindings[i] = args[i];

			}

			container_config.class_bindings = class_bindings;

		}

		if ('container_class' in x) {

			container_config['class'] = x.container_class;

		}

	},

	/**
	 * Parse object as [name] => &lt;expression&gt; pairs
	 *
	 * @param {Object.<string, string>} hash
	 * @returns {Object.<string, _cArgument>}
	 */
	_parseBindingsHash: function(hash) {

		if (typeof(hash) != 'object') Lava.t("Malformed control tag");

		var name,
			args,
			result = {};

		for (name in hash) {

			args = Lava.ExpressionParser.parse(hash[name]);
			if (args.length == 0) Lava.t("Binding: empty expression (" + name + ")");
			if (args.length > 1) Lava.t("Binding: malformed expression for '" + name + "'");
			result[name] = args[0];

		}

		return result;

	},

	/**
	 * Parse style attribute content (plain string) into object with keys being individual style names,
	 * and values being actual style values
	 *
	 * @param {string} styles_string
	 * @returns {Object.<string, string>}
	 */
	parseStyleAttribute: function(styles_string) {

		styles_string = styles_string.trim();

		var styles = styles_string.split(/[\;]+/),
			result = {},
			parts,
			i = 0,
			count = styles.length,
			resultCount = 0;

		if (styles_string) {

			for (; i < count; i++) {

				styles[i] = styles[i].trim();

				if (styles[i]) {

					parts = styles[i].split(':');

					if (parts.length == 2) {

						parts[0] = parts[0].trim();
						parts[1] = parts[1].trim();
						result[parts[0]] = parts[1];
						resultCount++;

					} else {

						Lava.t("Unable to parse the style attribute");

					}

				}

			}

		}

		return resultCount ? result : null;

	},

	/**
	 * Fills the following properties of the container: static_styles, static_classes and static_properties
	 *
	 * @param {_cElementContainer} container_config
	 * @param {Object.<string, string>} raw_attributes
	 */
	_parseContainerStaticAttributes: function(container_config, raw_attributes) {

		var name,
			list,
			static_properties = {};

		for (name in raw_attributes) {

			if (name == 'style') {

				list = this.parseStyleAttribute(raw_attributes.style);
				if (list) container_config.static_styles = list;

			} else if (name == 'class') {

				container_config.static_classes = raw_attributes['class'].trim().split(/\s+/);

			} else if (name == 'id') {

				// skip, as ID is handled separately

			} else {

				static_properties[name] = raw_attributes[name];

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in static_properties) {
			container_config.static_properties = static_properties;
			break;
		}

	},

	/**
	 * Compile raw template config
	 * @param {_tRawTemplate} blocks
	 * @param {_cView} [view_config]
	 * @returns {_tTemplate}
	 */
	compileTemplate: function(blocks, view_config) {

		var current_block,
			result = [],
			type,
			i = 0,
			count = blocks.length,
			x;

		for (; i < count; i++) {

			current_block = blocks[i];
			type = (typeof(current_block) == 'string') ? 'string' : current_block.type;

			if (type == 'tag') {

				x = current_block.x;

				if (x) {

					if ('type' in x) {

						if ('widget' in x) Lava.t("Malformed tag: both x:type and x:widget present");
						type = x.type;
						if (['view', 'container', 'static'].indexOf(type) == -1) Lava.t("Unknown x:type attribute: " + type);

					} else if ('widget' in x) {

						type = 'widget';

					} else if (Lava.sugar_map[current_block.name]) {

						type = 'sugar';

					} else {

						type = 'view';
						Lava.logWarning("Tag with control attributes and no sugar or type on it - was automatically converted to view: " + current_block.name + ". Please, add 'x:type' attribute.");

					}

				} else if (Lava.sugar_map[current_block.name]) {

					type = 'sugar';

				} // else type = 'tag' - default

			}

			this[this._compile_handlers[type]](result, current_block, view_config);

		}

		return result;

	},

	/**
	 * Compile template as usual and assert that it contains single view inside. Return that view
	 *
	 * @param {_tRawTemplate} raw_blocks
	 * @returns {_cView}
	 */
	compileAsView: function(raw_blocks) {

		var result = this.asBlocks(this.compileTemplate(raw_blocks));
		if (result.length != 1) Lava.t("Expected: exactly one view, got either several or none.");
		if (result[0].type != 'view' && result[0].type != 'widget') Lava.t("Expected: view, got: " + result[0].type);
		return result[0];

	},

	/**
	 * Remove strings from template and assert they are empty
	 * @param {(_tRawTemplate|_tTemplate)} template
	 * @returns {Array}
	 */
	asBlocks: function(template) {

		var i = 0,
			count = template.length,
			result = [];

		for (; i < count; i++) {

			if (typeof(template[i]) == 'string') {

				if (!Lava.EMPTY_REGEX.test(template[i])) Lava.t("Text between tags is not allowed in this context. You may want to use a lava-style comment ({* ... *})");

			} else {

				result.push(template[i]);

			}

		}

		return result;

	},

	/**
	 * Extract blocks/tags from template and assert they all have specific type
	 * @param {Array} blocks
	 * @param {string} type
	 * @returns {Array}
	 */
	asBlockType: function(blocks, type) {

		var result = this.asBlocks(blocks),
			i = 0,
			count = result.length;

		for (; i < count; i++) {

			if (result[i].type != type) Lava.t("Block type is not permitted in this context. Expected: " + type + ", got: " + result[i].type);

		}

		return result;

	},

	/**
	 * Convert an object with element's attributes ([name] => &lt;value&gt; pairs) back into plain string
	 *
	 * @param {Object.<string, string>} attributes_object
	 * @returns {string}
	 */
	renderTagAttributes: function(attributes_object) {

		var name,
			result = '';

		for (name in attributes_object) {

			result += ' ' + name + '="' + Firestorm.String.escape(attributes_object[name], Firestorm.String.ATTRIBUTE_ESCAPE_REGEX) + '"';

		}

		return result;

	},

	/**
	 * Parse value of x:resource_id attribute
	 * @param {string} id_string
	 * @returns {_cResourceId}
	 */
	parseResourceId: function(id_string) {

		id_string = id_string.trim();
		var match = this._locator_regex.exec(id_string),
			result;

		if (!match || match[2].indexOf('$') != -1) Lava.t("Malformed resource id: " + id_string);

		/** @type {_cResourceId} */
		result = {
			locator_type: this.locator_types[id_string[0]],
			locator: match[1],
			name: match[2]
		};

		return result;

	},

	/**
	 * Create an empty widget config with default class and extender from schema
	 * @returns {_cWidget}
	 */
	createDefaultWidgetConfig: function() {

		return {
			type: 'widget',
			"class": Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY,
			extender_type: Lava.schema.widget.DEFAULT_EXTENDER
		}

	},

	/**
	 * Turn a serialized and quoted string back into it's JavaScript representation.
	 *
	 * Assume that everything that follows a backslash is a valid escape sequence
	 * (all backslashes are prefixed with another backslash).
	 *
	 * Quotes inside string: lexer's regex will match all escaped quotes
	 *
	 * @param {string} raw_string
	 * @returns {string}
	 */
	unquoteString: function(raw_string) {

		var map = Firestorm.String.quote_escape_map,
			result;

		try {
			result = eval("(" + raw_string.replace(this.UNQUOTE_ESCAPE_REGEX, function(a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + ")");
		} catch (e) {
			Lava.t("Malformed string: " + raw_string);
		}

		return result;

	},

	/**
	 * Converts raw tag node to widget config.
	 * @param {_cRawTag} raw_tag
	 * @returns {_cWidget}
	 */
	toWidget: function(raw_tag) {

		var config = this.createDefaultWidgetConfig();
		config.container = this._toContainer(raw_tag);
		this._parseViewAttributes(config, raw_tag);

		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		return config

	}

};