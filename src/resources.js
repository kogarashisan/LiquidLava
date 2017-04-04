
/**
 * API for working with resources, gathered into separate namespace for convenience
 */
Lava.resources = {

	/**
	 * Helper operations for merging container resources
	 * @type {Object.<string, string>}
	 */
	_container_resources_operations_map: {
		static_properties: '_containerSet',
		static_styles: '_containerSet',
		static_classes: '_containerSet',
		add_properties: '_containerAddObject',
		add_styles: '_containerAddObject',
		add_classes: '_containerAddArray',
		remove_properties: '_containerRemoveObject',
		remove_styles: '_containerRemoveObject',
		remove_classes: '_containerRemoveArray'
	},

	/**
	 * Another map for container resources operations
	 * @type {Object.<string, string>}
	 */
	_container_resources_operands_map: {
		add_properties: 'static_properties',
		remove_properties: 'static_properties',
		add_styles: 'static_styles',
		remove_styles: 'static_styles',
		add_classes: 'static_classes',
		remove_classes: 'static_classes'
	},

	/**
	 * Does nothing by default, but may be overwritten by user to handle string definitions in widget resources.
	 * Example usage: create an export file for translation
	 *
	 * @param {(_cTranslatableString|_cTranslatablePlural)} data
	 * @param {string} widget_title May be used as Domain for strings
	 * @param {string} locale
	 * @param {string} path
	 */
	exportTranslatableString: function(data, widget_title, locale, path) {

	},

	/**
	 * Attach resources object to global widget definition
	 * @param {string} widget_title The name in {@link Lava#widgets}
	 * @param {string} locale Locale of the resource object
	 * @param {Object} locale_resources The object with resources for given locale
	 */
	addWidgetResource: function(widget_title, locale, locale_resources) {

		if (Lava.schema.DEBUG && !(widget_title in Lava.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = Lava.widgets[widget_title];
		if (config.is_extended) Lava.t("Widget is already extended, can not add resources: " + widget_title);

		if (!config.resources) {
			config.resources = {}
		}

		if (Lava.schema.DEBUG && (locale in config.resources)) Lava.t("Locale is already defined: " + locale);
		config.resources[locale] = locale_resources;

	},

	/**
	 * Merge resource objects.
	 * `top_resources` is expected to be a copy or a new empty object.
	 * Properties in `top_resources` have priority over `bottom_resources`
	 *
	 * @param {Object} top_resources Child resources
	 * @param {Object} bottom_resources Parent resources
	 */
	mergeResources: function(top_resources, bottom_resources) {

		var name,
			result = Firestorm.Object.copy(top_resources);

		for (name in bottom_resources) {

			if (name in result) {

				if (Lava.schema.DEBUG && result[name].type != bottom_resources[name].type) Lava.t("Resource types mismatch: " + name);

				if (bottom_resources[name].type == 'component') {

					result[name] = {
						type: 'component',
						value: this.mergeResources(result[name].value, bottom_resources[name].value)
					};

				} else if (bottom_resources[name].type == 'container_stack') {

					if (result[name].type != 'container_stack') Lava.t();

					result[name] = {
						type: 'container_stack',
						value: bottom_resources[name].value.concat(result[name].value)
					}

				}

			} else {

				result[name] = bottom_resources[name];

			}

		}

		return result;

	},

	/**
	 * Container operations are stacked until first usage to guarantee correct inheritance
	 * @param {Object} resource_object
	 */
	mergeRootContainerStacks: function(resource_object) {

		for (var name in resource_object) {
			if (resource_object[name].type == 'container_stack') {

				resource_object[name] = {
					type: 'container',
					value: this._mergeRootContainerStack(resource_object[name].value)
				}

			}
		}

	},

	/**
	 * Perform merging of "container_stack" resource into "container" resource
	 * @param {Array} stack
	 * @returns {Object}
	 */
	_mergeRootContainerStack: function(stack) {

		var i = 0,
			count = stack.length,
			result = {},
			operation;

		if (Lava.schema.DEBUG && !Array.isArray(stack)) Lava.t();

		for (; i < count; i++) {
			operation = stack[i];
			this[this._container_resources_operations_map[operation.name]](result, operation.name, operation.value);
		}

		return result;

	},

	/** Container resources merging API */
	_containerSet: function(result, name, value) {
		result[name] = value;
	},

	/** Container resources merging API */
	_containerAddObject: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.extend(result[operand_name], value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerAddArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			result[operand_name] = result[operand_name].concat(value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerRemoveObject: function(result, name, value) {

		var target,
			operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			target = result[operand_name];
			for (var property_name in value) {
				delete target[property_name]
			}
		}
	},

	/** Container resources merging API */
	_containerRemoveArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.Array.excludeAll(result[operand_name], value);
		}
	},

	/**
	 * Helper function which puts the value inside the resources object under given path string.
	 * Used while parsing templates
	 *
	 * @param {Object} target_object The resources object which is being parsed
	 * @param {string} path Path inside the resources object
	 * @param {*} value
	 */
	putResourceValue: function(target_object, path, value) {

		var path_segments = path.split('.'),
			segment,
			resource_name = path_segments.pop(),
			i = 0,
			count = path_segments.length;

		if (Lava.schema.DEBUG && /[a-z]/.test(resource_name)) Lava.t("Terminal resource names must be uppercase");

		for (; i < count; i++) {

			segment = path_segments[i];
			if (Lava.schema.DEBUG && /[A-Z]/.test(segment)) Lava.t("Resource component names must be lowercase");

			if (!(segment in target_object)) {

				target_object[segment] = {
					type: 'component',
					value: {}
				};

			} else {

				if (Lava.schema.DEBUG && target_object[segment].type != 'component') Lava.t("Malformed resource definition, path is not component: " + path);

			}

			target_object = target_object[segment].value;

		}

		if (resource_name in target_object) Lava.t("Resource is already defined: " + path);
		target_object[resource_name] = value;

	}

};