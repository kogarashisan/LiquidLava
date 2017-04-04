/**
 * All TemplateParser directives
 */
Lava.parsers.Directives = {

	/**
	 * Settings for each directive
	 * @type {Object.<string, Object>}
	 */
	_directives_schema: {

		// view_config_presence:
		//  true, in case the directive is valid only inside view or widget. This automatically means that it should be at top.
		//  false, if it must be outside of view config

		define: {view_config_presence: false},
		define_resources: {view_config_presence: false},
		widget: {},
		static_value: {},
		static_eval: {},
		attach_directives: {},
		assign: {view_config_presence: true, is_top_directive: true},
		roles: {view_config_presence: true, is_top_directive: true},
		container_config: {view_config_presence: true, is_top_directive: true},
		refresher: {view_config_presence: true, is_top_directive: true},
		option: {view_config_presence: true, is_top_directive: true},
		options: {view_config_presence: true, is_top_directive: true},
		// Widget-only directives
		bind: {view_config_presence: true, is_top_directive: true},
		property: {view_config_presence: true, is_top_directive: true},
		properties: {view_config_presence: true, is_top_directive: true},
		property_string: {view_config_presence: true, is_top_directive: true},
		resources: {view_config_presence: true, is_top_directive: true},
		default_events: {view_config_presence: true, is_top_directive: true},
		include: {view_config_presence: true, is_top_directive: true}
	},

	/**
	 * Handlers for tags in widget definition
	 * @type {Object.<string, string>}
	 */
	_widget_tag_actions: {
		// with directive analog
		bind: '_widgetTagBind',
		assign: '_widgetTagAssign',
		option: '_widgetTagOption',
		property: '_widgetTagProperty',
		options: '_widgetTagOptions',
		properties: '_widgetTagProperties',
		roles: '_widgetTagRoles',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents',
		include: '_widgetTagInclude',
		// without directive analog
		sugar: '_widgetTagSugar',
		storage: '_widgetTagStorage',
		storage_schema: '_widgetTagStorageSchema'
	},

	/**
	 * Handlers for tags inside x:resources
	 * @type {Object.<string, string>}
	 */
	_resource_tag_actions: {
		options: '_resourceTagOptions',
		container: '_resourceTagContainer',
		string: '_resourceTagString',
		plural_string: '_resourceTagPluralString'
	},

	/**
	 * Allowed properties on config of &lt;view&gt; in widget definition
	 * @type {Array.<string>}
	 */
	WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS: ['template', 'container', 'class', 'type'],

	/**
	 * The title of the widget in x:define directive, which is currently being processed
	 * @type {string}
	 */
	_current_widget_title: null,
	/**
	 * Stack of widget configs, which are currently being processed by x:widget/x:define directives
	 * @type {Array.<_cWidget>}
	 */
	_widget_directives_stack: [],

	/**
	 * Handle directive tag
	 * @param {_cRawDirective} raw_directive Raw directive tag
	 * @param {(_cView|_cWidget)} view_config Config of the directive's parent view
	 * @param {boolean} is_top_directive Code style validation switch. Some directives must be at the top of templates
	 * @returns {*} Compiled template item or nothing
	 */
	processDirective: function(raw_directive, view_config, is_top_directive) {

		var directive_name = raw_directive.name,
			config = this._directives_schema[directive_name];

		if (!config) Lava.t("Unknown directive: " + directive_name);

		if (config.view_config_presence) {
			if (view_config && !config.view_config_presence) Lava.t('Directive must not be inside view definition: ' + directive_name);
			if (!view_config && config.view_config_presence) Lava.t('Directive must be inside view definition: ' + directive_name);
		}

		if (config.is_top_directive && !is_top_directive) Lava.t("Directive must be at the top of the block content: " + directive_name);

		return this['_x' + directive_name](raw_directive, view_config);

	},

	/**
	 * Helper method to copy properties from `source` to `destination`, if they exist
	 * @param {Object} destination
	 * @param {Object} source
	 * @param {Array.<string>} name_list List of properties to copy from `source` to `destination`
	 */
	_importVars: function(destination, source, name_list) {
		for (var i = 0, count = name_list.length; i < count; i++) {
			var name = name_list[i];
			if (name in source) destination[name] = source[name];
		}
	},

	/**
	 * Returns true when a directive with given name exists.
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasDirective: function(name) {

		return name in this._directives_schema;

	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagBind: function(raw_tag, widget_config) {

		this._parseBinding(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cView#assigns}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagAssign: function(raw_tag, widget_config) {

		this._parseAssign(widget_config, raw_tag);

	},

	/**
	 * Parse one option for {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOption: function(raw_tag, widget_config) {

		this._parseOption(widget_config, raw_tag, 'options');

	},

	/**
	 * Parse one property for {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperty: function(raw_tag, widget_config) {

		this._parseProperty(widget_config, raw_tag, 'properties');

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOptions: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'options', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#storage_schema}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorageSchema: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'storage_schema', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperties: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'properties', raw_tag);

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagRoles: function(raw_tag, widget_config) {

		this._parseRoles(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cWidget#sugar}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagSugar: function(raw_tag, widget_config) {

		if ('sugar' in widget_config) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		widget_config.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cWidget#storage}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorage: function(raw_tag, widget_config) {

		Lava.parsers.Storage.parse(widget_config, raw_tag.content);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagDefaultEvents: function(raw_tag, widget_config) {

		this._parseDefaultEvents(raw_tag, widget_config);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagResources: function(raw_tag, widget_config) {

		this._xresources(raw_tag, widget_config);

	},

	/**
	 * Parse one include for {_cWidget#includes}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagInclude: function(raw_tag, widget_config) {

		var include = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];
		Lava.store(widget_config, 'includes', raw_tag.attributes.name, include);

	},

	// end: actions for widget tags
	////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Start: resource tags

	/**
	 * Parse x:resources definition
	 * @param {_cRawTag} raw_tag
	 * @param {string} widget_title
	 * @returns {Object}
	 */
	_parseResources: function(raw_tag, widget_title) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			resources = {},
			tag,
			value;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Empty resources definition");

		for (; i < count; i++) {

			tag = tags[i];
			if (Lava.schema.DEBUG && (!tag.attributes || !tag.attributes.path)) Lava.t("resources, tag is missing attributes: " + tag.name);
			if (Lava.schema.DEBUG && !(tag.name in this._resource_tag_actions)) Lava.t("resources, unknown tag: " + tag.name);
			value = this[this._resource_tag_actions[tag.name]](tag);
			if (Lava.schema.parsers.EXPORT_STRINGS && (value.type == 'string' || value.type == 'plural_string')) {
				Lava.resources.exportTranslatableString(value, widget_title, raw_tag.attributes.locale, tag.attributes.path);
			}
			Lava.resources.putResourceValue(resources, tag.attributes.path, value);

		}

		return resources;

	},

	/**
	 * Parse resource value as any JavaScript type, including arrays, objects and literals
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagOptions: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources options tag");

		return {
			type: 'options',
			value: Lava.parseOptions(raw_tag.content[0])
		};

	},

	/**
	 * Parse a translatable string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagString: function(raw_tag) {

		if (Lava.schema.DEBUG && raw_tag.content && raw_tag.content.length != 1) Lava.t("Malformed resources string tag");

		var result = {
			type: 'string',
			value: raw_tag.content ? raw_tag.content[0].trim() : ''
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse translatable plural string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagPluralString: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content)) Lava.t("Malformed resources plural string tag");

		var plural_tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = plural_tags.length,
			plurals = [],
			result;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Malformed resources plural string definition");

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && (plural_tags[i].name != 'string' || !plural_tags[i].content || !plural_tags[i].content[0])) Lava.t("Resources, malformed plural string");
			plurals.push(plural_tags[i].content[0].trim());

		}

		result = {
			type: 'plural_string',
			value: plurals
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse inheritable actions for classes, styles and container properties
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagContainer: function(raw_tag) {

		var tags = raw_tag.content ? Lava.parsers.Common.asBlockType(raw_tag.content, 'tag') : [],
			count = tags.length,
			result = {
				type: 'container_stack',
				value: []
			},
			operations_stack = result.value,
			operation_value,
			used_instructions = {},
			name;

		if (count) {

			if (Lava.schema.DEBUG) {
				if (count > 1) Lava.t("Malformed resources/container definition");
				if (tags[0].name != 'static_properties' && tags[0].name != 'add_properties') Lava.t("Malformed resources/container definition");
				if (!tags[0].attributes || tags[0].content) Lava.t("resources/container: malformed (static/add)_properties tag");
				if (('class' in tags[0].attributes) || ('style' in tags[0].attributes)) Lava.t("resources/container: class and style attributes must be defined separately from properties");
			}

			operations_stack.push({
				name: tags[0].name,
				value: tags[0].attributes
			});
			used_instructions[tags[0].name] = true;

		}

		for (name in raw_tag.attributes) {

			switch (name) {
				case 'remove_classes':
				case 'remove_properties':
				case 'remove_styles':
					if (Lava.schema.DEBUG && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty remove_* attributes from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s*,\s*/);
					break;
				case 'add_classes':
				case 'static_classes':
					if (Lava.schema.DEBUG && name == 'add_classes' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty add_classes attribute from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s+/);
					break;
				case 'add_styles':
				case 'static_styles':
					if (Lava.schema.DEBUG && name == 'add_styles' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty style attribute from resources/container tag");
					operation_value = Lava.parsers.Common.parseStyleAttribute(raw_tag.attributes[name]);
					break;
				case 'path': // the path and name of the resource
					operation_value = null;
					break;
				default:
					Lava.t("Unknown resources/container attribute:" + name);
			}

			if (operation_value) {
				operations_stack.push({
					name: name,
					value: operation_value
				});
				used_instructions[name] = true;
			}

		}

		if (Lava.schema.DEBUG) {

			if (
				('static_styles' in used_instructions && (('add_styles' in used_instructions) || ('remove_styles' in used_instructions)))
				|| ('static_classes' in used_instructions && (('add_classes' in used_instructions) || ('remove_classes' in used_instructions)))
				|| ('static_properties' in used_instructions && (('add_properties' in used_instructions) || ('remove_properties' in used_instructions)))
			)
				Lava.t("resources/container: having add/remove instructions together with 'set' instruction has no sense");

			if (operations_stack.length == 0) Lava.t("Empty resources/container definition");

		}

		return result;

	},

	// End: resource tags
	////////////////////////////////////////////////////////////////////

	/**
	 * Parse view widget tag: compile, extract and validate a single view inside it
	 * @param {_cRawTag} raw_tag
	 */
	_asMainView: function(raw_tag) {

		var view_config = Lava.parsers.Common.compileAsView(raw_tag.content),
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			name;

		if (Lava.schema.DEBUG) {
			if (view_config['class'] != 'View') Lava.t("define: view in <view> must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			for (name in view_config) {
				if (this.WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS.indexOf(name) == -1) {
					Lava.t("<view>: view has an option, which can not be copied to widget: " + name + ". Probably, it must be specified via separate tag");
				}
			}
		}

		this._importVars(widget_config, view_config, ['template', 'container']);

		return widget_config;

	},

	/**
	 * Parse x:view and x:widget directives
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinition: function(raw_directive) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("Widget definition is missing attributes");

		var tags = raw_directive.content ? Lava.parsers.Common.asBlockType(raw_directive.content, 'tag') : [],
			widget_config = {},
			i = 0,
			count = tags.length,
			tag,
			name,
			path,
			is_storage_parsed = false;

		this._widget_directives_stack.push(raw_directive);

		if (count) {

			if (tags[0].name == 'view') {

				widget_config = this._asMainView(tags[0]);
				i = 1;

			} else if (tags[0].name == 'template') {

				widget_config.template = Lava.parsers.Common.compileTemplate(tags[0].content);
				i = 1;

			}

		}

		// extends must be set before <storage> (required by Lava.parsers.Storage.getMergedStorageSchema())
		if (raw_directive.attributes['extends']) widget_config['extends'] = raw_directive.attributes['extends'];

		for (; i < count; i++) {

			tag = tags[i];
			if (tag.name == 'storage_schema' && is_storage_parsed) Lava.t('Widget definition: `storage_schema` must preceed the `storage` tag');
			if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Note, that <template> and <view> tags must be on top.");
			this[this._widget_tag_actions[tag.name]](tag, widget_config);
			if (tag.name == 'storage') is_storage_parsed = true;

		}

		if (raw_directive.attributes.controller) {

			path = raw_directive.attributes.controller;
			// example: "$widgetname/ClassName1"
			if (path[0] in Lava.parsers.Common.locator_types) {

				i = path.indexOf('/');
				if (Lava.schema.DEBUG && i == -1) Lava.t("Malformed class name locator: " + path);
				name = path.substr(0, i); // cut the locator part, "$widgetname"
				widget_config.real_class = path.substr(i); // leave the name part: "/ClassName1"
				widget_config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
				if (Lava.schema.DEBUG && (!widget_config.class_locator.name || !widget_config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + path);

			} else {

				widget_config.real_class = raw_directive.attributes.controller;

			}

		}

		if (raw_directive.attributes.label) Lava.parsers.Common.setViewConfigLabel(widget_config, raw_directive.attributes.label);
		if (raw_directive.attributes.id) {
			if (Lava.schema.DEBUG && widget_config.id) Lava.t("[Widget configuration] widget id was already set via main view configuration: " + raw_directive.attributes.id);
			Lava.parsers.Common.setViewConfigId(widget_config, raw_directive.attributes.id);
		}

		if (!widget_config['class']) widget_config['class'] = Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY;
		if (!widget_config.extender_type) widget_config.extender_type = Lava.schema.widget.DEFAULT_EXTENDER;

		this._widget_directives_stack.pop();

		return widget_config;

	},

	/**
	 * Define a widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine: function(raw_directive) {

		if (Lava.schema.DEBUG) {
			if (!raw_directive.attributes || !raw_directive.attributes.title) Lava.t("define: missing 'title' attribute");
			if (raw_directive.attributes.title.indexOf(' ') != -1) Lava.t("Widget title must not contain spaces");
			if ('resource_id' in raw_directive.attributes) Lava.t("resource_id is not allowed on define");
			if (this._current_widget_title) Lava.t("Nested defines are not allowed: " + raw_directive.attributes.title);
		}

		this._current_widget_title = raw_directive.attributes.title;
		var widget_config = this._parseWidgetDefinition(raw_directive);
		this._current_widget_title = null;
		widget_config.is_extended = false; // reserve it for serialization

		if (Lava.schema.DEBUG && ('class_locator' in widget_config)) Lava.t("Dynamic class names are allowed only in inline widgets, not in x:define");

		Lava.storeWidgetSchema(raw_directive.attributes.title, widget_config);

	},

	/**
	 * Inline widget definition
	 * @param {_cRawDirective} raw_directive
	 */
	_xwidget: function(raw_directive) {

		var widget_config = this._parseWidgetDefinition(raw_directive);

		if (Lava.schema.DEBUG && ('sugar' in widget_config)) Lava.t("Inline widgets must not have sugar");
		if (Lava.schema.DEBUG && !widget_config['class'] && !widget_config['extends']) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
		if (raw_directive.attributes.resource_id) widget_config.resource_id = Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id);

		widget_config.type = 'widget';
		return widget_config;

	},

	/**
	 * Parse an assign config for {@link _cView#assigns}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xassign: function(raw_directive, view_config) {

		this._parseAssign(view_config, raw_directive);

	},

	/**
	 * Perform parsing an assign from {@link _cView#assigns}
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseAssign: function(config, raw_tag) {

		if (!('assigns' in config)) config.assigns = {};

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("assign: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed assign");
		if (raw_tag.attributes.name in config.assigns) Lava.t("Duplicate assign: " + raw_tag.attributes.name);

		var args = Lava.ExpressionParser.parse(raw_tag.content[0]);
		if (Lava.schema.DEBUG && args.length != 1) Lava.t("Expression block requires exactly one argument");

		if (raw_tag.attributes.once && Firestorm.Types.Boolean.fromString(raw_tag.attributes.once)) {

			args[0].once = true;

		}

		config.assigns[raw_tag.attributes.name] = args[0];

	},

	/**
	 * Parse an option for {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xoption: function(raw_directive, view_config) {

		this._parseOption(view_config, raw_directive, 'options');

	},

	/**
	 * Perform parsing of a tag with serialized JavaScript object inside it
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseOption: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);

		var option_type = raw_tag.attributes.type,
			result;

		if (option_type) {

			if (option_type == 'targets') {

				result = Lava.parsers.Common.parseEventHandlers(raw_tag.content[0]);

			} else if (option_type == 'expressions') {

				result = Lava.ExpressionParser.parse(raw_tag.content[0], Lava.ExpressionParser.SEPARATORS.SEMICOLON);

			} else {

				Lava.t("Unknown option type: " + option_type);

			}

		} else {

			result = Lava.parseOptions(raw_tag.content[0]);

		}

		Lava.store(config, config_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * Perform parsing a property from {@link _cWidget#properties}
	 * @param {_cWidget} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseProperty: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		Lava.store(config, config_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xroles: function(raw_directive, view_config) {

		this._parseRoles(view_config, raw_directive);

	},

	/**
	 * Perform parsing a role from {@link _cView#roles}
	 * @param {(_cView|_cWidget)} config
	 * @param {_cRawTag} raw_tag
	 */
	_parseRoles: function(config, raw_tag) {

		if ('roles' in config) Lava.t("Roles are already defined");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed roles tag/directive");
		config.roles = Lava.parsers.Common.parseEventHandlers(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#container}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xcontainer_config: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length == 0)) Lava.t("Malformed container_config directive: content is missing");
		if (Lava.schema.DEBUG && !view_config.container) Lava.t("Trying to change container settings for container-less view. Please, change the view opening tag (# => $) or move the directive into wrapping container.");

		var original_config = view_config.container,
			config = Lava.parseOptions(raw_directive.content[0]),
			name;

		if (Lava.schema.DEBUG) {
			for (name in config) {
				if (['type', 'options'].indexOf(name) == -1) Lava.t('[_xcontainer_config] setting config property is not allowed: ' + name);
			}
		}

		if ('type' in config) original_config['type'] = config['type'];
		if ('options' in config) {
			if (!('options' in original_config)) original_config.options = {};
			Firestorm.extend(original_config.options, config.options);
		}

	},

	/**
	 * Parse {@link _cView#refresher}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xrefresher: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && view_config.type == 'widget') Lava.t("Wrong usage of x:refresher directive. May be applied only to views.");
		if (Lava.schema.DEBUG && ('refresher' in view_config)) Lava.t("Refresher is already defined");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed refresher config: no content");
		view_config.refresher = Lava.parseOptions(raw_directive.content[0]);

	},

	/**
	 * Perform parsing {@link _cWidget#bindings}
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBinding: function(widget_config, raw_element) {

		if (raw_element.content.length != 1) Lava.t("Malformed binding in widget definition: " + raw_element.attributes.name);

		var binding = {
			property_name: raw_element.attributes.name,
			path_config: Lava.ExpressionParser.parseScopeEval(raw_element.content[0])
		};
		if ('from_widget' in raw_element.attributes) {
			if (Lava.schema.DEBUG && ['', '1', 'true'].indexOf(raw_element.attributes['from_widget']) == -1) Lava.t('binding: invalid from_widget attribute');
			binding.from_widget = true;
		}
		Lava.store(widget_config, 'bindings', raw_element.attributes.name, binding);

	},

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbind: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Binding directive requires a widget");
		this._parseBinding(widget_config, raw_directive);

	},

	/**
	 * Parse a tag with JavaScript object inside
	 * @param {(_cView|_cWidget)} config
	 * @param {string} name
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseObject: function(config, name, raw_tag) {

		if (Lava.schema.DEBUG && (name in config)) Lava.t("Object already exists: " + name + ". Ensure, that x:options and x:properties directives appear before x:option and x:property.");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed directive or tag for config property: " + name);
		config[name] = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} config
	 */
	_xoptions: function(raw_directive, config) {

		this._parseObject(config, 'options', raw_directive);

	},

	/**
	 * Parse a property for {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseProperty(widget_config, raw_directive, 'properties');

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperties: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseObject(widget_config, 'properties', raw_directive);

	},

	/**
	 * Helper method for widget directives
	 * @param {_cWidget} widget_config
	 * @param {_cRawDirective} raw_directive
	 * @param {string} config_property_name
	 */
	_storeDirectiveContent: function(widget_config, raw_directive, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed property: " + raw_directive.attributes.name);
		Lava.store(widget_config, config_property_name, raw_directive.attributes.name, raw_directive.content[0]);

	},

	/**
	 * Parse a property for {@link _cWidget#properties} as a string
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty_string: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("property_string directive requires a widget");

		this._storeDirectiveContent(widget_config, raw_directive, 'properties');

	},

	/**
	 * Store a string as an option value
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xoption_string: function(raw_directive, widget_config) {

		this._storeDirectiveContent(widget_config, raw_directive, 'options');

	},

	/**
	 * Standalone resources definition for global widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine_resources: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'] || !raw_directive.attributes['for']))
			Lava.t("Malformed x:resources definition. 'locale' and 'for' are required");

		Lava.resources.addWidgetResource(
			raw_directive.attributes['for'],
			raw_directive.attributes['locale'],
			this._parseResources(raw_directive, raw_directive.attributes['for'])
		);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {(_cRawDirective|_cRawTag)} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xresources: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'])) Lava.t("Malformed resources definition, missing locale");

		if (!widget_config.resources) {
			widget_config.resources = {}
		}

		if (Lava.schema.DEBUG && (raw_directive.attributes['locale'] in widget_config.resources))
			Lava.t("Locale is already defined: " + raw_directive.attributes['locale']);

		widget_config.resources[raw_directive.attributes['locale']] = this._parseResources(raw_directive, this._current_widget_title);

	},

	/**
	 * Parse {@link _cStaticValue}
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_value: function(raw_directive) {

		if (Lava.schema.DEBUG && (raw_directive.content || !raw_directive.attributes || !raw_directive.attributes.resource_id))
			Lava.t("Malformed static_value directive. Note: content inside directive is not allowed, even if it's blank space.");

		return {
			type: 'static_value',
			resource_id: Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id)
		}

	},

	/**
	 * Parse {@link _cStaticEval}.
	 * Warning! Inner argument should depend only on static data.
	 * Bindings are allowed, but not recommended, cause at the moment when template is rendered - they may be dirty
	 *
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_eval: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1))
			Lava.t('Malformed static_eval directive. No content.');

		var args = Lava.ExpressionParser.parse(raw_directive.content[0]);

		if (Lava.schema.DEBUG && args.length == 0) Lava.t("static_eval: malformed argument");

		return {
			type: 'static_eval',
			argument: args[0]
		}

	},

	/**
	 * Wrapper, used to apply directives to a void tag
	 * @param {_cRawDirective} raw_directive
	 */
	_xattach_directives: function(raw_directive) {

		if (Lava.schema.DEBUG && !raw_directive.content) Lava.t("empty attach_directives");

		var blocks = Lava.parsers.Common.asBlocks(raw_directive.content),
			sugar = blocks[0],
			directives = blocks.slice(1),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (sugar.type != 'tag' || sugar.content || directives.length == 0) Lava.t("Malformed attach_directives");
			for (i = 0, count = directives.length; i < count; i++) {
				if (directives[i].type != 'directive') Lava.t("Malformed attach_directives");
			}
		}

		sugar.content = directives;
		return Lava.parsers.Common.compileAsView([sugar]);

	},

	/**
	 * Perform parsing of {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseDefaultEvents: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.content || !raw_tag.content.length)) Lava.t('default_events: no content.');
		if (Lava.schema.DEBUG && ('default_events' in widget_config)) Lava.t('default_events: property already defined');

		var events = Lava.parseOptions(raw_tag.content[0]),
			i = 0,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(events)) Lava.t('default_events: array expected');
			for (count = events.length; i < count; i++) {
				if (typeof(events[i]) != 'string') Lava.t('default_events: expected array of strings');
			}
		}

		widget_config.default_events = Lava.excludeDefaultEvents(events);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xdefault_events: function(raw_directive, widget_config) {

		this._parseDefaultEvents(raw_directive, widget_config);

	},

	/**
	 * Parse an include into {@link _cWidget#includes}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xinclude: function(raw_directive, widget_config) {

		if (!Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes.name)) Lava.t("Malformed x:include directive: 'name' attribute missing.");
		var include = raw_directive.content ? Lava.parsers.Common.compileTemplate(raw_directive.content) : [];
		Lava.store(widget_config, 'includes', raw_directive.attributes.name, include);

	}

};