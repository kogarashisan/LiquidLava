
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

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// read files from disk

		var group_contents = {};

		for (var name in groups) {

			var group_content = '',
				filelist = groups[name];

			for (i = 0, count = filelist.length; i < count; i++) {
				group_content += grunt.file.read('./src/' + filelist[i]) + '\n';
			}

			group_contents[name] = group_content;
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

		if (grunt.file.read('./build/temp/lava_module.js') != module_content) {
			grunt.file.write('./build/temp/lava_module.js', module_content);
			// @todo if you require() this file immediately - node will load the old (stale) version,
			// How to force it to write the file before require()?
			throw new Error('continue');
		}

		// End
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			require('../temp/lava_module.js');
			var Lava = global.Lava;

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Parse and compile the standard widget templates

			var template_source = '';
			template_source += grunt.file.read('./templates/system_widgets.html');
			template_source += grunt.file.read('./templates/standard_widgets.html');

			Lava.TemplateParser.parse(template_source);

			var compiled_templates =
				'Lava.widgets = ' + Lava.Serializer.serialize(Lava.widgets) + ';\n'
				+ 'Lava.sugar_map = ' + Lava.Serializer.serialize(Lava.sugar_map) + ';\n';

			grunt.file.write('./build/temp/lava_widgets.js', compiled_templates);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Finally: build Lava package, which can be used in browser

			var package_content = core_content;
			package_content += global.LavaBuild.exportClasses();
			package_content += compiled_templates;
			grunt.file.write('./dist/lava-master-compiled-DEBUG.js', package_content);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Build uncompiled package

			package_content = core_content;
			package_content += group_contents['classes'];
			package_content += group_contents['widgets'];
			package_content += compiled_templates;

			grunt.file.write('./dist/lava-master-DEBUG.js', package_content);

			// End
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};