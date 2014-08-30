
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
		storage_schema: '_widgetTagStorageSchema',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents',
		edit_template: '_widgetTagEditTemplate',
		include: '_widgetTagInclude'
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

	_known_edit_tasks: {
		replace_config_option: '_editTaskSetConfigOptions',
		add_class: '_editTaskAddClass'
	},

	RESOURCE_ARRAY_ALLOWED_TYPES: ['string', 'boolean', 'null', 'number'],

	/**
	 * To prevent nested defines
	 */
	_is_processing_define: false,
	_current_widget_title: null, // the title of the widget in x:define directive, which is currently being processed
	_widget_directives_stack: [],

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

	_importVars: function(destination, source, name_list) {
		for (var i = 0, count = name_list.length; i < count; i++) {
			var name = name_list[i];
			if (name in source) destination[name] = source[name];
		}
	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagBind: function(raw_tag, widget_config) {

		this._parseBinding(widget_config, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagAssign: function(raw_tag, widget_config) {

		this._parseAssign(widget_config, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOption: function(raw_tag, widget_config) {

		this._parseOption(widget_config, raw_tag, 'options');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperty: function(raw_tag, widget_config) {

		this._parseProperty(widget_config, raw_tag, 'properties');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOptions: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'options', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorageSchema: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'storage_schema', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperties: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'properties', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagRoles: function(raw_tag, widget_config) {

		this._parseRoles(widget_config, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagSugar: function(raw_tag, widget_config) {

		if ('sugar' in widget_config) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		widget_config.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagBroadcast: function(raw_tag, widget_config) {

		this._parseBroadcast(widget_config, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorage: function(raw_tag, widget_config) {

		Lava.parsers.Storage.parse(widget_config, raw_tag.content);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagDefaultEvents: function(raw_tag, widget_config) {

		this._parseDefaultEvents(raw_tag, widget_config);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagResources: function(raw_tag, widget_config) {

		this._xresources(raw_tag, widget_config);

	},

	/**
	 * @param {_tRawTemplate} raw_template
	 * @returns {Array.<*>}
	 */
	_parseTaskArguments: function(raw_template) {

		var blocks = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = blocks.length,
			temp,
			item,
			result = [];

		for (; i < count; i++) {

			switch (blocks[i].name) {
				case 'template':
					item = blocks[i].content ? Lava.parsers.Common.compileTemplate(blocks[i].content) : [];
					break;
				case 'expression':
					if (Lava.schema.DEBUG && (!blocks[i].content || blocks[i].content.length != 1)) Lava.t('malformed task arguments');
					temp = Lava.ExpressionParser.parse(blocks[i].content[0]);
					if (Lava.schema.DEBUG && temp.length != 1) Lava.t('malformed task arguments: multiple expressions');
					item = temp[0];
					break;
				case 'options':
					item = Lava.parseOptions(blocks[i].content[0]);
					break;
				default:
					Lava.t('edit_template: unknown or malformed task argument');
			}

			result.push(item);
		}

		return result;

	},

	_evalTaskHandler: function(src) {
		var handler = null;
		eval(src);
		if (Lava.schema.DEBUG && typeof(handler) != 'function') Lava.t('malformed task handler');
		return handler;
	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagEditTemplate: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.attributes || !raw_tag.attributes['name'])) Lava.t('Malformed edit_template tag');

		var tasks = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tasks.length,
			source_widget_config,
			template,
			extends_,
			widget_tag,
			content_blocks,
			block_index,
			block_count,
			blocks_hash,
			task_arguments,
			handler;

		if (raw_tag.attributes['source_widget']) {

			source_widget_config = Lava.widgets[raw_tag.attributes['source_widget']];
			if (Lava.schema.DEBUG && (!source_widget_config || source_widget_config.is_extended)) Lava.t('edit_template: source widget does not exist or is already extended');
			if (Lava.schema.DEBUG && (!source_widget_config.includes || !source_widget_config.includes[raw_tag.attributes.name])) Lava.t('[edit_template] source widget does not have the include: ' + raw_tag.attributes.name);
			template = Firestorm.clone(source_widget_config.includes[raw_tag.attributes.name]);

		} else {

			if (('includes' in widget_config) && widget_config.includes[raw_tag.attributes.name]) {

				template = widget_config.includes[raw_tag.attributes.name];

			} else {

				widget_tag = this._widget_directives_stack[this._widget_directives_stack.length - 1];
				if (!widget_tag) Lava.t('edit_template: unable to find source template');

				extends_ = widget_tag.attributes.extends;
				while (true) {
					if (!extends_) Lava.t('edit_template: unable to find source template');
					source_widget_config = Lava.widgets[extends_];
					if (Lava.schema.DEBUG && (!source_widget_config || source_widget_config.is_extended)) Lava.t('edit_template: source widget does not exist or is already extended');
					if (source_widget_config.includes && source_widget_config.includes[raw_tag.attributes.name]) {
						template = source_widget_config.includes[raw_tag.attributes.name];
						break;
					}
					extends_ = source_widget_config.extends;
				}

			}
			if (!template) Lava.t();
			template = Firestorm.clone(template);

		}

		for (; i < count; i++) { // collection of <task> tags

			if (Lava.schema.DEBUG && (!tasks[i].attributes || tasks[i].name != 'task')) Lava.t('Malformed edit_template task');

			task_arguments = null;
			blocks_hash = null;

			if (tasks[i].content) {
				blocks_hash = {};
				content_blocks = Lava.parsers.Common.asBlockType(tasks[i].content, 'tag');
				for (block_index = 0, block_count = content_blocks.length; block_index < block_count; block_index++) {
					blocks_hash[content_blocks[block_index].name] = content_blocks[block_index];
				}
				if ('arguments' in blocks_hash) {
					if (Lava.schema.DEBUG && !blocks_hash['arguments'].content) Lava.t('edit_template: malformed task arguments');
					task_arguments = this._parseTaskArguments(blocks_hash['arguments'].content);
				}
			}

			switch (tasks[i].attributes.type) {
				case 'manual':
					if (Lava.schema.DEBUG && (!blocks_hash['handler'] || !blocks_hash['handler'].content || blocks_hash['handler'].content.length != 1)) Lava.t('edit_template: malformed task handler');
					handler = this._evalTaskHandler(blocks_hash['handler'].content[0]);
					handler(template, tasks[i], blocks_hash, task_arguments);
					break;
				case 'traverse':
					if (Lava.schema.DEBUG && (!blocks_hash['handler'] || !blocks_hash['handler'].content || blocks_hash['handler'].content.length != 1)) Lava.t('edit_template: malformed task handler');
					handler = eval('(' + blocks_hash['handler'].content[0] + ')');
					if (Lava.schema.DEBUG && typeof(handler) != 'object') Lava.t('edit_template: wrong handler for traverse task');
					handler.arguments = task_arguments;
					Lava.TemplateWalker.walkTemplate(template, handler);
					break;
				case 'known':
					if (Lava.schema.DEBUG && !(tasks[i].attributes.name in this._known_edit_tasks)) Lava.t('[edit_template] unknown task: ' + tasks[i].attributes.name);
					this[this._known_edit_tasks[tasks[i].attributes.name]](template, tasks[i], blocks_hash, task_arguments);
					break;
				default:
					Lava.t('edit_template: task requires the "type" attribute');
			}

		}

		Lava.store(widget_config, 'includes', raw_tag.attributes.as || raw_tag.attributes.name, template);

	},

	/**
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
	 * @param {_cRawTag} raw_tag
	 */
	_asMainWidget: function(raw_tag) {

		var view_config = Lava.parsers.Common.compileAsView(raw_tag.content),
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			name;

		if (Lava.schema.DEBUG) {
			if (view_config['class'] != 'View') Lava.t("define: view in 'main' role must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			if ('roles' in view_config) Lava.t("Widget definition: move the roles from main view to widget");
			for (name in view_config) {
				if (['assigns', 'options', 'class', 'type', 'template', 'container'].indexOf(name) == -1) {
					Lava.t("main_view: view has an option, which can not be copied to widget: " + name + ". Probably, it must be specified via separate tag");
				}
			}
		}

		this._importVars(widget_config, view_config, ['template', 'container', 'assigns', 'options']);

		return widget_config;

	},

	/**
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

			if (tags[0].name == 'main_view') {

				widget_config = this._asMainWidget(tags[0]);
				i = 1;

			} else if (tags[0].name == 'main_template') {

				widget_config.template = Lava.parsers.Common.compileTemplate(tags[0].content);
				i = 1;

			}

		}

		// extends must be set before <storage> (required by Lava.parsers.Storage.getMergedStorageSchema())
		if (raw_directive.attributes.extends) widget_config.extends = raw_directive.attributes.extends;

		for (; i < count; i++) {

			tag = tags[i];
			if (tag.name == 'storage_schema' && is_storage_parsed) Lava.t('Widget definition: `storage_schema` must preceed the `storage` tag');
			if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Note, that main_template and main_view tags must be on top.");
			this[this._widget_tag_actions[tag.name]](tag, widget_config);
			if (tag.name == 'storage') is_storage_parsed = true;

		}

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

		if (Lava.schema.DEBUG && !widget_config['class'] && !widget_config.extends) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
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

		Lava.store(storage, storage_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * @param {_cWidget} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} storage_property_name
	 */
	_parseProperty: function(storage, raw_tag, storage_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		Lava.store(storage, storage_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

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

		if ('class' in config) original_config['class'] = config['class'];
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
		Lava.store(widget_config, 'bindings', raw_element.attributes.name, binding);

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
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
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
		Lava.store(widget_config, storage_name, raw_directive.attributes.name, raw_directive.content[0]);

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

	},

	_selectFirst: function(template, node_type, condition) {

		var filter,
			visitor = {},
			target = null;

		filter = condition
			? new Function('node', 'return !!(' + condition + ')')
			: function() { return true; };

		visitor['visit' + node_type] = function(walker, node) {
			if (filter(node)) {
				target = node;
				walker.interrupt();
			}
		};

		Lava.TemplateWalker.walkTemplate(template, visitor);

		return target;

	},

	/**
	 * @param {_tTemplate} template
	 * @param {_cRawTag} task_tag
	 * @param {Object.<string,_cRawTag>} content_blocks_hash
	 * @param {Array.<*>} task_arguments
	 */
	_editTaskSetConfigOptions: function(template, task_tag, content_blocks_hash, task_arguments) {

		if (Lava.schema.DEBUG && !task_tag.attributes.node_type) Lava.t('_editTaskSetConfigOptions: malformed attributes');

		var assign = content_blocks_hash.assign,
			set_path,
			set_var,
			set_value,
			i = 0,
			count,
			current_segment,
			type;

		if (Lava.schema.DEBUG && (!assign || !assign.attributes || !assign.attributes['path'] || !assign.content || assign.content.length != 1))
			Lava.t('_editTaskSetConfigOptions: malformed or missing assign');

		current_segment = this._selectFirst(template, task_tag.attributes.node_type, task_tag.attributes.condition);

		if (!current_segment) Lava.t('_editTaskSetConfigOptions: target not found');

		set_path = content_blocks_hash.assign.attributes['path'].split('.');
		set_var = set_path.pop();
		set_value = Lava.parseOptions(content_blocks_hash.assign.content[0]);

		for (count = set_path.length; i < count; i++) {
			if (!(set_path[i] in current_segment)) {
				current_segment[set_path[i]] = {};
			} else if (Lava.schema.DEBUG) {
				type = Firestorm.getType(current_segment[set_path[i]]);
				if (type != 'null' && type != 'object') Lava.t('_editTaskSetConfigOptions: trying to set a path, which is not an object');
			}
			current_segment = current_segment[set_path[i]]
		}

		current_segment[set_var] = set_value;

	},

	_editTaskAddClass: function(template, task_tag, content_blocks_hash, task_arguments) {

		if (Lava.schema.DEBUG && !task_tag.attributes.node_type) Lava.t('_editTaskAddClass: malformed attributes');

		var target,
			i = 0;

		target = this._selectFirst(template, task_tag.attributes.node_type, task_tag.attributes.condition);

		if (!target || !target.container) Lava.t('_editTaskAddClass: target not found or does not have a container');

		if (target.container.class_bindings) {
			while (i in target.container.class_bindings) {
				i++;
			}
			target.container.class_bindings[i] = task_arguments[0];
		} else {
			target.container.class_bindings = {
				0: task_arguments[0]
			};
		}

	}

};