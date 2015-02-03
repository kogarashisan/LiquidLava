
// Compile classes and widgets, write the distribution file.
// Depends on module, exported by previous task.

module.exports = function(grunt) {

	grunt.registerTask('buildDistribution', function() {

		if (global.buildLavaModule_run) throw new Error('You must run buildModule task in separate command');

		var group_content = global.group_content;
		var fs = require('fs');

		function exportClasses(Lava) {

			var export_classes_result = '';
			var exported_paths = [];

			function export_path(path) {

				var exported = Lava.ClassManager.exportClass(path);

				if (exported.extends && exported_paths.indexOf(exported.extends) == -1) {
					export_path(exported.extends);
				}

				delete exported.skeleton;
				delete exported.source_object;
				export_classes_result += "Lava.ClassManager.loadClass(" + Lava.serializer.serialize(exported) + ");\n\n";
				exported_paths.push(path);

			}

			var class_names = Lava.ClassManager.getClassNames();
			for (var i = 0, count = class_names.length; i < count; i++) {

				if (exported_paths.indexOf(class_names[i]) == -1) {
					export_path(class_names[i]);
				}

			}

			return export_classes_result;

		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			require('../temp/lava_module.js');

			var Lava = global.Lava,
				package_content;

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Parse and compile the standard widget templates

			Lava.TemplateParser.parse(
				grunt.file.read('./templates/system_widgets.html')
				+ grunt.file.read('./templates/standard_widgets.html')
			);

			// check that all events, required by widgets, are in the schema.
			for (var name in Lava.widgets) {
				if (Lava.widgets[name].default_events) {
					Lava.widgets[name].default_events.forEach(function(event_name){
						if (Lava.schema.system.DEFAULT_EVENTS.indexOf(event_name) == -1) {
							throw new Error('Event ' + event_name + ' is used by widget ' + name + ' and not in schema');
						}
					})
				}
			}

			var compiled_templates =
				'Lava.widgets = ' + Lava.serializer.serialize(Lava.widgets) + ';\n'
					+ 'Lava.sugar_map = ' + Lava.serializer.serialize(Lava.sugar_map) + ';\n';

			grunt.file.write('./build/temp/lava_widgets.js', compiled_templates);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Build package with raw (not compiled) classes

			grunt.file.write(
				'./dist/lava-master-DEV.js',
				group_content['_lava_core']
					+ group_content['classes']
					+ group_content['widgets']
					+ compiled_templates
			);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Finally, build compiled Lava package

			grunt.file.write(
				'./dist/lava-master-compiled-DEV.js',
				group_content['_lava_core']
					+ "Lava.ClassManager.registerRootNamespace('Lava', Lava);\n\n"
					+ exportClasses(Lava)
					+ compiled_templates
			);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};