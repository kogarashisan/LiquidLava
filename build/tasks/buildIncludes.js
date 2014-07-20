
/*
Build the <example> widget and some others. Most likely, you will not need to use this script.
*/

module.exports = function(grunt) {

	grunt.registerTask('buildIncludes', function() {

		var fs = require('fs');

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			require('../temp/lava_module.js');
			var Lava = global.Lava;

			Lava.TemplateParser.parse(grunt.file.read('./build/templates/example_widget.html'));

			var example_include =
				'Lava.widgets["Example"] = ' + Lava.Serializer.serialize(Lava.widgets['Example']) + ';\n'
				+ 'Lava.sugar_map["example"] = ' + Lava.Serializer.serialize(Lava.sugar_map['example']) + ';\n';

			grunt.file.write('./build/temp/example_box_widget.js', example_include);

			///

			Lava.TemplateParser.parse(grunt.file.read('./build/templates/editable_table.html'));
			var include = 'Lava.widgets["EditableTable"] = ' + Lava.Serializer.serialize(Lava.widgets['EditableTable']) + ';\n';
			grunt.file.write('./build/temp/editable_table_widget.js', include);

			///

			var main_page_widgets = Lava.TemplateParser.parse(grunt.file.read('./build/templates/main_page_demo.html'));
			include = 'var MainPageTemplate = ' + Lava.Serializer.serialize(main_page_widgets) + ';\n';
			grunt.file.write('./build/temp/main_page_widgets_template.js', include);

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};