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
		sugar: '_mergeSugar',
		broadcast: '_mergeConfigProperty',
		storage_schema: '_mergeStorageSchema'
	},

	// property_name => needs_implement || property_merge_map
	_sugar_merge_map: {
		attribute_mappings: true,
		content_schema: {
			tag_roles: true
		}
	},

	_exceptions: ['resources', 'resources_cache', 'storage'],

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
			storage_schema = dest_container['storage_schema'],
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (['template_hash', 'object_hash', 'object'].indexOf(storage_schema[name].type) != -1) {

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

	_mergeStorageSchema: function(dest_container, source_container, property_name) {

		Lava.mergeStorageSchema(dest_container[property_name], source_container[property_name]);

	},

	/**
	 * @param {_cWidget} config
	 */
	Default: function(config) {

		var parent_config,
			parent_widget_name;

		if ('extends' in config) {

			parent_widget_name = config.extends;
			// returns already extended configs
			parent_config = Lava.getWidgetConfig(parent_widget_name);

			for (var name in parent_config) {

				if (this._exceptions.indexOf(name) == -1) {

					if (!(name in config)) {

						config[name] = parent_config[name];

					} else if (name in this._widget_config_merged_properties) {

						this[this._widget_config_merged_properties[name]](config, parent_config, name, parent_widget_name);

					}

				}

			}

			// delay merging of storage until storage_schema is merged
			if ('storage' in parent_config) {
				if (!('storage' in config)) {
					config['storage'] = parent_config['storage'];
				} else {
					this._mergeStorage(config, parent_config, 'storage', parent_widget_name);
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