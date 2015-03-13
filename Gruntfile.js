
// workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135
global.bug1135 = function(callback) {
	return function() {
		try {
			return callback();
		} catch (e) {
			throw new Error(e);
		}
	}
};

module.exports = function(grunt) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// read files from disk and pack them for tasks

	var groups = grunt.file.readJSON('build/files.json'),
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

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Write version as an array
	// var Lava = { version: [#,#,#], ...

	var version_string = grunt.file.readJSON('package.json').version;
	if (!version_string.match(/\d+\.\d+\.\d+/)) throw new Error("Version format is unknown to build script");
	group_content["core"] = group_content["core"].replace(/\/\*\<\%version\%\>\*\//, version_string.replace(/\./g, ','));

	// End
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	grunt.option('stack', true);
	grunt.loadTasks('build/tasks/');

	grunt.registerTask('default', ['buildLibrary']);
	// depends on buildLibrary
	grunt.registerTask('export', ['buildWidgetTemplates', 'buildCompiled']);

};