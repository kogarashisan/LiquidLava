
Lava.ClassManager = {

	/**
	 * Whether to serialize them and inline as a value, or slice() from original array in original object
	 */
	INLINE_SIMPLE_ARRAYS: true,
	/**
	 * If an array consists of these types - it can be inlined.
	 */
	SIMPLE_TYPES: ['string', 'boolean', 'number', 'null', 'undefined'],

	/**
	 * @type {Object.<string, _cClassData>}
	 */
	_sources: {},
	/**
	 * [Class path] => constructor - a function that returns a new class instance
	 * @type {Object.<string, function>}
	 */
	constructors: {},
	_reserved_members: ['Extends', 'Implements', 'Class', 'Shared'],

	_root: {},

	/**
	 * Members of the "Class" property of any class.
	 * @lends _cClassData#
	 */
	ClassData: {

		instanceOf: function(class_name) {

			return this.hierarchy_paths.indexOf(class_name) != -1;

		}

	},

	registerRootNamespace: function(name, object) {

		this._root[name] = object;

	},

	/**
	 * @param {string} class_path
	 * @returns {_cClassData}
	 */
	getClassData: function(class_path) {

		return this._sources[class_path];

	},

	define: function(class_path, source_object) {

		var name,
			class_data,
			parent_data,
			i,
			count,
			shared_names;

		class_data = /** @type {_cClassData} */ {
			name: class_path.split('.').pop(),
			path: class_path,
			source_object: source_object,
			hierarchy_index: 0,
			extends: null,
			implements: [],
			parent_class_data: null,
			hierarchy_paths: null,
			skeleton: null,
			references: [],
			shared: {},
			constructor: null,
			own_references_count: 0,
			instanceOf: this.ClassData.instanceOf
		};

		if ('Extends' in source_object) {

			if (Lava.schema.DEBUG && typeof(source_object.Extends) != 'string') Lava.t('Extends: string expected. ' + class_path);
			class_data.extends = source_object.Extends;
			parent_data = this._sources[source_object.Extends];
			class_data.parent_class_data = parent_data;

			if (!parent_data) Lava.t('[define] Base class not found: "' + source_object.Extends + '"');
			if (!parent_data.skeleton) Lava.t("[define] Parent class was loaded without skeleton, extension is not possible: " + class_data.extends);

			class_data.hierarchy_index = parent_data.hierarchy_index + 1;
			class_data.hierarchy_paths = parent_data.hierarchy_paths.slice();
			class_data.hierarchy_paths.push(class_path);
			class_data.references = parent_data.references.slice();
			class_data.own_references_count -= parent_data.references.length;
			class_data.implements = parent_data.implements.slice();

			for (name in parent_data.shared) {

				class_data.shared[name] = {};
				Firestorm.extend(class_data.shared[name], parent_data.shared[name]);

				if (name in source_object) {

					Firestorm.extend(class_data.shared[name], source_object[name]);

				}

			}

		} else {

			class_data.hierarchy_paths = [class_path];

		}

		if ('Shared' in source_object) {

			shared_names = (typeof(source_object.Shared) == 'string') ? [source_object.Shared] : source_object.Shared;

			for (i = 0, count = shared_names.length; i < count; i++) {

				name = shared_names[i];
				if (Lava.schema.DEBUG && !(name in source_object)) Lava.t("Shared member is not in class: " + name);
				if (Lava.schema.DEBUG && Firestorm.getType(source_object[name]) != 'object') Lava.t("Shared: class member must be an object");
				if (Lava.schema.DEBUG && class_data.parent_class_data && (name in class_data.parent_class_data.skeleton)) Lava.t("[ClassManager] instance member from parent class may not become shared in descendant: " + name);

				if (!(name in class_data.shared)) {

					class_data.shared[name] = {};

				}

				Firestorm.extend(class_data.shared[name], source_object[name]);

			}

		}

		class_data.skeleton = this._disassemble(class_data, source_object, class_data.hierarchy_index, true);

		if (parent_data) {

			this._extend(class_data, class_data.skeleton, parent_data, parent_data.skeleton, true);

		}

		class_data.own_references_count += class_data.references.length;

		if ('Implements' in source_object) {

			if (typeof(source_object.Implements) == 'string') {

				this._implementPath(class_data, source_object.Implements);

			} else {

				for (i = 0, count = source_object.Implements.length; i < count; i++) {

					this._implementPath(class_data, source_object.Implements[i]);

				}

			}

		}

		class_data.constructor = this._buildRealConstructor(class_data);

		this._registerClass(class_data);

	},

	/**
	 * @param {_cClassData} class_data
	 * @param {string} path
	 */
	_implementPath: function(class_data, path) {

		var implements_source = this._sources[path],
			name,
			references_offset;

		if (!implements_source) Lava.t('Implements: class not found - "' + path + '"');
		if (Lava.schema.DEBUG) {

			for (name in implements_source.shared) Lava.t("Implements: unable to use a class with Shared as mixin.");

		}

		if (Lava.schema.DEBUG && class_data.implements.indexOf(path) != -1) {

			Lava.t("Implements: class " + class_data.path + " already implements " + path);

		}

		class_data.implements.push(path);
		references_offset = class_data.references.length;
		// array copy is inexpensive, cause it contains only reference types
		class_data.references = class_data.references.concat(implements_source.references);

		this._extend(class_data, class_data.skeleton, implements_source, implements_source.skeleton, true, references_offset);

	},

	/**
	 * @param child_skeleton
	 * @param {_cClassData} child_data
	 * @param parent_skeleton
	 * @param {_cClassData} parent_data
	 * @param {boolean} is_root
	 * @param {number=} references_offset Also acts as a sign of 'implements' mode
	 */
	_extend: function (child_data, child_skeleton, parent_data, parent_skeleton, is_root, references_offset) {

		var parent_descriptor,
			name,
			new_name;

		for (name in parent_skeleton) {

			parent_descriptor = parent_skeleton[name];

			if (name in child_skeleton) {

				if (is_root && (child_skeleton[name].type == 'function' ^ parent_descriptor.type == 'function')) {
					Lava.t('Extend: functions in class root are not replaceable with other types (' + name + ')');
				}

				if (parent_descriptor.type == 'function') {

					if (!is_root || typeof(references_offset) != 'undefined') continue;

					new_name = parent_data.name + '$' + name;
					if (new_name in child_skeleton) Lava.t('[ClassManager] Assertion failed, function already exists: ' + new_name);
					child_skeleton[new_name] = parent_descriptor;

				} else if (parent_descriptor.type == 'object') {

					this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

				}

			} else if (parent_descriptor.type == 'object') {

				child_skeleton[name] = {type: 'object', skeleton: {}};
				this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

			} else if (references_offset && (parent_descriptor.type == 'function' || parent_descriptor.type == 'sliceArray')) {

				child_skeleton[name] = {type: parent_descriptor.type, index: parent_descriptor.index + references_offset};

			} else {

				child_skeleton[name] = parent_descriptor;

			}

		}

	},

	_disassemble: function(class_data, source_object, hierarchy_index, is_root) {

		var skeleton = {},
			value,
			type;

		for (var name in source_object) {

			if (is_root && (this._reserved_members.indexOf(name) != -1 || (name in class_data.shared))) {

				continue;

			}

			value = source_object[name];
			type = Firestorm.getType(value);

			switch (type) {
				case 'object':
					skeleton[name] = {
						type: 'object',
						skeleton: this._disassemble(class_data, value, hierarchy_index, false)
					};
					break;
				case 'function':
					skeleton[name] = {type: 'function', index: class_data.references.length};
					class_data.references.push(value);
					break;
				case 'array':
					if (value.length == 0) {
						skeleton[name] = {type: 'inlineArray', is_empty: true};
					} else if (this.INLINE_SIMPLE_ARRAYS && this.isInlineArray(value)) {
						skeleton[name] = {type: 'inlineArray', value: value};
					} else {
						skeleton[name] = {type: 'sliceArray', index: class_data.references.length};
						class_data.references.push(value);
					}
					break;
				case 'null':
					skeleton[name] = {type: 'null'};
					break;
				case 'undefined':
					skeleton[name] = {type: 'undefined'};
					break;
				case 'boolean':
					skeleton[name] = {type: 'boolean', value: value};
					break;
				case 'number':
					skeleton[name] = {type: 'number', value: value};
					break;
				case 'string':
					skeleton[name] = {type: 'string', value: value};
					break;
				case 'regexp':
					skeleton[name] = {type: 'regexp', value: value};
					break;
				default:
					Lava.t("[Class system] Unsupported property type in source object: " + type);
					break;

			}

		}

		return skeleton;

	},

	_buildRealConstructor: function(class_data) {

		var prototype = {},
			skeleton = class_data.skeleton,
			serialized_action,
			constructor_actions = [],
			name,
			source,
			constructor;

		for (name in skeleton) {

			serialized_action = null;

			switch (skeleton[name].type) {
				// members that should be in prototype
				case 'string':
					prototype[name] = skeleton[name].value;
					break;
				case 'null':
					prototype[name] = null;
					break;
				case 'undefined':
					prototype[name] = void 0;
					break;
				case 'boolean':
					prototype[name] = skeleton[name].value;
					break;
				case 'number':
					prototype[name] = skeleton[name].value;
					break;
				case 'function':
					prototype[name] = class_data.references[skeleton[name].index];
					break;
				case 'regexp':
					prototype[name] = skeleton[name].value;
					break;
				// members that are copied as inline property
				case 'sliceArray':
					serialized_action = 'r[' + skeleton[name].index + '].slice()';
					break;
				case 'inlineArray':
					serialized_action = skeleton[name].is_empty ? '[]' : Lava.Serializer.serialize(skeleton[name].value);
					break;
				case 'object':
					var object_properties = this._serializeSkeleton(skeleton[name].skeleton, class_data, "\t");
					serialized_action = object_properties.length
						? "{\n\t" + object_properties.join(",\n\t") + "\n}"
						: "{}";
					break;
				default:
					Lava.t("[_buildRealConstructor] unknown property descriptor type: " + skeleton[name].type);
			}

			if (serialized_action) {

				if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

					constructor_actions.push('this.' + name + ' = ' + serialized_action);

				} else {

					constructor_actions.push('this["' + name.replace(/\"/g, "\\\"") + '"] = ' + serialized_action);

				}

			}

		}

		for (name in class_data.shared) {

			prototype[name] = class_data.shared[name];

		}

		prototype.Class = class_data;

		source = "var r=Lava.ClassManager.getClassData('" + class_data.path + "').references;\n"
			+ constructor_actions.join(";\n")
			+ ";";

		if (class_data.skeleton.init) {

			source += "\nthis.init.apply(this, arguments);";

		}

		constructor = new Function(source);
		constructor.prototype = prototype;
		return constructor;

	},

	_serializeSkeleton: function(skeleton, class_data, padding) {

		var serialized_properties = [],
			name,
			serialized_value;

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'sliceArray':
					serialized_value = 'r[' + skeleton[name].index + '].slice()';
					break;
				case 'inlineArray':
					serialized_value = skeleton[name].is_empty ? '[]' : Lava.Serializer.serialize(skeleton[name].value);
					break;
				case 'object':
					var object_properties = this._serializeSkeleton(skeleton[name].skeleton, class_data, padding + "\t");
					serialized_value = object_properties.length
						? "{\n\t" + padding + object_properties.join(",\n\t" + padding) + "\n" + padding + "}" : "{}";
					break;
				default:
					Lava.t("[_serializeSkeleton] unknown property descriptor type: " + skeleton[name].type);
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name) && Lava.JS_KEYWORDS.indexOf(name) == -1) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push('"' + name.replace(/\"/g, "\\\"") + '": ' + serialized_value);

			}

		}

		return serialized_properties;

	},

	_getNamespace: function(path_segments) {

		var namespace,
			segment_name,
			count = path_segments.length,
			i = 1;

		if (!count) Lava.t("ClassManager: class names must include a namespace, even for global classes.");
		if (!(path_segments[0] in this._root)) Lava.t("[ClassManager] namespace is not registered: " + path_segments[0]);
		namespace = this._root[path_segments[0]];

		for (; i < count; i++) {

			segment_name = path_segments[i];

			if (!(segment_name in namespace)) {

				namespace[segment_name] = {};

			}

			namespace = namespace[segment_name];

		}

		return namespace;

	},

	/**
	 * @param {string} class_path
	 * @param {string=} default_namespace
	 * @returns {*}
	 */
	getConstructor: function(class_path, default_namespace) {

		if (!(class_path in this.constructors) && default_namespace) {

			class_path = default_namespace + '.' + class_path;

		}

		return this.constructors[class_path];

	},

	isInlineArray: function(items) {

		var result = true,
			i = 0,
			count = items.length;

		for (; i < count; i++) {

			if (this.SIMPLE_TYPES.indexOf(Firestorm.getType(items[i])) == -1) {
				result = false;
				break;
			}

		}

		return result;

	},

	/**
	 * Register an existing function as a class constructor for usage with create().
	 * @param {string} class_path
	 * @param {function} constructor
	 */
	registerExistingConstructor: function(class_path, constructor) {

		if (class_path in this._sources) Lava.t('Class "' + class_path + '" is already defined');
		this.constructors[class_path] = constructor;

	},

	hasConstructor: function(class_path) {

		return class_path in this.constructors;

	},

	hasClass: function(class_path) {

		return class_path in this._sources;

	},

	_getPrototypeGenerator: function(class_data) {

		var skeleton = class_data.skeleton,
			name,
			serialized_value,
			serialized_properties = ['\tClass:cd'];

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push('"' + name.replace(/\"/g, "\\\"") + '": ' + serialized_value);

			}

		}

		for (name in class_data.shared) {

			serialized_properties.push(name + ':s.' + name);

		}

		return new Function('cd', "var r=cd.references,s=cd.shared;\nreturn {\n" + serialized_properties.join(',\n\t') + "\n};");

	},

	exportClass: function(class_path) {

		var class_data = this._sources[class_path],
			shared = {},
			name,
			result;

		for (name in class_data.shared) {

			if (name in class_data.source_object) {

				shared[name] = class_data.source_object[name];

			}

		}

		result = {
			// string data
			name: class_data.name,
			path: class_data.path,
			hierarchy_index: class_data.hierarchy_index,
			extends: class_data.extends,
			implements: null,
			hierarchy_paths: class_data.hierarchy_paths,
			parent_class_data: null, // reserved for serialization

			prototype_generator: this._getPrototypeGenerator(class_data),
			shared: shared,
			references: null, // warning: partial array, contains only own class' members
			constructor: this.constructors[class_path],

			skeleton: class_data.skeleton, // may be deleted, if extension via define() is not needed for this class
			source_object: class_data.source_object // may be safely deleted before serialization.
		};

		if (class_data.parent_class_data) {

			// cut the parent's data and leave only child's
			result.references = class_data.references.slice(
				class_data.parent_class_data.references.length,
				class_data.parent_class_data.references.length + class_data.own_references_count
			);
			result.implements = class_data.implements.slice(class_data.parent_class_data.implements.length);

		} else {

			result.references = class_data.references.slice(0, class_data.own_references_count);
			result.implements = class_data.implements;

		}

		return result;

	},

	loadClass: function(class_data) {

		var parent_data,
			name,
			shared = class_data.shared,
			i = 0,
			count,
			own_implements = class_data.implements;

		if (class_data.extends) {

			parent_data = this._sources[class_data.extends];
			if (Lava.schema.DEBUG && !parent_data) Lava.t("[loadClass] class parent does not exists: " + class_data.extends);

			class_data.parent_class_data = parent_data;
			class_data.references = parent_data.references.concat(class_data.references);

			for (name in parent_data.shared) {

				if (!(name in shared)) {

					shared[name] = {};
					Firestorm.extend(shared[name], parent_data.shared[name]);

				} else {

					Firestorm.implement(shared[name], parent_data.shared[name]);

				}

			}

			class_data.implements = parent_data.implements.concat(class_data.implements);

		}

		for (count = own_implements.length; i < count; i++) {

			class_data.references = class_data.references.concat(this._sources[own_implements[i]].references);

		}

		class_data.constructor.prototype = class_data.prototype_generator(class_data);
		class_data.instanceOf = this.ClassData.instanceOf;

		this._registerClass(class_data);

	},

	_registerClass: function(class_data) {

		var class_path = class_data.path,
			namespace_path = class_path.split('.'),
			class_name = namespace_path.pop(),
			namespace = this._getNamespace(namespace_path);

		if (Lava.schema.DEBUG && ((class_path in this._sources) || (class_path in this.constructors))) Lava.t("Class is already defined: " + class_path);

		if ((class_name in namespace) && namespace[class_name] != null) Lava.t("Class name conflict: '" + class_path + "' property is already defined in namespace path");

		this._sources[class_path] = class_data;
		this.constructors[class_path] = class_data.constructor;
		namespace[class_name] = class_data.constructor;

	},

	getPackageConstructor: function(base_path, suffix) {

		if (Lava.schema.DEBUG && !(base_path in this._sources)) Lava.t("[getPackageConstructor] Class not found: " + base_path);

		var path,
			current_class = this._sources[base_path],
			result = null;

		do {

			path = current_class.path + suffix;
			if (path in this.constructors) {

				result = this.constructors[path];
				break;

			}

			current_class = current_class.parent_class_data;

		} while (current_class);

		return result;

	},

	getClassNames: function() {

		return Object.keys(this._sources);

	}

};