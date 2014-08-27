/*
DANGER! This file is haunted by ghosts, monsters and aliens!
Access limited to qualified personnel only!

This is the underground of the Lava framework.
Get out of here, if you don't want your brain to be eaten!
P.S.
Have you seen the skeleton? It's there! (use the search spell: Ctrl+F 'skeleton')
*/

/*
directory (short) // for the navigation tree
	type: 'folder',
	name
	title
	children: [] // array or short directory and class descriptors

objects and classes (short)  // for the navigation tree
	type: 'class',
	name // full class name
	title // short class name
	[file_path] // full path, "src/...". some objects do not have paths
	[file_name] // name with extension
	description // short summary, from class comment

	// class
	has_implements: bool
	'extends' // full class name
	implements // full class name
	extends_chain = []
		extends = string // full class name
		implements = [<string>] // list of full class names
	is_mixin: bool

objects and classes (extended) // page content
	description // long description, from file
	method_chain = []
		class_name // CLASS ONLY. the class in which these methods were defined
		is_mixin // CLASS ONLY. the owner class is mixin (name starts with "Lava.mixin.*")
		is_implements // CLASS ONLY. if the block was implemented via Implements directive
		descriptors = [<member_descriptor>]
	member_chain = []
		// same format as method_chain
	events = [] // same as in JSDoc export task
	properties: [] // widgets only
		name
		description
		lava_type // the name from Lava.types
		is_nullable
		is_non_nullable
		is_private
		default_value
	config_options = []
		// method params from JSDoc export

member descriptor:
	// for objects
	name
	description
	type // 'function' || 'member'
	is_private // name starts with '_'

	// for classes
	is_inherited // all members, that are not defined in current class, are marked as inherited.
	is_overridden // when member in parent class is overridden with member in child class, the child member receives this flag
	is_implemented // NOT inherited. ember belongs to implemented class
	is_from_mixin // NOT inherited. Indicates, that the member came from mixin class (from Lava.mixin.*).
	belongs // the last class in chain which has overridden this member
	defined // INHERITED. The class which originally defined the member.

	// for methods
	param_names_string // string with a comma-separated list of parameter names
	params // taken from exported JSDoc block
	returns // taken from exported JSDoc block

	// for member
	is_nullable: bool // INHERITED
	is_non_nullable: bool // INHERITED
	is_constant: bool // INHERITED
	is_shared: bool // INHERITED. CLASSES ONLY.
	default_value // is taken from actual code, not from JSDoc comment
	type_names // taken from JSDoc block

 */

var ApiHelper = require('../ApiHelper.js');

module.exports = function(grunt) {

	grunt.registerTask('buildDoc', function() {

		// export Lava and Firestorm. remove members, which should be hidden
		function exportGlobalContainer(src_object, object_name) {
			var export_object = Firestorm.Object.copy(src_object);
			jsdoc_ignored[object_name].forEach(function(name){
				delete export_object[name];
			});
			return exportGlobalObject(object_name, export_object);
		}

		function postProcessGlobalObject(extended_object_descriptor) {
			processDescription(extended_object_descriptor);
			if (extended_object_descriptor.method_chain) {
				extended_object_descriptor.method_chain[0].descriptors.forEach(function(method_descriptor){
					processDescription(method_descriptor);
					if (method_descriptor.returns) processDescription(method_descriptor.returns);
					if (method_descriptor.params) method_descriptor.params.forEach(function(param) {
						processDescription(param);
					});
				})
			}
			if (extended_object_descriptor.member_chain) {
				extended_object_descriptor.member_chain[0].descriptors.forEach(function(property_descriptor){
					processDescription(property_descriptor);
				})
			}
		}

		function groupByName(array) {
			var i = 0, count = array.length, result = {};
			for (; i < count; i++) {
				result[array[i].name] = array[i];
			}
			return result;
		}

		var objects_with_processed_description = [];
		function processDescription(descriptor) {
			if (descriptor.description && objects_with_processed_description.indexOf(descriptor) == -1) {
				descriptor.description = LavaBuild.processMarkdown(descriptor.description);
				objects_with_processed_description.push(descriptor);
			}
		}

		function inheritDescription(child_object, parent_object, parent_belongs) {

			if (child_object.description) {
				if (parent_object.description) {
					child_object.description += '\n\n<b class="doc-parent-description-header">Description from ' + parent_belongs + ':</b>\n'
						+ parent_object.description;
				}
			} else if (parent_object.description) {
				child_object.description = parent_object.description;
			}

		}

		// when child and parent method has JSDoc comment, but child is missing some subparameters.
		// find the parent with longest path and insert new parameter after it
		function insertMissingParameter(destination, parameter) {
			var last_parent_index = -1;
			var longest_path_length = 0;
			for (var _i = 0, _count = destination.length; _i < _count; _i++) {
				if (parameter.name.indexOf(destination[_i].name) == 0) {
					if (longest_path_length <= destination[_i].name.length) {
						longest_path_length = destination[_i].name.length;
						last_parent_index = _i;
					}
				}
			}
			if (last_parent_index != -1) {
				destination.splice(last_parent_index + 1, 0, parameter);
			} else {
				destination.push(parameter);
			}
		}

		function inheritMemberDocs(child_descriptor, parent_descriptor) {

			if (child_descriptor.type != parent_descriptor.type) throw new Error();
			child_descriptor.defined = parent_descriptor.defined;

			inheritDescription(child_descriptor, parent_descriptor, parent_descriptor.belongs);
			//if (parent_descriptor.is_from_mixin) child_descriptor.is_from_mixin = true;

			if (child_descriptor.type == 'function') {

				if (parent_descriptor.returns) {
					if (!child_descriptor.returns) {
						child_descriptor.returns = parent_descriptor.returns;
					} else {
						inheritDescription(child_descriptor.returns, parent_descriptor.returns, parent_descriptor.belongs);
						ApiHelper.importVars(child_descriptor.returns, parent_descriptor.returns, ['is_nullable', 'is_non_nullable', 'type_names']);
					}
				}

				// JSDoc export task already checks that if the JSDoc comment is present - it has proper count of parameters
				// and they are listed in the right order
				if (parent_descriptor.params) {
					if (!child_descriptor.params) {
						child_descriptor.params = parent_descriptor.params.slice();
					} else {

						// parameters may be listed in wrong/different order
						var child_hash = groupByName(child_descriptor.params);
						var parent_hash = groupByName(parent_descriptor.params);
						for (var name in parent_hash) {
							if (!(name in child_hash)) {
								if (child_hash[name].name.indexOf('.') == -1) throw new Error('Child member must have all parameters from parent: ' + child_hash[name]);
								insertMissingParameter(child_descriptor.params, child_hash[name]);
							} else {
								inheritDescription(child_hash[name], parent_hash[name], parent_descriptor.belongs);
								ApiHelper.importVars(child_hash[name], parent_hash[name], ['default_value','type_names','is_nullable','is_non_nullable','is_optional','is_variable']);
							}
						}

					}
				}

			} else {

				ApiHelper.importVars(child_descriptor, parent_descriptor, ['default_value','type_names','is_nullable','is_non_nullable','is_shared','is_constant']);

			}

		}

		function buildMemberDocs(cd) {

			var skeleton = cd.skeleton,
				source_object = cd.source_object,
				result = {},
				longname,
				is_mixin = (cd.path.indexOf('Lava.mixin.') == 0),
				member_descriptor;

			for (var name in source_object) { // leave only own members

				if (name in skeleton) { // name may be a directive, like Shared or Extends

					longname = cd.path + '#' + name;
					var jsdoc_descriptor = getJSDocDescriptor(longname, (skeleton[name].type == 'function'));

					member_descriptor = {
						name: name,
						belongs: cd.path, // if the member is overridden - this is set to the overriding class
						defined: cd.path, // the first class in inheritance chain, where the member was defined. Never changes.
						is_private: name[0] == '_',
						type: (skeleton[name].type == 'function') ? 'function' : 'member'
					};
					if (is_mixin) member_descriptor.is_from_mixin = true;

					if (member_descriptor.type == 'function') {

						if (jsdoc_descriptor.kind != 'function') throw new Error('jsdoc descriptor: function expected, got :' + jsdoc_descriptor.kind);

						ApiHelper.importVars(member_descriptor, jsdoc_descriptor, ['params', 'param_names_string', 'returns', 'description']);

					} else {

						if (['member', 'constant'].indexOf(jsdoc_descriptor.kind) == -1) throw new Error('jsdoc descriptor: member expected, got :' + jsdoc_descriptor.kind);

						// currently, we take the default value from actual code, rather than JSDoc comment
						if ('default_value' in jsdoc_descriptor) {
							//descriptor.default = jsdoc_descriptor.default_value;
							throw new Error('TODO buildDoc: member with default value in import data: ' + longname);
						}
						var is_empty = skeleton[name].is_empty || (skeleton[name].type == 'object' && Firestorm.Object.isEmpty(skeleton[name].skeleton));
						ApiHelper.setDefaultValue(member_descriptor, skeleton[name].type, skeleton[name].value, is_empty);

						ApiHelper.importVars(member_descriptor, jsdoc_descriptor, ['is_nullable', 'is_non_nullable', 'type_names', 'is_constant', 'description']);

					}

					if (name in result) throw new Error();
					result[name] = member_descriptor;

				}

			}

			if (source_object.Shared) {

				var shared_list = typeof(source_object.Shared) == 'string' ? [source_object.Shared] : source_object.Shared;
				shared_list.forEach(function(name) {

					if (!(name in source_object)) throw new Error();

					longname = cd.path + '#' + name;
					var jsdoc_descriptor = getJSDocDescriptor(longname, false);
					if (['member', 'constant'].indexOf(jsdoc_descriptor.kind) == -1) throw new Error('jsdoc descriptor: member expected, got :' + jsdoc_descriptor.kind);

					member_descriptor = {
						name: name,
						belongs: cd.path,
						defined: cd.path,
						is_private: name[0] == '_',
						type: 'member',
						is_shared: true
					};
					if (is_mixin) member_descriptor.is_from_mixin = true;

					if ('default_value' in jsdoc_descriptor) {
						//descriptor.default = jsdoc_descriptor.default_value;
						throw new Error('TODO buildDoc: member with default value in import data: ' + skeleton.path + '#' + name);
					}
					if (Firestorm.Object.isEmpty(cd.shared[name])) {
						member_descriptor.default_value = '<span class="api-highlight-empty">{ }</span>';
					} else {
						member_descriptor.default_value = '<span class="api-highlight-gray">{ ... }</span>';
					}

					ApiHelper.importVars(member_descriptor, jsdoc_descriptor, ['is_nullable', 'is_non_nullable', 'type_names', 'description']);

					if (name in result) throw new Error();
					result[name] = member_descriptor;

				});

			}

			for (name in result) {
				var last_dot_index = cd.path.lastIndexOf('.');
				var title = cd.path + '#' + name;
				if (last_dot_index != -1) {
					title = cd.path.substr(last_dot_index + 1) + '#' + name;
				}
				LavaBuild.registerLink(cd.path + '#' + name, { // the name in {@link} directives
					hash: 'class=' + cd.path + ';member=' + name, // the hash in browser
					page: 'api',
					title: title,
					type: 'member'
				});
			}

			return result;

		}

		// short descriptors for classes (Lava.define). full_class_name => descriptor
		var class_descriptors = {};
		var extended_class_descriptors = {};

		function create_docs(path) {

			var cd = Lava.ClassManager.getClassData(path),
				member_descriptors_hash = buildMemberDocs(cd),
				short_class_descriptor = class_descriptors[path],
				extended_class_descriptor = {},
				parent_class_ext_descriptor;

			extended_class_descriptors[path] = extended_class_descriptor;

			if (grunt.file.exists('build/api_docs/' + path + '.md')) {
				extended_class_descriptor.description = grunt.file.read('build/api_docs/' + path + '.md'); // long description, 'remarks'
			}

			var current_class_member_docs_block = {
				class_name: cd.path,
				descriptors_hash: member_descriptors_hash
			};

			if (cd.extends) {

				if (exported_paths.indexOf(cd.extends) == -1) create_docs(cd.extends);

				var short_parent_descriptor = class_descriptors[cd.extends];
				short_class_descriptor.extends = cd.extends;
				///////////////////////////////
				// section: build extends_chain
				short_class_descriptor.extends_chain = short_parent_descriptor.extends_chain ? short_parent_descriptor.extends_chain.slice() : [];
				var extends_block = {
					extends: cd.extends
				};
				if (short_parent_descriptor.implements) {
					extends_block.implements = typeof(short_parent_descriptor.implements) == 'string'
						? [short_parent_descriptor.implements]
						: short_parent_descriptor.implements;
				}
				short_class_descriptor.extends_chain.unshift(extends_block);
				// end: build extends_chain
				///////////////////////////////
				if (short_parent_descriptor.has_implements || short_class_descriptor.implements) short_class_descriptor.has_implements = true;

				parent_class_ext_descriptor = extended_class_descriptors[cd.extends];

			}

			extended_class_descriptor.doc_chain = [current_class_member_docs_block];

			if (cd.implements) {
				cd.implements.forEach(function(name) {
					if (exported_paths.indexOf(name) == -1) create_docs(name);
					var implements_ext_descriptor = extended_class_descriptors[name];
					var implements_members_hash = {};
					implements_ext_descriptor.doc_chain.forEach(function(member_docs_block){
						Firestorm.extend(implements_members_hash, member_docs_block.descriptors_hash);
					});
					extended_class_descriptor.doc_chain.push({
						class_name: name,
						is_implements: true,
						descriptors_hash: implements_members_hash
					})
				})
			}

			// inherit member documentation
			if (cd.extends) {

				// copy inheritance blocks from parent's class and filter them to hide overridden members
				parent_class_ext_descriptor.doc_chain.forEach(function(doc_block) {
					doc_block = Firestorm.Object.copy(doc_block);
					extended_class_descriptor.doc_chain.push(doc_block);
					doc_block.descriptors_hash = Firestorm.Object.copy(doc_block.descriptors_hash);
				});

			}

			var overridden_parent_docs = {};
			var tail = extended_class_descriptor.doc_chain.slice();
			tail.shift(); // remove class' own members
			tail.forEach(function(doc_block) {
				for (var name in member_descriptors_hash) {
					if (name in doc_block.descriptors_hash) {

						if (name == 'init' && doc_block.class_name == 'Lava.mixin.Properties') {
							delete doc_block.descriptors_hash[name]; // hash was copied
							continue;
						}

						// if member is present in child class - hide it from inherited members
						// (!) may overwrite mixin members with inherited ones (intended behaviour)
						overridden_parent_docs[name] = doc_block.descriptors_hash[name];
						delete doc_block.descriptors_hash[name]; // hash was copied
						// set 'overridden' flag to the local member descriptor
						member_descriptors_hash[name].is_overridden = true;
						// if (doc_block.is_implements) member_descriptors_hash[name].is_implemented = true;
					}
				}
			});

			for (var name in overridden_parent_docs) {
				inheritMemberDocs(member_descriptors_hash[name], overridden_parent_docs[name]);
			}

			exported_paths.push(path);

			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// describe _properties

			if (cd.hierarchy_paths.indexOf('Lava.widget.Standard') != -1) {
				var proeprties_skeleton = cd.skeleton._properties.skeleton;
				var property_descriptors = cd.shared._property_descriptors;
				var properties_export = {};
				for (name in proeprties_skeleton) {
					var longname = path + '#_properties.' + name;
					var export_descriptor = {
						name: name
					};
					if (name[0] == '_') export_descriptor.is_private = true;
					var is_empty = proeprties_skeleton[name].is_empty || (proeprties_skeleton[name].type == 'object' && Firestorm.Object.isEmpty(proeprties_skeleton[name].skeleton));
					ApiHelper.setDefaultValue(export_descriptor, proeprties_skeleton[name].type, proeprties_skeleton[name].value, is_empty);

					if (longname in jsdoc_data) {
						var jsdoc_descriptor = getJSDocDescriptor(longname, false);
						ApiHelper.importVars(export_descriptor, jsdoc_descriptor, ['description', 'type_names']);
					}

					if (name in property_descriptors) {
						if (property_descriptors[name].type) export_descriptor.lava_type = property_descriptors[name].type;
						if (property_descriptors[name].is_nullable) export_descriptor.is_nullable = true;
					}
					if (!export_descriptor.is_nullable) export_descriptor.is_non_nullable = true; // properties are non-nullable by default
					properties_export[name] = export_descriptor;
				}
				if (!Firestorm.Object.isEmpty(properties_export)) {
					extended_class_descriptor.properties_hash = properties_export;
				}
			}

			if (parent_class_ext_descriptor && extended_class_descriptor.properties_hash) {
				for (name in parent_class_ext_descriptor.properties_hash) {

					if (!(name in extended_class_descriptor.properties_hash)) throw new Error();
					var child_ext_descriptor = extended_class_descriptor.properties_hash[name];
					var parent_ext_descriptor = parent_class_ext_descriptor.properties_hash[name];
					inheritDescription(child_ext_descriptor, parent_ext_descriptor, cd.extends);
					if (!child_ext_descriptor.lava_type && !child_ext_descriptor.type_names) {
						if (parent_ext_descriptor.lava_type) {
							child_ext_descriptor.lava_type = parent_ext_descriptor.lava_type;
						} else if (parent_ext_descriptor.type_names) {
							child_ext_descriptor.type_names = parent_ext_descriptor.type_names;
						}
					}
					// nullable flags will be inherited by class manager
				}
			}

			// end
			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// attach widget names associated with this controller (exported drom buildSugar task)
			if (global.associated_widgets_by_controller[path]) extended_class_descriptor.associated_widgets = global.associated_widgets_by_controller[path];

		}

		var root = []; // root of the navigation tree. Contains descriptors for folders and classes
		var directories_by_path = {};

		function get_data_dir(path) {
			var dirname = path.join('/');
			if (!(dirname in directories_by_path)) {
				directories_by_path[dirname] = {
					type: 'folder',
					name: path[path.length - 1],
					title: path[path.length - 1],
					children: []
				};
				if (path.length > 1) {
					var parent_path = path.slice();
					parent_path.pop();
					var parent = get_data_dir(parent_path);
					parent.children.push(directories_by_path[dirname]);
				} else { // ==1
					root.push(directories_by_path[dirname]);
				}
			}
			return directories_by_path[dirname];
		}

		function exportGlobalObject(source_object_name, source_object, file_path) {

			var short_descriptor = {
				type: 'object',
				name: source_object_name,
				title: null
			};
			short_descriptor.title = (source_object_name.indexOf('.') != -1)
				? source_object_name.split('.').pop()
				: source_object_name;

			if (file_path) {
				short_descriptor.file_path = file_path;
				short_descriptor.file_name = file_path.split('/').pop();
			}

			var jsdoc_descriptor = getJSDocDescriptor(source_object_name, false);
			if (jsdoc_descriptor.description) short_descriptor.description = jsdoc_descriptor.description;

			var extended_descriptor = {};
			var property_descriptors = [];
			var method_descriptors = [];

			if (grunt.file.exists('build/api_docs/' + source_object_name + '.md')) {
				extended_descriptor.description = grunt.file.read('build/api_docs/' + source_object_name + '.md'); // long description, 'remarks'
			}

			for (var name in source_object) {

				var longname = source_object_name + '.' + name;
				jsdoc_descriptor = getJSDocDescriptor(longname, (typeof(source_object[name]) == 'function'));

				var member_descriptor = {
					name: name,
					is_private: name[0] == '_',
					type: (typeof(source_object[name]) == 'function') ? 'function' : 'member'
				};

				if (member_descriptor.type == 'function') {

					ApiHelper.importVars(member_descriptor, jsdoc_descriptor, ['params', 'param_names_string', 'returns', 'description']);
					method_descriptors.push(member_descriptor);

				} else {

					if (['member', 'constant'].indexOf(jsdoc_descriptor.kind) == -1) throw new Error('jsdoc descriptor: member expected, got :' + jsdoc_descriptor.kind);

					// currently, we take the default value from actual code, rather than JSDoc comment
					if ('default_value' in jsdoc_descriptor) {
						//descriptor.default = jsdoc_descriptor.default_value;
						throw new Error('TODO buildDoc: member with default value in import data: ' + longname);
					}

					ApiHelper.setDefaultFromValue(member_descriptor, source_object[name]);
					ApiHelper.importVars(member_descriptor, jsdoc_descriptor, ['is_nullable', 'is_non_nullable', 'type_names', 'is_constant', 'description']);

					property_descriptors.push(member_descriptor);

				}

				if (property_descriptors.length) {
					extended_descriptor.member_chain = [{
						descriptors: Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](property_descriptors, function(a, b) {
							return a.name < b.name;
						})
					}];
				}

				if (method_descriptors.length) {
					extended_descriptor.method_chain = [{
						descriptors: Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](method_descriptors, function(a, b) {
							return a.name < b.name;
						})
					}];
				}

				var last_dot_index = source_object_name.lastIndexOf('.');
				var title = source_object_name + '.' + name;
				if (last_dot_index != -1) {
					title = source_object_name.substr(last_dot_index + 1) + '.' + name;
				}
				LavaBuild.registerLink(longname, {
					hash: 'class=' + source_object_name + ';member=' + name,
					page: 'api',
					title: title,
					type: 'member'
				});

			}

			return {
				short_descriptor: short_descriptor,
				extended_descriptor: extended_descriptor
			}

		}

		var schema_export = {};
		function exportSchemaPaths(schema_object, path) {
			for (var name in schema_object) {
				if (Firestorm.getType(schema_object[name]) == 'object') {
					exportSchemaPaths(schema_object[name], path ? (path + '.' + name) : name);
				} else {
					schema_export[path ? (path + '.' + name) : name] = schema_object[name];
				}
			}
		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			if (!global.Lava) {
				require('../temp/lava_module.js');
			}
			var Lava = global.Lava,
				Firestorm = global.Firestorm,
				LavaBuild = global.LavaBuild,
				fs = require('fs'),
				groups = grunt.config('js_files'),
				filelist = groups['classes'].concat(groups['widgets']),
				support_names = [];

			// ensure that previous task was run just before this one
			if ((+new Date(fs.statSync('build/temp/jsdoc_classes_export.js').mtime)) - (+new Date()) > 5000) throw new Error('jsdocExport task was not run?');
			var jsdoc_data = eval('(' + grunt.file.read('build/temp/jsdoc_classes_export.js') + ')');
			var jsdoc_ignored = eval('(' + grunt.file.read('build/temp/jsdoc_ignored_export.js') + ')');

			var support_links = eval('(' + grunt.file.read('build/temp/jsdoc_support_links_export.js') + ')');
			support_links.forEach(function(link_data){
				LavaBuild.registerLink(link_data.title, link_data);
				support_names.push(link_data.title);
			});

			var getJSDocDescriptor = function(longname, is_function) {
				if (!(longname in jsdoc_data)) throw new Error('JSDoc descriptor is missing for ' + longname);
				if (jsdoc_data[longname].kind == 'function' ^ is_function) {
					if (longname.indexOf('Lava.algorithms.sorting.') != 0) throw new Error('doclet is different kind for: ' + longname);
				}
				return jsdoc_data[longname];
			};

			filelist.forEach(function(file_path){

				if (file_path.substr(-9) != '.class.js') throw new Error();
				var path = file_path.substr(0, file_path.length - 9).split('/'), // substr to cut extension
					filename = path.pop();

				var short_descriptor = {
					type: 'class',
					name: path.length ? ('Lava.' + path.join('.').toLowerCase() + '.' + filename) : 'Lava.' + filename,
					title: filename,
					file_path: file_path,
					file_name: filename + '.class.js'
					//has_implements: null
					//'extends': null,
					//implements: null,
					//extends_chain: null // Array.<{extends:string, implements: []}>
					//description: null // this is short description, from class comment.
				};
				short_descriptor.is_mixin = short_descriptor.name.indexOf('Lava.mixin.') == 0;
				class_descriptors[short_descriptor.name] = short_descriptor;

				if (path.length) {
					var parent_dir = get_data_dir(path);
					parent_dir.children.push(short_descriptor);
				} else {
					root.push(short_descriptor);
				}

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				// check the correctness of file content. Wrong JSDoc comments may result in very unwanted consequences.

				var file_content = grunt.file.read('src/' + file_path),
					// match Lava.define with the comment before the class
					// [1] = class name
					// [2] = comment
					matches = file_content.match(/Lava\.define\(\s*[\'\"]([^\'\"]+)[\'\"]\,\s*(\/\*\*[\s\S]+?\*\/)\s*\{/);

				if (!matches) throw new Error('Doc: wrong content format in ' + file_path + '. Must contain Lava.define with JSDoc comment');
				if (matches[1] != short_descriptor.name) throw new Error('[Doc] class name does not match the file name: ' + file_path);

				var comment = matches[2];
				if (comment.indexOf('* @lends ' + short_descriptor.name + '#') == -1) throw new Error('[Doc] missing or malformed @lends tag: ' + file_path);

				// JSDoc does not make doclets for the objects, which are passed to Lava.define()
				// match any text before the first JSDoc @tag
				matches = comment.match(/\/\*\*([\s\S]+?)[\r\n]\s+\*\s\@[a-zA-Z\_]+\s/);
				if (matches && /[a-zA-Z]/.test(matches[1])) {
					// if there is text - remove asterisks
					short_descriptor.description = matches[1].replace(/[\r\n]+\s+\*\s?/, function() {
						return '\r\n';
					});
				} else {
					if (/[a-zA-Z]/.test(comment.substr(0, comment.indexOf('@')))) throw new Error('Malformed class description: ' + file_path);
				}

				var cd = Lava.ClassManager.getClassData(short_descriptor.name);
				var source_object = cd.source_object;
				if (('Extends' in source_object) && comment.indexOf('* @extends ' + source_object.Extends) == -1) {
					throw new Error('[Doc] missing or malformed @extends tag: ' + file_path + '. Expecting: * @extends ' + source_object.Extends);
				}
				if ('Implements' in source_object) {
					short_descriptor.implements = typeof(source_object.Implements) == 'string' ? [source_object.Implements] : source_object.Implements;
					short_descriptor.implements.forEach(function(name) {
						if (comment.indexOf('* @extends ' + name) == -1) throw new Error('[Doc] expecting @extends tag for implemented class: ' + file_path + '. Expecting: * @extends ' + name);
					})
				}

				//grunt.file.write('www/api/' + name + '.src.html', LavaBuild.highlight('javascript', file_content));

				// end: check correctness
				////////////////////////////////////////////////////////////////////////////////////////////////////////

			});

			var exported_paths = [];
			for (var class_name in class_descriptors) {

				if (exported_paths.indexOf(class_name) == -1) {
					create_docs(class_name);
				}

			}

			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// build objects

			var global_object_names = [
				'Lava.ClassManager',
				'Lava.Core',
				'Lava.Cron',
				'Lava.ScopeManager',
				'Lava.Serializer',
				'Lava.TemplateWalker',
				'Lava.parsers.Common',
				'Lava.parsers.Directives',
				'Lava.extenders',
				'Lava.modifiers',
				'Lava.resources',
				'Lava.transitions',
				'Lava.types',
				'Lava.schema',
				'Lava.ObjectParser',
				'Lava.ExpressionParser',
				'Lava.TemplateParser'
			];

			var global_object_filenames = [];
			for (i = 0, count = global_object_names.length; i < count; i++) {
				global_object_filenames[i] = global_object_names[i].replace('.parsers.', '.Parsers.').replace('Lava.', 'src/').replace('.', '/').replace(/\/(.*?Parser)$/, function(match, parser_name) {
					return '/Parsers/' + parser_name;
				}) + '.js';
			}

			exportSchemaPaths(Lava.schema, ''); // will populate the schema_export variable
			var lava_schema_export = schema_export;
			schema_export = {};

			var global_objects = [
				Lava.ClassManager,
				Lava.Core,
				Lava.Cron,
				Lava.ScopeManager,
				Lava.Serializer,
				Lava.TemplateWalker,
				Lava.parsers.Common,
				Lava.parsers.Directives,
				Lava.extenders,
				Lava.modifiers,
				Lava.resources,
				Lava.transitions,
				Lava.types,
				lava_schema_export,
				{
					'yy.valid_globals': Lava.ObjectParser.yy.valid_globals
				},
				{
					SEPARATORS: Lava.ExpressionParser.SEPARATORS,
					parseRaw: Lava.ExpressionParser.parseRaw,
					parse: Lava.ExpressionParser.parse,
					parsePath: Lava.ExpressionParser.parsePath,
					parseWithTailRaw: Lava.ExpressionParser.parseWithTailRaw,
					parseWithTail: Lava.ExpressionParser.parseWithTail,
					parseScopeEval: Lava.ExpressionParser.parseScopeEval
				},
				{
					parse: Lava.TemplateParser.parse,
					parseRaw: Lava.TemplateParser.parseRaw,
					'yy.CONTROL_ATTRIBUTE_PREFIX': Lava.TemplateParser.yy.CONTROL_ATTRIBUTE_PREFIX
				}
			];

			var global_object_extended_descriptors = {};
			var global_object_short_descriptors = {};
			for (var i = 0, count = global_object_names.length; i < count; i++) {
				var temp = exportGlobalObject(global_object_names[i], global_objects[i], global_object_filenames[i]);
				if (global_object_names[i].indexOf('.parsers.') != -1 || global_object_names[i].substr(-6) == 'Parser') {
					get_data_dir(['Parsers']).children.push(temp.short_descriptor);
				} else {
					root.push(temp.short_descriptor);
				}
				global_object_short_descriptors[temp.short_descriptor.name] = temp.short_descriptor;
				global_object_extended_descriptors[temp.short_descriptor.name] = temp.extended_descriptor;
			}

			temp = exportGlobalContainer(Lava, 'Lava', 'src/Lava.js');
			root.push(temp.short_descriptor);
			global_object_extended_descriptors[temp.short_descriptor.name] = temp.extended_descriptor;
			global_object_short_descriptors[temp.short_descriptor.name] = temp.short_descriptor;

			temp = exportGlobalObject('Lava.algorithms.sorting', Lava.algorithms.sorting);
			var dir = get_data_dir(['Algorithms']);
			dir.children.push(temp.short_descriptor);
			global_object_extended_descriptors[temp.short_descriptor.name] = temp.extended_descriptor;
			global_object_short_descriptors[temp.short_descriptor.name] = temp.short_descriptor;

			// end build objects
			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// build Firestorm docs

			exportSchemaPaths(Firestorm.schema, '');
			var firestorm_schema_export = schema_export;
			schema_export = {};

			var firestorm_export_object_names = [
				'Firestorm.Environment',
				'Firestorm.Element',
				'Firestorm.DOM',
				'Firestorm.Array',
				'Firestorm.String',
				'Firestorm.Object',
				'Firestorm.Date',
				'Firestorm.schema'
			];

			var firestorm_export_objects = [
				Firestorm.Environment,
				Firestorm.Element,
				Firestorm.DOM,
				Firestorm.Array,
				Firestorm.String,
				Firestorm.Object,
				Firestorm.Date,
				firestorm_schema_export
			];

			var firestorm_nav_root = [];
			var firestorm_extended_descriptors = {};
			for (i = 0, count = firestorm_export_object_names.length; i < count; i++) {

				temp = exportGlobalObject(firestorm_export_object_names[i], firestorm_export_objects[i], 'src/' + firestorm_export_object_names[i].replace('.', '/'));
				firestorm_nav_root.push(temp.short_descriptor);
				firestorm_extended_descriptors[temp.short_descriptor.name] = temp.extended_descriptor;

			}

			temp = exportGlobalContainer(Firestorm, 'Firestorm', 'src/Firestorm.js');
			firestorm_nav_root.push(temp.short_descriptor);
			firestorm_extended_descriptors[temp.short_descriptor.name] = temp.extended_descriptor;

			firestorm_nav_root = Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](firestorm_nav_root, function(a, b) {
				return a.title < b.title;
			});
			// end export Firestorm
			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////
			// sort navigation tree
			function sortDataTree(array) {
				array.forEach(function(value) {
					if (value.type == 'folder' && value.children) value.children = sortDataTree(value.children);
				});
				return Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](array, function(a, b) {
					if (a.type != b.type) {
						return a.type == 'folder';
					}
					return a.title < b.title;
				});
			}
			root = sortDataTree(root);
			// end sort
			////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////
			// load and attach events

			// full class name => [<event>]
			var jsdoc_events = eval('(' + grunt.file.read('build/temp/jsdoc_events_export.js') + ')');
			for (name in jsdoc_events) {
				if (!(name in extended_class_descriptors)) throw new Error();
				extended_class_descriptors[name].events = jsdoc_events[name];
				extended_class_descriptors[name].events.forEach(function(event_descriptor){
					LavaBuild.registerLink(name + '#event:' + event_descriptor.name, {
						hash: 'class=' + name + ';event=' + event_descriptor.name,
						page: 'api',
						title: event_descriptor.name,
						type: 'event'
					});
				});
			}

			// end: load and attach events
			////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////
			// final stage: format descriptions and write data.
			// this must be done after all links are known

			for (var name in extended_class_descriptors) {

				var extended_class_descriptor = extended_class_descriptors[name];
				processDescription(extended_class_descriptor); // long class description, 'remarks'

				var method_chain = [];
				var member_chain = [];
				var is_inherited = false;

				extended_class_descriptor.doc_chain.forEach(function(members_block){

					var members = [],
						methods = [],
						class_name = members_block.class_name,
						is_mixin_block = (class_name.indexOf('Lava.mixin.') == 0),
						descriptor;

					for (var descriptor_name in members_block.descriptors_hash) {
						descriptor = members_block.descriptors_hash[descriptor_name];
						processDescription(descriptor);
						descriptor = Firestorm.Object.copy(descriptor);
						if (is_inherited) descriptor.is_inherited = true;
						if (members_block.is_implements) descriptor.is_implemented = true;
						if (descriptor.type == 'function') {
							methods.push(descriptor);
							if (descriptor.returns) processDescription(descriptor.returns);
							if (descriptor.params) {
								descriptor.params.forEach(function(param) {
									processDescription(param);
								});
								if (descriptor.name == 'init') {
									var config_options = [];
									var new_params = [];
									descriptor.params.forEach(function(param) {
										if (param.name.indexOf('config.') == 0) {
											config_options.push(param);
										} else {
											new_params.push(param);
										}
									});
									descriptor.params = new_params;
									if (config_options.length) extended_class_descriptor.config_options = config_options;
								}
							}
						} else {
							members.push(descriptor);
						}
					}

					if (methods.length) {
						methods = Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](methods, function(a, b) {
							if (a.is_private != b.is_private) {
								return b.is_private;
							}
							return a.name < b.name;
						});
						var method_block = {
							class_name: class_name,
							descriptors: methods
						};
						if (is_mixin_block) method_block.is_mixin = true;
						if (members_block.is_implements) method_block.is_implemented = true;
						method_chain.push(method_block);
					}

					if (members.length) {
						members = Lava.algorithms.sorting[Lava.schema.data.DEFAULT_SORT_ALGORITHM](members, function(a, b) {
							if (a.is_private != b.is_private) {
								return b.is_private;
							}
							return a.name < b.name;
						});
						var member_block = {
							class_name: class_name,
							descriptors: members
						};
						if (is_mixin_block) member_block.is_mixin = true;
						if (members_block.is_implements) member_block.is_implemented = true;
						member_chain.push(member_block);
					}

					is_inherited = true;

				});

				delete extended_class_descriptor.doc_chain;
				if (method_chain.length) extended_class_descriptor.method_chain = method_chain;
				if (member_chain.length) extended_class_descriptor.member_chain = member_chain;

				if (extended_class_descriptor.events) {
					extended_class_descriptor.events.forEach(function(event_descriptor){
						processDescription(event_descriptor);
						if (event_descriptor.params) {
							event_descriptor.params.forEach(function(param_descriptor){
								processDescription(param_descriptor);
							})
						}
					});
				}

				if (extended_class_descriptor.properties_hash) {
					var properties_result = [];
					for (var property_name in extended_class_descriptor.properties_hash) {
						properties_result.push(extended_class_descriptor.properties_hash[property_name]);
						processDescription(extended_class_descriptor.properties_hash[property_name]);
					}
					extended_class_descriptor.properties = properties_result;
					delete extended_class_descriptor.properties_hash;
				}

				if (class_descriptors[name].extends) {
					var parent_extended_descriptor = extended_class_descriptors[class_descriptors[name].extends];
					if (parent_extended_descriptor.events) {
						if (!extended_class_descriptor.events) extended_class_descriptor.events = [];
						extended_class_descriptor.events = extended_class_descriptor.events.concat(parent_extended_descriptor.events);
					}
				}

				grunt.file.write('www/api/' + name + '.js', JSON.stringify(extended_class_descriptor));

			}

			for (name in class_descriptors) {
				processDescription(class_descriptors[name]); // short class description
			}

			grunt.file.write('www/js/api_tree.js', 'var api_tree_source = ' + JSON.stringify(root));
			grunt.file.write('www/js/firestorm_api_tree.js', 'var firestorm_api_tree_source = ' + JSON.stringify(firestorm_nav_root));

			for (name in global_object_short_descriptors) {
				processDescription(global_object_short_descriptors[name]);
			}

			for (name in global_object_extended_descriptors) {
				postProcessGlobalObject(global_object_extended_descriptors[name]);
				grunt.file.write('www/api/' + name + '.js', JSON.stringify(global_object_extended_descriptors[name]));
			}

			for (i = 0, count = firestorm_nav_root.length; i < count; i++) {
				processDescription(firestorm_nav_root[i]);
			}

			for (name in firestorm_extended_descriptors) {
				postProcessGlobalObject(firestorm_extended_descriptors[name]);
				grunt.file.write('www/api/' + name + '.js', JSON.stringify(firestorm_extended_descriptors[name]));
			}

			//
			////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// build reference

//			var names = grunt.file.expand('./build/reference/**/*.md');
//			for (i = 0, count = names.length; i < count; i++) {
//				var content = grunt.file.read(names[i]);
//				//grunt.file.write('./www/reference/' + names[i].substr(0, names[i].length - 3) + '.html', marked(content));
//			}

			// end: build reference
			////////////////////////////////////////////////////////////////////////////////////////////////////////////

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};