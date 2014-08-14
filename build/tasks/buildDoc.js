
/*
directory (short) // for the navigation tree
	type: 'folder',
	name
	title
	children: [] // array or short directory and class descriptors

class (short)  // for the navigation tree
	type: 'class',
	name // full class name
	title // short class name
	file_path
	file_name
	has_implements: bool
	'extends' // full class name
	implements // full class name
	extends_chain = []
		extends = string // full class name
		implements = [<string>] // list of full class names
	description // short summary, from class comment.
	is_mixin: bool
	has_implements: bool

class (extended) // page content
	description // long description, from file
	method_chain = []
		class_name // the class in which these methods were defined
		is_mixin // the owner class is mixin (name starts with "Lava.mixin.*")
		is_implements // if the block was implemented via Implements directive
		descriptors = [<member_descriptor>]
	property_chain = []
		// same format as method_chain

member descriptor:
	name
	description
	type // 'function' || 'member'
	is_inherited // all members, that are not defined in current class, are marked as inherited.
	is_overridden // when member in parent class is overridden with member in child class, the child member receives this flag
	is_private // name starts with '_'
	is_implemented // NOT inherited. ember belongs to implemented class
	is_from_mixin // NOT inherited. Indicates, that the member came from mixin class (from Lava.mixin.*).
	belongs // the last class in chain which has overridden this member
	defined // INHERITED. The class which originally defined the member.

	// for function
	param_names_string // string with a comma-separated list of parameter names
	params // taken from exported JSDoc block
	returns // taken from exported JSDoc block

	// for member
	is_nullable: bool // INHERITED
	is_non_nullable: bool // INHERITED
	is_constant: bool // INHERITED
	is_shared: bool // INHERITED
	default_value // is taken from actual code, not from JSDoc comment
	type_names // taken from JSDoc block

 */

module.exports = function(grunt) {

	grunt.registerTask('buildDoc', function() {

		var jsdoc_data;

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

		function inheritMemberDocs(child_descriptor, parent_descriptor) {

			if (child_descriptor.type != parent_descriptor.type) throw new Error();
			child_descriptor.defined = parent_descriptor.defined;

			inheritDescription(child_descriptor, parent_descriptor, parent_descriptor.belongs);
			//if (parent_descriptor.is_from_mixin) child_descriptor.is_from_mixin = true;

			if (child_descriptor.type == 'function') {

				// @todo validity check: if parent has "returns" and inherited function has JSDoc block - than inherited member also must have "returns"
				// the following code does the merge, but does not check for JSDoc comment validity
				if (parent_descriptor.returns) {
					if (!child_descriptor.returns) {
						child_descriptor.returns = parent_descriptor.returns;
					} else {

						inheritDescription(child_descriptor.returns, parent_descriptor.returns, parent_descriptor.belongs);
						if (parent_descriptor.returns.is_nullable) child_descriptor.returns.is_nullable = true;
						if (!child_descriptor.returns.type_names && parent_descriptor.returns.type_names) {
							child_descriptor.returns.type_names = parent_descriptor.returns.type_names;
						}

					}
				}

				if (parent_descriptor.params) {
					if (!child_descriptor.params) {
						child_descriptor.params = parent_descriptor.params;
					} else {

						// parameters may be listed in wrong/different order
						var child_hash = groupByName(child_descriptor.params);
						var parent_hash = groupByName(parent_descriptor.params);
						for (var name in parent_hash) {
							if (!(name in child_hash)) throw new Error('doc: inherited function accepts less parameters than it should: ' + name);
							inheritDescription(child_hash[name], parent_hash[name], parent_descriptor.belongs);
							if (('default_value' in parent_hash[name]) && !('default_value' in child_hash[name])) {
								child_hash[name].default_value = parent_hash[name].default_value;
							}
							if (('type_names' in parent_hash[name]) && !('type_names' in child_hash[name])) {
								child_hash[name].type_names = parent_hash[name].type_names;
							}
							if (parent_hash[name].is_optional) child_hash[name].is_optional = true;
							if (parent_hash[name].is_nullable) child_hash[name].is_nullable = true;
							if (parent_hash[name].is_variable) child_hash[name].is_variable = true;
						}

					}
				}

			} else {

				if (('default_value' in parent_descriptor) && !('default_value' in child_descriptor)) {
					child_descriptor.default_value = parent_descriptor.default_value;
				}
				if (('type_names' in parent_descriptor) && !('type_names' in child_descriptor)) {
					child_descriptor.type_names = parent_descriptor.type_names;
				}
				if (parent_descriptor.is_nullable) child_descriptor.is_nullable = true;
				if (parent_descriptor.is_non_nullable) child_descriptor.is_non_nullable = true;
				if (parent_descriptor.is_shared) child_descriptor.is_shared = true;
				if (parent_descriptor.is_constant) child_descriptor.is_constant = true;

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

				if (name in skeleton) { // name may be Shared or directive, like Extends

					longname = cd.path + '#' + name;
					if (!(longname in jsdoc_data)) throw new Error("JSDoc descriptor is missing for " + cd.path + '#' + name);
					var jsdoc_descriptor = jsdoc_data[longname];

					member_descriptor = {
						name: name,
						belongs: cd.path, // if the member is overridden - this is set to the overriding class
						defined: cd.path, // the first class in inheritance chain, where the member was defined. Never changes.
						is_private: name[0] == '_',
						type: (skeleton[name].type == 'function') ? 'function' : 'member'
					};
					if (is_mixin) member_descriptor.is_from_mixin = true;
					if (jsdoc_descriptor.description) member_descriptor.description = jsdoc_descriptor.description;

					if (member_descriptor.type == 'function') {

						if (jsdoc_descriptor.kind != 'function') throw new Error('jsdoc descriptor: function expected, got :' + jsdoc_descriptor.kind);

						if ('params' in jsdoc_descriptor) member_descriptor.params = jsdoc_descriptor.params;
						if (jsdoc_descriptor.param_names_string) member_descriptor.param_names_string = jsdoc_descriptor.param_names_string;
						if ('returns' in jsdoc_descriptor) member_descriptor.returns = jsdoc_descriptor.returns;

					} else {

						if (['member', 'constant'].indexOf(jsdoc_descriptor.kind) == -1) throw new Error('jsdoc descriptor: member expected, got :' + jsdoc_descriptor.kind);

						// currently, we take the default value from actual code, rather than JSDoc comment
						if ('default_value' in jsdoc_descriptor) {
							//descriptor.default = jsdoc_descriptor.default_value;
							throw new Error('TODO buildDoc: member with default value in import data: ' + skeleton.path + '#' + name);
						}
						if (['null','undefined'].indexOf(skeleton[name].type) != -1) {
							member_descriptor.default_value = '<span class="api-keyword">' + skeleton[name].type + '</span>';
						} else if (skeleton[name].type == 'boolean') {
							member_descriptor.default_value = '<span class="api-keyword">' + skeleton[name].value + '</span>';
						} else if (skeleton[name].type == 'object') {
							if (Firestorm.Object.isEmpty(skeleton[name].skeleton)) {
								member_descriptor.default_value = '<span class="api-highlight-empty">{ }</span>';
							} else {
								member_descriptor.default_value = '<span class="api-highlight-gray">{ ... }</span>';
							}
						} else if (skeleton[name].type == 'inlineArray' && skeleton[name].is_empty) {
							member_descriptor.default_value = '<span class="api-highlight-empty">[ ]</span>';
						} else if (skeleton[name].type == 'inlineArray' || skeleton[name].type == 'sliceArray') {
							member_descriptor.default_value = '<span class="api-highlight-gray">[ ... ]</span>';
						} else if (skeleton[name].type == 'number') {
							member_descriptor.default_value = skeleton[name].value;
						} else if (skeleton[name].type == 'string') {
							member_descriptor.default_value = '<span class="api-string">' + Firestorm.String.quote(skeleton[name].value) + '</span>';
						} else if (skeleton[name].type == 'regexp') {
							member_descriptor.default_value = '<span class="api-highlight-gray">/ ... /</span>';
						}

						if (jsdoc_descriptor.is_nullable) member_descriptor.is_nullable = true;
						if (jsdoc_descriptor.is_non_nullable) member_descriptor.is_non_nullable = true;
						if ('type_names' in jsdoc_descriptor) member_descriptor.type_names = jsdoc_descriptor.type_names;
						if (jsdoc_descriptor.kind == 'constant') member_descriptor.is_constant = true;

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
					if (!(longname in jsdoc_data)) throw new Error("JSDoc descriptor is missing for " + cd.path + '#' + name);
					jsdoc_descriptor = jsdoc_data[longname];
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
					if (jsdoc_descriptor.description) member_descriptor.description = jsdoc_descriptor.description;

					if ('default_value' in jsdoc_descriptor) {
						//descriptor.default = jsdoc_descriptor.default_value;
						throw new Error('TODO buildDoc: member with default value in import data: ' + skeleton.path + '#' + name);
					}
					if (Firestorm.Object.isEmpty(cd.shared[name])) {
						member_descriptor.default_value = '<span class="api-highlight-empty">{ }</span>';
					} else {
						member_descriptor.default_value = '<span class="api-highlight-gray">{ ... }</span>';
					}

					if (jsdoc_descriptor.is_nullable) member_descriptor.is_nullable = true;
					if (jsdoc_descriptor.is_non_nullable) member_descriptor.is_non_nullable = true;
					if ('type_names' in jsdoc_descriptor) member_descriptor.type_names = jsdoc_descriptor.type_names;

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
				LavaBuild.registerLink(cd.path + '#' + name, {
					hash: 'class=' + cd.path + ';member=' + name,
					page: 'api',
					context: 'api',
					title: title
				});
			}

			return result;

		}

		var class_descriptors = {};
		var extended_class_descriptors = {};

		function create_docs(path) {

			var cd = Lava.ClassManager.getClassData(path),
				member_descriptors_hash = buildMemberDocs(cd),
				short_class_descriptor = class_descriptors[path],
				extended_class_descriptor = {};

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

				var parent_class_ext_descriptor = extended_class_descriptors[cd.extends];

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

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			if (!global.Lava) {
				require('../temp/lava_module.js');
			}
			var Lava = global.Lava,
				Firestorm = global.Firestorm,
				LavaBuild = global.LavaBuild,
				fs = require('fs'),
				groups = grunt.config('js_files'),
				filelist = groups['classes'].concat(groups['widgets']);

			// ensure that previous task was run just before this one
			if ((+new Date(fs.statSync('build/temp/jsdoc_classes_export.js').mtime)) - (+new Date()) > 5000) throw new Error('jsdocExport task was not run?');
			jsdoc_data = eval('(' + grunt.file.read('build/temp/jsdoc_classes_export.js') + ')');

			LavaBuild.recursiveRemoveDirectory('www/api/');
			fs.mkdirSync('www/api/');

			filelist.forEach(function(file_path){

				if (file_path.substr(-9) != '.class.js') throw new Error();
				var path = file_path.substr(0, file_path.length - 9).split('/'), // substr to cut extension
					filename = path.pop();

				var short_descriptor = {
					type: 'class',
					name: path.length ? ('Lava.' + path.join('.').toLowerCase() + '.' + filename) : 'Lava.' + filename,
					title: filename,
					file_path: file_path,
					file_name: filename
					//has_implements: null
					//'extends': null,
					//implements: null,
					//extends_chain: null // Array.<{extends:string, implements: []}>
					//description: null // this is short description, from class comment.
				};
				short_descriptor.is_mixin = short_descriptor.name.indexOf('Lava.mixin.') == 0;
				class_descriptors[short_descriptor.name] = short_descriptor;

				if (path.length) {
					var parent_dit = get_data_dir(path);
					parent_dit.children.push(short_descriptor);
				} else {
					root.push(short_descriptor);
				}

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				// check the correctness of file content. Wrong JSDoc comments may result in very unwanted consequences.

				var file_content = grunt.file.read('src/' + file_path),
					// match Lava.define with the comment before the class
					// [1] = class name
					// [2] = comment
					matches = file_content.match(/^\s*Lava\.define\(\s*[\'\"]([^\'\"]+)[\'\"]\,\s*(\/\*\*[\s\S]+?\*\/)\s*\{/);

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
							if (descriptor.params) descriptor.params.forEach(function(param) {
								processDescription(param);
							});
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

				grunt.file.write('www/api/' + name + '.js', JSON.stringify(extended_class_descriptor));

			}

			for (name in class_descriptors) {
				processDescription(class_descriptors[name]); // short class description
			}

			grunt.file.write('www/js/api_tree.js', 'var api_tree_source = ' + JSON.stringify(root));

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