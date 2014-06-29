
/*
Perfection kills. Even God needs to rest sometimes. Amen.

This is the main build script, which creates the Node "module"
(currently, it's not a true module, cause it exports Lava to global namespace),
compiles classes and widgets, writes the distribution file.
*/

module.exports = function(grunt) {

	grunt.registerTask('buildLava', function() {

		var groups = grunt.config('js_files');
		var fs = require('fs');

		function concatList(filelist, prefix) {

			var result = '';

			for (var i = 0, count = filelist.length; i < count; i++) {
				result += grunt.file.read(prefix + filelist[i]);
			}

			return result;

		}

		var export_classes_result = '';
		var exported_paths = [];

		function export_path(path) {

			var exported = Lava.ClassManager.exportClass(path);

			if (exported.extends && exported_paths.indexOf(exported.extends) == -1) {
				export_path(exported.extends);
			}

			delete exported.skeleton;
			delete exported.source_object;
			export_classes_result += "Lava.ClassManager.loadClass(" + Lava.Serializer.serialize(exported) + ");\n\n";
			exported_paths.push(path);

		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// read files from disk

		var group_contents = {};

		for (var name in groups) {
			group_contents[name] = concatList(groups[name], './src/');
		}

		group_contents['locale'] = grunt.file.read('./locale/en/schema.js');

		// End
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Create a package, which can be loaded in Node environment, load it, and get the Lava reference

		var core_content = '';
		core_content += group_contents['firestorm'];
		core_content += group_contents['core'];
		core_content += group_contents['parsers'];
		core_content += group_contents['locale'];

		var module_content = core_content;
		module_content += group_contents['classes'];
		module_content += group_contents['widgets'];
		module_content += '\n\n' + 'global.Lava = Lava;' + '\n' + 'global.Firestorm = Firestorm;\n\n';
		module_content += '\n' + 'Lava.init();\n';

		grunt.file.write('./build/temp/lava_module.js', module_content);

		// End
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			require('../temp/lava_module.js');
			var Lava = global.Lava;

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Generate classes, loadable by ClassManager

			var class_names = Lava.ClassManager.getClassNames();
			for (var i = 0, count = class_names.length; i < count; i++) {

				if (exported_paths.indexOf(class_names[i]) == -1) {
					export_path(class_names[i]);
				}

			}

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Parse and compile the standard widget templates

			var template_source = '';
			template_source += grunt.file.read('./templates/system_widgets.html');
			template_source += grunt.file.read('./templates/standard_widgets.html');

			Lava.TemplateParser.parse(template_source);

			var compiled_templates =
				'Lava.widgets = ' + Lava.Serializer.serialize(Lava.widgets) + ';\n'
				+ 'Lava.sugar_map = ' + Lava.Serializer.serialize(Lava.sugar_map) + ';\n';

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Finally: build Lava package, which can be used in browser

			var package_content = core_content;

			package_content += export_classes_result;
			//package_content += '\n' + 'Lava.init();';
			package_content += compiled_templates;

			//grunt.file.write('./build/temp/package.js', package_content);
			grunt.file.write('./dist/lava-master-compiled-DEBUG.js', package_content);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Build uncompiled package

			package_content = core_content;

			package_content += group_contents['classes'];
			package_content += group_contents['widgets'];
			//package_content += '\n' + 'Lava.init();';
			package_content += compiled_templates;

			//grunt.file.write('./build/temp/package.js', package_content);
			grunt.file.write('./dist/lava-master-DEBUG.js', package_content);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};