
module.exports = function(grunt) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// read files from disk

	var groups = grunt.file.readJSON('build/js_files.json'),
		fs = require('fs'),
		group_content = {};

	for (var name in groups) {

		var content = '',
			file_list = groups[name];

		for (var i = 0, count = file_list.length; i < count; i++) {
			content += grunt.file.read('./src/' + file_list[i]) + '\n';
		}

		group_content[name] = content;

	}

	group_content['locale'] = grunt.file.read('./locale/en/schema.js');

	group_content['_lava_core'] =
		group_content['firestorm']
		+ group_content['core']
		+ group_content['parsers']
		+ group_content['locale'];

	global.group_content = group_content;

	// End
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	grunt.option('stack', true);
	grunt.loadTasks('build/tasks/');

	grunt.registerTask('default', ['buildModule']);
	// depends on buildModule
	grunt.registerTask('export', ['buildDistribution']);
	// depends on buildDistribution
	grunt.registerTask('jsdoc_export', ['jsdocExport']);

};