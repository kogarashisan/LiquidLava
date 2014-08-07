
module.exports = function(grunt) {

	grunt.registerTask('jsdocExport', function() {

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			var groups = grunt.config('js_files');
			var filelist = groups['classes'].concat(groups['widgets']);
			var filelist_string = 'src/' + filelist.join(' src/');

			var done = this.async();
			var child_process = require('child_process');
			var child = child_process.spawn(
				'cmd',
				['/c jsdoc --private --destination generated_docs --template ./build/jsdoc_classes_template ' + filelist_string],
				{
					windowsVerbatimArguments: true
				}
			);
			child.stdout.setEncoding('utf8');
			child.stdout.on('data', function (data) {
				grunt.log.debug('jsdoc output : ' + data);
			});
			child.stderr.on('data', function (data) {
				grunt.log.error('An error occured in jsdoc process:\n' + data);
				grunt.fail.warn('jsdoc failure', 3 /*errorCode.task*/);
			});
			child.on('exit', function(code){
				if(code === 0){
					grunt.log.write('jsdoc exited normally');
					done(true);
				} else {
					grunt.log.error('jsdoc terminated');
					grunt.fail.warn('jsdoc failure', 3 /*errorCode.task*/);
				}
			});

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};