
// Create compiled versions of Lava classes.
// Depends on module, exported by previous task.

module.exports = function(grunt) {

	grunt.registerTask('buildCompiled', global.bug1135(function() {

		// see buildLibrary task for explanation
		if (global.buildLibrary_run) throw new Error('You must run buildLibrary task as separate command');

		var Lava = require('./../../lib/node-module.js');

		var exported_classes = [];
		var skeletons = {};
		var exported_paths = [];

		var constructors = [];
		var own_references = [];
		var prototype_generators = [];

		function export_path(path) {

			exported_paths.push(path);
			var class_data = Lava.ClassManager.exportClass(path);

			if (class_data.extends && exported_paths.indexOf(class_data.extends) == -1) {
				export_path(class_data.extends);
			}

			skeletons[path] = class_data.skeleton;
			delete class_data.skeleton;
			constructors.push(class_data.constructor);
			delete class_data.constructor;
			own_references.push(class_data.own_references);
			delete class_data.own_references;
			prototype_generators.push(class_data.prototype_generator);
			delete class_data.prototype_generator;

			delete class_data.source_object;
			delete class_data.references;
			exported_classes.push(class_data);

		}

		var class_names = Lava.ClassManager.getClassNames();
		for (var i = 0, count = class_names.length; i < count; i++) {

			if (exported_paths.indexOf(class_names[i]) == -1) {
				export_path(class_names[i]);
			}

		}

		grunt.file.write(
			'lib/compiled/skeletons.js',
			"Lava.ClassManager.loadSkeletons(" + Lava.serializer.serialize(skeletons) + ");\n\n"
		);

		var wrapper = grunt.file.read('build/compiled_export_wrapper.js');
		// replaces are done in backwards order - it's faster
		wrapper = wrapper.replace("$$$_CLASS_DATAS_$$$", Lava.serializer.serialize(exported_classes));
		wrapper = wrapper.replace("$$$_GENERATORS_$$$", Lava.serializer.serialize(prototype_generators));
		wrapper = wrapper.replace("$$$_OWN_REFERENCES_$$$", Lava.serializer.serialize(own_references));
		wrapper = wrapper.replace("$$$_CONSTRUCTORS_$$$", Lava.serializer.serialize(constructors));

		grunt.file.write('lib/compiled/all-classes.js', wrapper);

	}));

};