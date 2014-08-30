
Lava.parsers.Storage = {

	_root_handlers: {
		template_collection: '_parseTemplateCollection',
		object_collection: '_parseObjectCollection',
		template_hash: '_parseTemplateHash',
		object_hash: '_parseObjectHash',
		object: '_parseObject'
	},

	_object_property_handlers: {
		template: '_parsePropertyAsTemplate',
		lava_type: '_parsePropertyAsLavaType'
	},

	_object_attributes_handlers: {
		lava_type: '_parseAttributeAsLavaType'
	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {_tRawTemplate} raw_template
	 */
	parse: function(widget_config, raw_template) {

		var storage_schema = this.getMergedStorageSchema(widget_config),
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length,
			item_schema;

		for (; i < count; i++) {

			item_schema = storage_schema[tags[i].name];
			if (Lava.schema.DEBUG && !item_schema) Lava.t('parsing storage; no schema for ' + tags[i].name);
			Lava.store(widget_config, 'storage', tags[i].name, this[this._root_handlers[item_schema.type]](item_schema, tags[i]));

		}

	},

	/**
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Array}
	 */
	_walkTemplateAsArray: function(schema, raw_template, callback_name) {

		var result = [],
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			result.push(
				this[callback_name](schema, tags[i])
			);

		}

		return result;

	},

	/**
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Object}
	 */
	_walkTemplateAsHash: function(schema, raw_template, callback_name) {

		var result = {},
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG) {
				if (tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
				if (!tags[i].attributes || !tags[i].attributes.name) Lava.t("Storage: hash tag is missing the name attribute");
				if (tags[i].attributes.name in result) Lava.t('Duplicate item name in storage:' + tags[i].attributes.name);
			}

			result[tags[i].attributes.name] = this[callback_name](schema, tags[i], true);

		}

		return result;

	},

	/**
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {_tTemplate}
	 */
	_asTemplate: function(schema, raw_tag) {

		return Lava.parsers.Common.compileTemplate(raw_tag.content);

	},

	/**
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @param {bool} exclude_name
	 * @returns {{}}
	 */
	_asObject: function(schema, raw_tag, exclude_name) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			result = {},
			descriptor,
			name;

		for (; i < count; i++) {

			descriptor = schema.properties[tags[i].name];
			if (Lava.schema.DEBUG && !descriptor) Lava.t("Unknown tag in object: " + tags[i].name);
			if (Lava.schema.DEBUG && (tags[i].name in result)) Lava.t('[Storage] duplicate item in object: ' + tags[i].name);
			result[tags[i].name] = this[this._object_property_handlers[descriptor.type]](descriptor, tags[i]);

		}

		for (name in raw_tag.attributes) {

			if (exclude_name && name == 'name') continue;
			descriptor = schema.properties[name];
			if (Lava.schema.DEBUG && (!descriptor || !descriptor.is_attribute)) Lava.t("Unknown attribute in object: " + name);
			if (Lava.schema.DEBUG && (name in result)) Lava.t('[Storage] duplicate item (attribute) in object: ' + name);
			result[name] = this[this._object_attributes_handlers[descriptor.type]](descriptor, raw_tag.attributes[name]);

		}

		return result;

	},

	/**
	 * @param {_cWidget} widget_config
	 * @returns {Object.<name, _cStorageItemSchema>}
	 */
	getMergedStorageSchema: function(widget_config) {

		var parent_schema,
			result = widget_config.storage_schema;

		if (!widget_config.is_extended && widget_config.extends) {

			parent_schema = this.getMergedStorageSchema(Lava.widgets[widget_config.extends]);
			if (parent_schema) {
				if (result) {
					result = Firestorm.clone(result);
					Lava.mergeStorageSchema(result, parent_schema);
				} else {
					result = parent_schema;
				}
			}

		}

		return result;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root handlers

	/**
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObject: function(item_schema, raw_tag) {

		return this._asObject(item_schema, raw_tag);

	},

	// end: root handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsTemplate: function(schema, raw_tag) {

		return raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];

	},

	/**
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsLavaType: function(schema, raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || typeof (raw_tag.content[0]) != 'string')) Lava.t("One string expected in tag content: " + raw_tag.name);
		return Lava.valueToType(schema, raw_tag.content[0]);

	},

	/**
	 * @param {_cStorageObjectPropertySchema} descriptor
	 * @param {string} value
	 * @returns {*}
	 */
	_parseAttributeAsLavaType: function(descriptor, value) {

		return Lava.valueToType(descriptor, value);

	}

};