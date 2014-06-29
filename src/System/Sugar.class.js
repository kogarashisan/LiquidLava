
Lava.define(
'Lava.system.Sugar',
/**
 * @lends Lava.system.Sugar#
 */
{

	/**
	 * If root sugar tag has content. Map of type from config to callback.
	 */
	_root_map: {
		template_collection: '_parseRootAsTemplateCollection',
		object_collection: '_parseRootAsObjectCollection',
		template_hash: '_parseRootAsTemplateHash',
		object_hash: '_parseRootAsObjectHash',
		object_map: '_parseRootAsObjectMap',
		template: '_parseRootAsTemplate',
		object: '_parseRootAsObject'
	},

	/**
	 * When root is parsed as object_map - handlers tag types
	 */
	_tag_handlers: {
		template_collection: '_parseTagAsTemplateCollection',
		object_collection: '_parseTagAsObjectCollection',
		template_hash: '_parseTagAsTemplateHash',
		object_hash: '_parseTagAsObjectHash',
		template: '_parseTagAsTemplate',
		object: '_parseTagAsObject'
	},

	/**
	 * For object_collection, object_map and object types: handlers of tags inside the object
	 */
	_object_tag_map: {
		template: '_parseObjectTagAsTemplate',
		type: '_parseObjectTagAsType'
	},

	_object_attributes_map: {
		object_property: '_parseObjectPropertyAttribute'
	},

	/**
	 * The types of attributes that can be on root object, type => handler_name
	 */
	_root_attributes_handlers: {
		id: '_parseRootIdAttribute',
		option: '_parseRootOptionAttribute',
		'switch': '_parseRootSwitchAttribute',
		property: '_parseRootPropertyAttribute',
		targets_option: '_parseRootTargetsOptionAttribute',
		expression_option: '_parseRootExpressionOptionAttribute'
	},

	_unknown_root_attributes_actions: {
		as_resource: '_parseRootAttributesAsResource'
	},

	/**
	 * Predefined (core) attributes on root object
	 */
	_attribute_mappings: {
		id: {type: 'id'}
	},

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parse: function(schema, raw_tag, widget_config) {

		var tag_copy;

		if (raw_tag.content) {

			// Lava.isVoidTag is a workaround for <x:attach_directives>
			if (Lava.isVoidTag(raw_tag.name) || !schema.content_schema) {

				tag_copy = this._applyTopDirectives(raw_tag, widget_config);
				if (Lava.schema.DEBUG && tag_copy.content && tag_copy.content.length) Lava.t("Widget is not allowed to have any content: " + raw_tag.name);

			} else {

				if (Lava.schema.DEBUG && !(schema.content_schema.type in this._root_map)) Lava.t("Unknown type of content in sugar: " + schema.content_schema.type);
				this[this._root_map[schema.content_schema.type]](schema.content_schema, raw_tag, widget_config);

			}

		}

		if (raw_tag.attributes) {

			this._parseRootAttributes(schema, raw_tag, widget_config);

		}

	},

	/**
	 * @param {_cSugarContentTemplateCollection|_cSugarContentTemplateHash|_cSugarContentObject|_cSugarContentObjectCollection|_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parseStorageTag: function(schema, raw_tag, widget_config) {

		this[this._tag_handlers[schema.type]](schema, raw_tag, widget_config);

	},

	_applyTopDirectives: function(raw_tag, widget_config) {

		var raw_blocks = Lava.parsers.Common.asBlocks(raw_tag.content),
			tag_copy = Firestorm.Object.copy(raw_tag),
			i = 0,
			count = raw_blocks.length,
			has_content = false;

		for (; i < count; i++) {

			if (raw_blocks[i].type == 'directive') {
				if (Lava.parsers.Directives.processDirective(raw_blocks[i], widget_config, true)) Lava.t("Directive inside sugar has returned a value: " + raw_blocks[i].name);
			} else {
				tag_copy.content = raw_blocks.slice(i);
				has_content = true;
				break;
			}

		}

		if (!has_content) {
			tag_copy.content = [];
		}

		return tag_copy;

	},

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAttributes: function(schema, raw_tag, widget_config) {

		var name,
			descriptor,
			unknown_attributes = {},
			unknown_schema;

		for (name in raw_tag.attributes) {

			if (Lava.schema.DEBUG && (name in this._attribute_mappings) && schema.attribute_mappings && (name in schema.attribute_mappings))
				Lava.t("Attribute schema is overridden by built-in schema: " + name);
			descriptor = this._attribute_mappings[name] || schema.attribute_mappings[name];
			if (descriptor) {
				this[this._root_attributes_handlers[descriptor.type]](widget_config, raw_tag.attributes[name], descriptor, name);
			} else {
				unknown_attributes[name] = raw_tag.attributes[name];
			}

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {
			unknown_schema = schema.unknown_root_attributes;
			if (Lava.schema.DEBUG && !unknown_schema) Lava.t("Sugar: unknown attribute: " + name + ", for widget: " + raw_tag.name);
			this[this._unknown_root_attributes_actions[unknown_schema.type]](widget_config, unknown_attributes, unknown_schema);
		}

	},

	/**
	 * @param {(_cSugarContentObjectCollection|_cSugarContentTemplateCollection)} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} callback_name
	 * @returns {Array}
	 */
	_walkContentAsArray: function(schema, raw_tag, callback_name) {

		var result = [],
			tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			result.push(
				this[callback_name](schema, tags[i])
			);

		}

		return result;

	},

	/**
	 * @param {(_cSugarContentTemplateHash|_cSugarContentObjectHash)} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} callback_name
	 * @param {string} tag_name
	 * @returns {Object}
	 */
	_walkContentAsHash: function(schema, raw_tag, callback_name, tag_name) {

		var result = {},
			tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name != tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			if (Lava.schema.DEBUG && (!tags[i].attributes || !tags[i].attributes.name)) Lava.t("Sugar: hash tag is missing the name attribute");
			result[tags[i].attributes.name] = this[callback_name](schema, tags[i]);

		}

		return result;

	},

	/**
	 * @param {Lavadoc._tSugarContent} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {Lavadoc._tTemplate}
	 */
	_asTemplate: function(schema, raw_tag) {

		return Lava.parsers.Common.compileTemplate(raw_tag.content);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {{}}
	 */
	_asObject: function(schema, raw_tag) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			result = {},
			descriptor;

		for (; i < count; i++) {

			if (!(tags[i].name in schema.tag_mappings)) Lava.t("Unknown tag in sugar: " + tags[i].name);
			descriptor = schema.tag_mappings[tags[i].name];
			this[this._object_tag_map[descriptor.type]](descriptor, tags[i], result);

		}

		if (raw_tag.attributes) {

			this._parseObjectAttributes(schema, raw_tag, result);

		}

		return result;

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {{}} object
	 */
	_parseObjectAttributes: function(schema, raw_tag, object) {

		var name,
			descriptor;

		for (name in raw_tag.attributes) {

			descriptor = schema.attribute_mappings[name];
			if (Lava.schema.DEBUG && !descriptor) Lava.t("Unknown attribute " + name + " in widget sugar on object: " + raw_tag.name);
			this[this._object_attributes_map[descriptor.type]](object, raw_tag.attributes[name], descriptor, name);

		}

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} storage_name
	 * @param {string} item_name
	 * @param {*} value
	 */
	_store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in storage: " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	_putStorageProperty: function(widget_config, schema, value) {

		if (Lava.schema.DEBUG && !schema.type) Lava.t("storage item schema must have a type");

		this._store(
			widget_config,
			'storage',
			schema.name,
			{
				type: schema.type,
				schema: schema,
				value: value
			}
		);

	},

	/**
	 * @param {_cSugarContentTemplateCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplateCollection: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsTemplateCollection(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentTemplateCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplateCollection: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsArray(schema, raw_tag, '_asTemplate'));

	},

	/**
	 * @param {_cSugarContentTemplateHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplateHash: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsTemplateHash(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentTemplateHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplateHash: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsHash(schema, raw_tag, '_asTemplate', schema.tag_name || 'template'));

	},

	/**
	 * @param {_cSugarContentObjectCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectCollection: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObjectCollection(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObjectCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObjectCollection: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsArray(schema, raw_tag, '_asObject'));

	},

	/**
	 * @param {_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectHash: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObjectHash(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObjectHash: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsHash(schema, raw_tag, '_asObject', schema.tag_name));

	},

	/**
	 * @param {_cSugarContentTemplate} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplate: function(schema, raw_tag, widget_config) {

		this._store(widget_config, 'includes', schema.name || 'content', Lava.parsers.Common.compileTemplate(raw_tag.content, widget_config));

	},

	/**
	 * @param {_cSugarContentTemplate} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplate: function(schema, raw_tag, widget_config) {

		this._store(widget_config, 'includes', schema.name || 'content', Lava.parsers.Common.compileTemplate(raw_tag.content));

	},

	/**
	 * @param {_cSugarContentObjectMap} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectMap: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config),
			tags = Lava.parsers.Common.asBlockType(tag_copy.content, 'tag'),
			i = 0,
			count = tags.length,
			descriptor;

		for (; i < count; i++) {

			if (tags[i].name in schema.tag_roles) {

				descriptor = schema.tag_roles[tags[i].name];
				this[this._tag_handlers[descriptor.type]](descriptor, tags[i], widget_config);

			} else {

				this._unknownTagRoleAction(tags[i]);

			}

		}

	},

	_unknownTagRoleAction: function(tag) {

		Lava.t("Unknown tag role in sugar: " + tag.name);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObject: function(schema, raw_tag, widget_config) {

		if (Lava.schema.DEBUG && schema.attribute_mappings) Lava.t("Invalid schema for root object: attribute_mappings belong to root.");

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObject(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObject: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._asObject(schema, raw_tag));

	},

	/**
	 * @param {_cSugarObjectTag} schema
	 * @param {_cRawTag} raw_tag
	 * @param {Object} object
	 */
	_parseObjectTagAsTemplate: function(schema, raw_tag, object) {

		if (Lava.schema.DEBUG && (raw_tag.name in object)) Lava.t("Duplicate tag in object: " + raw_tag.name);
		object[schema.name || raw_tag.name] = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];

	},

	/**
	 * @param {_cSugarObjectTag} schema
	 * @param {_cRawTag} raw_tag
	 * @param {{}} object
	 */
	_parseObjectTagAsType: function(schema, raw_tag, object) {

		if (Lava.schema.DEBUG) {
			if (!raw_tag.content || raw_tag.content.length != 1 || typeof (raw_tag.content[0]) != 'string') Lava.t("One string expected in tag content: " + raw_tag.name);
			if (!Lava.types[schema.type_name].isValidString(raw_tag.content[0], schema)) Lava.t("Invalid value in object tag: " + raw_tag.content[0]);
			if (raw_tag.name in object) Lava.t("Duplicate tag in object: " + raw_tag.name);
		}

		object[schema.name || raw_tag.name] = Lava.types[schema.type_name].fromSafeString(raw_tag.content[0], schema);

	},

	/**
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} attribute_value
	 * @returns {*}
	 */
	_valueToType: function(descriptor, attribute_value) {

		if (descriptor.type_name) {

			if (Lava.schema.DEBUG && !Lava.types[descriptor.type_name].isValidString(attribute_value, descriptor)) Lava.t("Invalid attribute value: " + attribute_value);
			attribute_value = Lava.types[descriptor.type_name].fromSafeString(attribute_value, descriptor);

		}

		return attribute_value;

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 */
	_parseRootIdAttribute: function(widget_config, attribute_value) {

		if (Lava.schema.DEBUG && (!Lava.isValidId(attribute_value) || ('id' in widget_config))) Lava.t();
		widget_config.id = attribute_value;

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options', descriptor.name || name, this._valueToType(descriptor, attribute_value));

	},

	/**
	 * Same as 'option', but empty value is treated as boolean TRUE, to allow value-less attributes.
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootSwitchAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options',  descriptor.name || name, (attribute_value == '') ? true : Lava.types.Boolean.fromString(attribute_value));

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootPropertyAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'properties', descriptor.name || name, this._valueToType(descriptor, attribute_value));

	},

	/**
	 * @param {{}} object
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} schema
	 * @param {string} name
	 */
	_parseObjectPropertyAttribute: function(object, attribute_value, schema, name) {

		if (Lava.schema.DEBUG && (name in object)) Lava.t("Duplicate property in object: " + name);
		object[schema.name || name] = this._valueToType(schema, attribute_value);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {Object} unknown_attributes
	 * @param {Object} action_schema
	 */
	_parseRootAttributesAsResource: function(widget_config, unknown_attributes, action_schema) {

		var value = {
				type: 'container_stack',
				value: []
			},
			operations_stack = value.value;

		if (!widget_config.resources) {

			widget_config.resources = {};

		}

		if (!widget_config.resources['default']) {

			widget_config.resources['default'] = {};

		}

		if ('class' in unknown_attributes) {

			operations_stack.push({
				name: 'static_classes',
				value: unknown_attributes['class'].trim().split(/\s+/)
			});
			delete unknown_attributes['class'];

		}

		if ('style' in unknown_attributes) {

			operations_stack.push({
				name: 'static_styles',
				value: Lava.parsers.Common.parseStyleAttribute(unknown_attributes.style)
			});
			delete  unknown_attributes.style;

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			operations_stack.push({
				name: 'static_properties',
				value: Firestorm.Object.copy(unknown_attributes) // copying to reduce possible slowdowns (object may contain deleted values)
			});

		}

		Lava.resources.putResourceValue(widget_config.resources['default'], action_schema.container_resource_name, value);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootTargetsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options', descriptor.name || name, Lava.parsers.Common.parseTargets(attribute_value));

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootExpressionOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(
			widget_config,
			'options',
			descriptor.name || name,
			Lava.ExpressionParser.parse(attribute_value, Lava.ExpressionParser.SEPARATORS.SEMICOLON)
		);

	}

});