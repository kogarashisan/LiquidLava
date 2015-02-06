
// Create compiled versions of Lava classes.
// Depends on module, exported by previous task.

module.exports = function(grunt) {

	grunt.registerTask('buildCompiled', global.bug1135(function() {

		// see buildLibrary task for explanation
		if (global.buildLibrary_run) throw new Error('You must run buildLibrary task as separate command');

		var Lava = require('./../../lib/node-module.js');

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

		grunt.file.write(
			'lib/packages/all-classes-compiled.js',
			"Lava.ClassManager.registerRootNamespace('Lava', Lava);\n\n"
			+ exportClasses(Lava)
		);

	}));

};