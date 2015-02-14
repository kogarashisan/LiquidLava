
module.exports = function(grunt) {

	grunt.registerTask('buildLibrary', function() {

		// currently, you cannot write a Node module and then immediately require() it - Node will load old file from disk.
		// As a workaround for this - the build process was split into two tasks, which need to be run separately
		// (not in one command/process)
		global.buildLibrary_run = true;

		var group_content = global.group_content;

		if (grunt.file.exists('lib/packages/widget-templates.js')) {
			grunt.file.delete('lib/packages/widget-templates.js');
		}

		if (grunt.file.exists('lib/packages/all-classes-compiled.js')) {
			grunt.file.delete('lib/packages/all-classes-compiled.js');
		}

		grunt.file.write('lib/packages/core.js', group_content['core']);
		grunt.file.write('lib/packages/parsers.js', group_content['parsers']);
		grunt.file.write('lib/packages/core-classes.js', group_content['classes']);
		grunt.file.write('lib/packages/widget-classes.js', group_content['widgets']);

	});

};