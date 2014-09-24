
/*
Replace marked regions in *.html files.
This script was written for the framework site's maintenance, and author suggests that you will NOT need to use it.
*/

module.exports = function(grunt) {

	grunt.registerTask('buildWeb', function() {

		var www_files = grunt.config('www_files').files;
		var fs = require('fs');

		var includes = {};
		var include_names = fs.readdirSync('./build/includes/');
		var name;
		for (var i = 0, count = include_names.length; i < count; i++) {
			name = include_names[i];
			includes[name] = grunt.file.read('./build/includes/' + name);
		}

		// replace includes in html files. Currently, all content is pure html files, need to update it somehow.
		function processWebFile(filename) {
			var content = grunt.file.read(filename);
			var was_modified = false;
			content = content.replace(
				/<!--LAVA_BUILD_INCLUDE:([a-zA-Z0-9\.\_]+)-->\s*([\s\S]*?)\s*<!--LAVA_BUILD_INCLUDE_END-->/g,
				function() {
					var include_name = arguments[1];
					var www_prefix = '';
					var dist_prefix = '../';
					if (filename == 'index.html') {
						www_prefix = 'www/';
						dist_prefix = '';
					}
					var required_include_content = includes[include_name].trim();
					required_include_content = required_include_content.replace(/\{\$www_prefix\}/g, www_prefix);
					required_include_content = required_include_content.replace(/\{\$dist_prefix\}/g, dist_prefix);
					required_include_content = required_include_content.replace(/\{\$pagename\}/g, filename);

					var page_include_content = arguments[2].trim();
					if (page_include_content != required_include_content) {
						was_modified = true;
						return "<!--LAVA_BUILD_INCLUDE:" + include_name + "-->\n" + required_include_content + "\n<!--LAVA_BUILD_INCLUDE_END-->";
					} else {
						return arguments[0]; // original string
					}
				}
			);

			if (was_modified) {
				grunt.file.write(filename, content);
			}

		}

		for (i = 0, count = www_files.length; i < count; i++) {
			processWebFile(www_files[i]);
		}

	});

};