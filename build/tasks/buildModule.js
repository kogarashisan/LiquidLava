
// create a file, that can be require()'d by Node. It's not a true Node module, cause it exports to global.
// Export to global is needed by ClassManager constructors to work

module.exports = function(grunt) {

	grunt.registerTask('buildModule', function() {

		// currently, you cannot write a Node module and then immediately require() it - Node will load old file from disk.
		// Haven't found any workaround for that, so had to split the process into two tasks, which need to be run separately
		// (not in one command/process)
		global.buildLavaModule_run = true;

		var group_content = global.group_content;

		var module_content =
			group_content['_lava_core']
			+ group_content['classes']
			+ group_content['widgets']
			+ '\n'
			+ 'global.Lava = Lava;\n' // export is needed by class constructors to work
			+ 'global.Firestorm = Firestorm;\n'
			+ 'Lava.init();\n';

		grunt.file.write('./build/temp/lava_module.js', module_content);

	});

};