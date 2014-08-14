/**
 * The widget config extension algorithms
 */
Lava.extenders = {

	// properties that must be merged with parent configs
	_widget_config_merged_properties: {
		includes: '_mergeIncludes',
		bindings: '_mergeConfigProperty',
		assigns: '_mergeConfigProperty',
		options: '_mergeConfigProperty',
		properties: '_mergeConfigProperty',
		storage: '_mergeStorage',
		sugar: '_mergeSugar',
		broadcast: '_mergeConfigProperty'
	},

	// property_name => needs_implement || property_merge_map
	_sugar_merge_map: {
		attribute_mappings: true,
		content_schema: {
			attribute_mappings: true,
			tag_mappings: true,
			tag_roles: true
		}
	},

	_mergeConfigProperty: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			}

		}

	},

	_mergeWithMap: function(dest, source, map) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else if (name in map) {

				if (map[name] == true) {

					Firestorm.implement(dest[name], source[name]);

				} else {

					this._mergeWithMap(dest[name], source[name], map[name]);

				}

			}

		}

	},

	_mergeSugar: function(dest_container, source_container, property_name) {

		this._mergeWithMap(dest_container[property_name], source_container[property_name], this._sugar_merge_map);

	},

	_mergeIncludes: function(dest_container, source_container, property_name, parent_widget_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name],
			new_name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				new_name = parent_widget_name + '$' + name;
				if (Lava.schema.DEBUG && (new_name in dest)) Lava.t();
				dest[new_name] = source[name];

			}

		}

	},

	_mergeStorage: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (Lava.schema.DEBUG && dest[name].type != source[name].type) Lava.t("[Config storage] property types must match: " + name);
				if (['template_hash', 'object_hash', 'object'].indexOf(dest[name].type) != -1) {

					Firestorm.implement(dest[name], source[name]);

				}

			}

		}

	},

	_extendResources: function(config, parent_config) {

		var locale_cache = {};

		if ('resources' in config) {

			if (Lava.schema.LOCALE in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources[Lava.schema.LOCALE]);
			}
			if ('default' in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources['default']);
			}

		}

		if (parent_config && ('resources_cache' in parent_config)) {

			locale_cache = Lava.resources.mergeResources(locale_cache, parent_config.resources_cache[Lava.schema.LOCALE]);

		}

		if (!Firestorm.Object.isEmpty(locale_cache)) {

			config.resources_cache = {};
			config.resources_cache[Lava.schema.LOCALE] = locale_cache;

		}

	},

	/**
	 * @param {_cWidget} config
	 */
	Default: function(config) {

		var parent_config,
			parent_name;

		if ('extends' in config) {

			parent_name = config.extends;
			// returns already extended configs
			parent_config = Lava.getWidgetConfig(parent_name);

			for (var name in parent_config) {

				if (name != 'resources' && name != 'resources_cache') {

					if (!(name in config)) {

						config[name] = parent_config[name];

					} else if (name in this._widget_config_merged_properties) {

						this[this._widget_config_merged_properties[name]](config, parent_config, name, parent_name);

					}

				}

			}

		}

		if (Lava.schema.RESOURCES_ENABLED) {
			this._extendResources(config, parent_config);
		}

		if (config.real_class && !('class_locator' in config)) {

			config['class'] = Lava.ClassManager.hasConstructor(config.real_class)
				? config.real_class
				: 'Lava.widget.' + config.real_class;

		} else {

			config['class'] = null;

		}

		config.is_extended = true;

	},

	_noop: function() {

	}

};