
// workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135
global.bug1135 = function(callback) {
	return function() {
		try {
			return callback();
		} catch (e) {
			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;
		}
	}
};

module.exports = function(grunt) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// read files from disk and pack them for tasks

	var groups = grunt.file.readJSON('build/js_files.json'),
		group_content = {};

	for (var name in groups) {

		var content = '',
			file_list = groups[name];

		for (var i = 0, count = file_list.length; i < count; i++) {
			content += grunt.file.read('./src/' + file_list[i]) + '\n';
		}

		group_content[name] = content;

	}

	global.group_content = group_content;

	// End
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	grunt.option('stack', true);
	grunt.loadTasks('build/tasks/');

	grunt.registerTask('default', ['buildLibrary']);
	// depends on buildLibrary
	grunt.registerTask('export', ['buildWidgetTemplates', 'buildCompiled']);

};