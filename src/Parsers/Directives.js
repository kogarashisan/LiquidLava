
Lava.parsers.Directives = {

	_directives_schema: {
		define: {view_config_presence: false},
		widget: {},
		assign: {view_config_presence: true, is_top_directive: true},
		roles: {view_config_presence: true, is_top_directive: true},
		container_config: {view_config_presence: true, is_top_directive: true},
		refresher: {view_config_presence: true, is_top_directive: true},
		option: {view_config_presence: true, is_top_directive: true},
		options: {view_config_presence: true, is_top_directive: true},
		// Widget-only directives
		broadcast: {view_config_presence: true, is_top_directive: true},
		bind: {view_config_presence: true, is_top_directive: true},
		property: {view_config_presence: true, is_top_directive: true},
		properties: {view_config_presence: true, is_top_directive: true},
		property_string: {view_config_presence: true, is_top_directive: true},
		resources: {view_config_presence: true, is_top_directive: true},
		define_resources: {view_config_presence: false},
		static_value: {},
		static_eval: {},
		attach_directives: {},
		default_events: {view_config_presence: true, is_top_directive: true}
	},

	_widget_role_actions: {
		main: '_widgetRoleMain',
		//storage: '_widgetRoleStorage',
		include: '_widgetRoleInclude'
	},

	_widget_tag_actions: {
		bind: '_widgetTagBind',
		assign: '_widgetTagAssign',
		option: '_widgetTagOption',
		property: '_widgetTagProperty',
		options: '_widgetTagOptions',
		properties: '_widgetTagProperties',
		roles: '_widgetTagRoles',
		sugar: '_widgetTagSugar',
		broadcast: '_widgetTagBroadcast',
		storage: '_widgetTagStorage',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents'
	},

	_resource_tag_actions: {
		string: '_resourceTagString',
		number: '_resourceTagNumber',
		boolean: '_resourceTagBoolean',
		array: '_resourceTagArray',
		container: '_resourceTagContainer',
		translate: '_resourceTagTranslate',
		ntranslate: '_resourceTagTranslatePlural'
	},

	RESOURCE_ARRAY_ALLOWED_TYPES: ['string', 'boolean', 'null', 'number'],

	/**
	 * To prevent nested defines
	 */
	_is_processing_define: false,
	_current_widget_title: null, // the title of the widget in x:define directive, which is currently being processed

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} view_config
	 * @param {boolean} is_top_directive
	 * @returns {*}
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

	_store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in '" + storage_name + "': " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags and tag roles

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetRoleMain: function(raw_tag, config_storage, roles_storage) {

		if ('widget_config' in roles_storage) Lava.t("multiple tags with role=main in widget definition");

		var view_config,
			name,
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig();

		if (raw_tag.name == 'template') {

			widget_config.template = Lava.parsers.Common.compileTemplate(raw_tag.content);

		} else if (raw_tag.name == 'view') {

			view_config = Lava.parsers.Common.compileAsView(raw_tag.content);
			if (view_config.class != 'View') Lava.t("define: view in 'main' role must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			if ('roles' in view_config) Lava.t("Widget definition: move the roles from main view to widget");

			widget_config.template = view_config.template;

			if ('container' in view_config) widget_config.container = view_config.container;
			if ('assigns' in view_config) widget_config.assigns = view_config.assigns;
			if ('options' in view_config) widget_config.options = view_config.options;

			if (Lava.schema.DEBUG) {
				for (name in view_config) {
					if (['assigns', 'options', 'class', 'type', 'template', 'container'].indexOf(name) == -1) {
						Lava.t("[role='main'] view has an option, which can not be copied to widget: " + name
							+ ". Probably, it must be specified via separate tag");
					}
				}
			}

		} else {

			Lava.t("Widget definition: role=main may be applied to templates and views only");

		}

		roles_storage.widget_config = widget_config;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetRoleInclude: function(raw_tag, config_storage, roles_storage) {

		var include;

		switch (raw_tag.name) {
			case 'template':
				include = Lava.parsers.Common.compileTemplate(raw_tag.content);
				break;
			case 'view':
				include = [Lava.parsers.Common.compileAsView(raw_tag.content)];
				break;
			default:
				Lava.t("Only templates and views may have role=include");
		}

		this._store(config_storage, 'includes', raw_tag.attributes.name, include);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagBind: function(raw_tag, config_storage, roles_storage) {

		this._parseBinding(config_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagAssign: function(raw_tag, config_storage, roles_storage) {

		this._parseAssign(roles_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagOption: function(raw_tag, config_storage, roles_storage) {

		this._parseOption(roles_storage, raw_tag, 'options');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagProperty: function(raw_tag, config_storage, roles_storage) {

		this._parseProperty(config_storage, raw_tag, 'properties');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagOptions: function(raw_tag, config_storage, roles_storage) {

		this._parseObject(config_storage, 'options', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagProperties: function(raw_tag, config_storage, roles_storage) {

		this._parseObject(config_storage, 'properties', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagRoles: function(raw_tag, config_storage, roles_storage) {

		this._parseRoles(roles_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagSugar: function(raw_tag, config_storage, roles_storage) {

		if ('sugar' in config_storage) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		config_storage.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagBroadcast: function(raw_tag, config_storage, roles_storage) {

		this._parseBroadcast(config_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagStorage: function(raw_tag, config_storage, roles_storage) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			tag,
			type,
			schema,
			inner_tags,
			name,
			parse_target;

		for (; i < count; i++) {

			tag = tags[i];

			if (Lava.schema.DEBUG) {
				if (!tag.attributes || !tag.attributes.name) Lava.t("<" + "storage>: tag without a name attribute");
				if (config_storage.storage && (tag.attributes.name in config_storage.storage)) Lava.t("Duplicate item in storage: " + tag.attributes.name);
			}

			type = tag.name;
			schema = {};
			name = tag.attributes['name'];

			if (type == 'template_collection' || type == 'template_hash') {

				schema = {type: type, tag_name: 'template', name: name};
				parse_target = tag;

			} else if (type == 'object' || type == 'object_collection' || type == 'object_hash') {

				inner_tags = Lava.parsers.Common.asBlockType(tag.content, 'tag');
				if (Lava.schema.DEBUG && (inner_tags.length != 2 || !inner_tags[0].content || !inner_tags[1].content)) Lava.t("storage: malformed tag");
				if (Lava.schema.DEBUG && (inner_tags[0].name != 'schema' || inner_tags[1].name != 'content')) Lava.t("storage: malformed tag");
				schema = Lava.parseOptions(inner_tags[0].content[0]);
				if (Lava.schema.DEBUG && (('name' in schema) || ('type' in schema))) Lava.t("storage tag schema: 'name' and 'type' are not allowed");
				schema.name = name;
				schema.type = type;

				parse_target = inner_tags[1];

			} else {

				Lava.t("Unknown storage tag: " + type);

			}

			Lava.getSugarInstance(Lava.schema.widget.DEFAULT_SUGAR_CLASS).parseStorageTag(schema, parse_target, config_storage);

		}

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagDefaultEvents: function(raw_tag, config_storage, roles_storage) {

		this._parseDefaultEvents(raw_tag, config_storage);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagResources: function(raw_tag, config_storage, roles_storage) {

		this._xresources(raw_tag, config_storage);

	},

	// end: actions for widget tags and tag roles
	////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Start: resource tags

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
			if (Lava.schema.parsers.EXPORT_STRINGS && (value.type == 'translate' || value.type == 'ntranslate')) {
				Lava.resources.exportTranslatableString(value, widget_title, raw_tag.attributes.locale, tag.attributes.path);
			}
			Lava.resources.putResourceValue(resources, tag.attributes.path, value);

		}

		return resources;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagString: function(raw_tag) {

		var value = '';

		if (raw_tag.content) {

			if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed resources string tag");
			value = raw_tag.content[0];

		}

		return {
			type: 'string',
			value: value
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagNumber: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		return {
			type: 'number',
			value: +raw_tag.content[0]
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagBoolean: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		return {
			type: 'boolean',
			value: Lava.types.Boolean.fromString(raw_tag.content[0])
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagArray: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		var value = Lava.parseOptions(raw_tag.content[0]),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(value)) Lava.t("Malformed resources array tag content");
			for (i = 0, count = value.length; i < count; i++) {
				if (this.RESOURCE_ARRAY_ALLOWED_TYPES.indexOf(Lava.getType(value[i])) == -1) Lava.t("resources/array contains value type that is not allowed: " + Lava.getType(value[i]));
			}
		}

		return {
			type: 'array',
			value: value
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagTranslate: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		var result = {
			type: 'translate',
			value: raw_tag.content[0]
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;
		if (raw_tag.attributes.context) result.context = raw_tag.attributes.context;

		return result;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagTranslatePlural: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content)) Lava.t("Malformed resources tag");

		var plural_tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = plural_tags.length,
			plurals = [],
			result;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Malformed resources plural string definition");

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && (!plural_tags[i].content || !plural_tags[i].content[0])) Lava.t("Resources, malformed plural string");
			plurals.push(plural_tags[i].content[0]);

		}

		result = {
			type: 'ntranslate',
			value: plurals
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;
		if (raw_tag.attributes.context) result.context = raw_tag.attributes.context;

		return result;

	},

	/**
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
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinition: function(raw_directive) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("Widget definition is missing attributes");

		var tags = raw_directive.content ? Lava.parsers.Common.asBlockType(raw_directive.content, 'tag') : [],
			config_storage = {},
			roles_storage = {},
			widget_config,
			i = 0,
			count = tags.length,
			tag,
			name,
			path;

		for (; i < count; i++) {

			tag = tags[i];

			if (('attributes' in tag) && tag.attributes.role) {

				if (!(tag.attributes.role in this._widget_role_actions)) Lava.t("Unknown role in widget definition: " + tag.attributes.role);
				this[this._widget_role_actions[tag.attributes.role]](tag, config_storage, roles_storage);

			} else {

				if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Maybe missing the 'role' attribute.");
				this[this._widget_tag_actions[tag.name]](tag, config_storage, roles_storage);

			}

		}

		if ('widget_config' in roles_storage) {

			widget_config = roles_storage.widget_config;
			Firestorm.extend(widget_config, config_storage);

		} else {

			widget_config = config_storage;

		}

		if ('roles' in roles_storage) widget_config.roles = roles_storage.roles;
		if (raw_directive.attributes.controller) {

			path = raw_directive.attributes.controller;
			// example: "$widgetname/ClassName1/ClassName2"
			if (path[0] in Lava.parsers.Common.locator_types) {

				i = path.indexOf('/');
				if (Lava.schema.DEBUG && i == -1) Lava.t("Malformed class name locator: " + path);
				name = path.substr(0, i); // cut the locator part, "$widgetname"
				widget_config.real_class = path.substr(i); // leave the name part: "/ClassName1/ClassName2"
				widget_config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
				if (Lava.schema.DEBUG && (!widget_config.class_locator.name || !widget_config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + path);

			} else {

				widget_config.real_class = raw_directive.attributes.controller;

			}

		}

		if (raw_directive.attributes.extends) widget_config.extends = raw_directive.attributes.extends;
		if (raw_directive.attributes.label) Lava.parsers.Common.setViewConfigLabel(widget_config, raw_directive.attributes.label);

		if (raw_directive.attributes.id) {
			if (Lava.schema.DEBUG && widget_config.id) Lava.t("[Widget configuration] widget id was already set via main view configuration: " + raw_directive.attributes.id);
			Lava.parsers.Common.setViewConfigId(widget_config, raw_directive.attributes.id);
		}

		if ('options' in roles_storage) {

			if ('options' in widget_config) {

				for (name in roles_storage.options) {

					if (name in widget_config.options) Lava.t("Duplicate option: " + name);
					widget_config.options[name] = roles_storage.options[name];

				}

			} else {

				widget_config.options = roles_storage.options;

			}

		}

		if ('assigns' in roles_storage) {
			if ('assigns' in widget_config) Lava.t("Please, move assigns to one place: either to widget tag, or view directives");
			widget_config.assigns = roles_storage.assigns;
		}

		if (!widget_config.class) widget_config.class = Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY;
		if (!widget_config.extender_type) widget_config.extender_type = Lava.schema.widget.DEFAULT_EXTENDER;

		return widget_config;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinitionWrapper: function(raw_directive) {

		if (this._is_processing_define) Lava.t("Nested defines are not allowed");
		this._is_processing_define = true;
		var result;

		// need to ensure that _is_processing_define flag stays off,
		// cause in case of exception, parser will be left in unusable state
		try {

			result = this._parseWidgetDefinition(raw_directive);

		} finally {

			this._is_processing_define = false;

		}

		return result;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes.title)) Lava.t("define: missing 'title' attribute");
		if (Lava.schema.DEBUG && raw_directive.attributes.title.indexOf(' ') != -1) Lava.t("Widget title must not contain spaces");
		if (Lava.schema.DEBUG && ('resource_id' in raw_directive.attributes)) Lava.t("resource_id is not allowed on define");

		this._current_widget_title = raw_directive.attributes.title;
		var widget_config = this._parseWidgetDefinitionWrapper(raw_directive);
		this._current_widget_title = null;
		widget_config.is_extended = false; // reserve it for serialization

		if (Lava.schema.DEBUG && ('class_locator' in widget_config)) Lava.t("Dynamic class names are allowed only in inline widgets, not in x:define");

		Lava.storeWidgetSchema(raw_directive.attributes.title, widget_config);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xwidget: function(raw_directive) {

		var widget_config = this._parseWidgetDefinition(raw_directive);

		if (Lava.schema.DEBUG && !widget_config.class && !widget_config.extends) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
		if (raw_directive.attributes.resource_id) widget_config.resource_id = Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id);

		widget_config.type = 'widget';
		return widget_config;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xassign: function(raw_directive, view_config) {

		this._parseAssign(view_config, raw_directive);

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseAssign: function(storage, raw_tag) {

		if (!('assigns' in storage)) storage.assigns = {};

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("assign: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed assign");
		if (raw_tag.attributes.name in storage.assigns) Lava.t("Duplicate assign: " + raw_tag.attributes.name);

		var arguments = Lava.ExpressionParser.parse(raw_tag.content[0]);
		if (Lava.schema.DEBUG && arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		if (raw_tag.attributes.once && Lava.types.Boolean.fromString(raw_tag.attributes.once)) {

			arguments[0].once = true;

		}

		storage.assigns[raw_tag.attributes.name] = arguments[0];

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xoption: function(raw_directive, view_config) {

		this._parseOption(view_config, raw_directive, 'options');

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} storage_property_name
	 */
	_parseOption: function(storage, raw_tag, storage_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);

		var option_type = raw_tag.attributes.type,
			result;

		if (option_type) {

			if (option_type == 'targets') {

				result = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

			} else if (option_type == 'expression') {

				result = Lava.ExpressionParser.parse(raw_tag.content[0], Lava.ExpressionParser.SEPARATORS.SEMICOLON);

			} else {

				Lava.t("Unknown option type: " + option_type);

			}

		} else {

			result = Lava.parseOptions(raw_tag.content[0]);

		}

		this._store(storage, storage_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} storage_property_name
	 */
	_parseProperty: function(storage, raw_tag, storage_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		this._store(storage, storage_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xroles: function(raw_directive, view_config) {

		this._parseRoles(view_config, raw_directive);

	},

	_parseRoles: function(storage, raw_tag) {

		if ('roles' in storage) Lava.t("Roles are already defined");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed roles tag/directive");
		storage.roles = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

	},

	/**
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
				if (['class', 'options'].indexOf(name) == -1) Lava.t('[_xcontainer_config] setting config property is not allowed: ' + name);
			}
		}

		if ('class' in config) original_config.class = config.class;
		if ('options' in config) {
			if (!('options' in original_config)) original_config.options = {};
			Firestorm.extend(original_config.options, config.options);
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xrefresher: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && view_config.type == 'widget') Lava.t("Wrong usage of x:refresher directive. May be applied only to views.");
		if (Lava.schema.DEBUG && ('refresher' in view_config)) Lava.t("Refresher is already defined");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed refresher config");
		view_config.refresher = Lava.parseOptions(raw_directive.content[0]);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBroadcast: function(widget_config, raw_element) {

		if ('broadcast' in widget_config) Lava.t("Broadcast is already defined");

		var result = {},
			name;

		for (name in raw_element.attributes) {

			result[name] = Lava.parsers.Common.parseTargets(raw_element.attributes[name]);

		}

		widget_config.broadcast = result;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbroadcast: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Broadcast directive requires a widget");

		this._parseBroadcast(widget_config, raw_directive);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBinding: function(widget_config, raw_element) {

		if (raw_element.content.length != 1) Lava.t("Malformed binding in widget definition: " + raw_element.attributes.name);

		var binding = {
			property_name: raw_element.attributes.name,
			path_config: Lava.ExpressionParser.parsePath(raw_element.content[0])
		};
		if ('direction' in raw_element.attributes) {
			if (!(raw_element.attributes.direction in Lava.BINDING_DIRECTIONS))
				Lava.t("Unknown binding direction: " + raw_element.attributes.direction);
			binding.direction = Lava.BINDING_DIRECTIONS[raw_element.attributes.direction];
		}
		this._store(widget_config, 'bindings', raw_element.attributes.name, binding);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbind: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Binding directive requires a widget");
		this._parseBinding(widget_config, raw_directive);

	},

	/**
	 * @param {(_cView|_cWidget)} config
	 * @param {string} name
	 * @param {_cRawDirective} raw_tag
	 */
	_parseObject: function(config, name, raw_tag) {

		if (Lava.schema.DEBUG && (name in config)) Lava.t("Object already exists: " + name + ". Ensure, that x:options and x:properties directives appear before x:option and x:property.");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed directive or tag for config property: " + name);
		config[name] = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} config
	 */
	_xoptions: function(raw_directive, config) {

		this._parseObject(config, 'options', raw_directive);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseProperty(widget_config, raw_directive, 'properties');

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperties: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseObject(widget_config, 'properties', raw_directive);

	},

	_storeDirectiveContent: function(widget_config, raw_directive, storage_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed property: " + raw_directive.attributes.name);
		this._store(widget_config, storage_name, raw_directive.attributes.name, raw_directive.content[0]);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty_string: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("property_string directive requires a widget");

		this._storeDirectiveContent(widget_config, raw_directive, 'properties');

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xoption_string: function(raw_directive, widget_config) {

		this._storeDirectiveContent(widget_config, raw_directive, 'options');

	},

	/**
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
	 * @param {_cRawDirective} raw_directive
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
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_value: function(raw_directive) {

		if (Lava.schema.DEBUG && (raw_directive.content || !raw_directive.attributes || !raw_directive.attributes.resource_id))
			Lava.t('Malformed static_value directive');

		return {
			type: 'static_value',
			resource_id: Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id)
		}

	},

	/**
	 * Caution! Inner argument should depend only on static data.
	 * Bindings are allowed, but not recommended, cause at the moment when template is rendered - they may be dirty.
	 *
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_eval: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1))
			Lava.t('Malformed static_eval directive');

		var arguments = Lava.ExpressionParser.parse(raw_directive.content[0]);

		if (Lava.schema.DEBUG && arguments.length == 0) Lava.t("static_eval: malformed argument");

		return {
			type: 'static_eval',
			argument: arguments[0]
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xattach_directives: function(raw_directive, widget_config) {

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

	_parseDefaultEvents: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.content || !raw_tag.content.length)) Lava.t('default_events: tag content is required');
		if (Lava.schema.DEBUG && ('default_events' in widget_config)) Lava.t('default_events: property already defined');

		var events = Lava.parseOptions(raw_tag.content[0]),
			i = 0,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(events)) Lava.t('default_events: array expected');
			for (count = events.length; i < count; i++) {
				if (typeof(events[i]) != 'string') Lava.t('default_events: expected an array of strings');
			}
		}

		events = Lava.excludeDefaultEvents(events);
		if (events.length != 0 || (raw_tag.attributes && ('force_replace' in raw_tag.attributes))) {
			widget_config.default_events = events;
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xdefault_events: function(raw_directive, widget_config) {

		this._parseDefaultEvents(raw_directive, widget_config);

	}

};