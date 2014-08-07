
/*
Build the <example> widget and some others. Most likely, you will not need to use this script.
*/

module.exports = function(grunt) {

	grunt.registerTask('buildIncludes', function() {

		var fs = require('fs');

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			var Lava = global.Lava;

			Lava.TemplateParser.parse(grunt.file.read('./build/templates/example_widget.html'));
			var widgets_src =
				'Lava.widgets["Example"] = ' + Lava.Serializer.serialize(Lava.widgets['Example']) + ';\n'
				+ 'Lava.sugar_map["example"] = ' + Lava.Serializer.serialize(Lava.sugar_map['example']) + ';\n';

			Lava.TemplateParser.parse(grunt.file.read('./build/templates/FolderTree.html'));
			widgets_src += 'Lava.widgets["FolderTree"] = ' + Lava.Serializer.serialize(Lava.widgets['FolderTree']) + ';\n';

			Lava.TemplateParser.parse(grunt.file.read('./build/templates/editable_table.html'));
			widgets_src += 'Lava.widgets["EditableTable"] = ' + Lava.Serializer.serialize(Lava.widgets['EditableTable']) + ';\n';

			grunt.file.write('./build/temp/site_widgets.js', widgets_src);

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};