
module.exports = function(grunt) {

	grunt.registerTask('jsdocExport', function() {

		var child_process = require('child_process');
		var done = this.async();
		var completed_processes = 0;

		function callJSDoc(template_name, filelist_string) {

			var cmd_string = 'jsdoc --private --destination generated_docs --template ./build/' + template_name + ' ' + filelist_string;
			grunt.log.ok('Running: ' + cmd_string);

			var child = child_process.spawn(
				'cmd',
				['/c ' + cmd_string],
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
					grunt.log.write('jsdoc exited normally (' + completed_processes + ')\n');
					completed_processes++;
					if (completed_processes == 2) {
						done(true);
					}
				} else {
					grunt.log.error('jsdoc terminated');
					grunt.fail.warn('jsdoc failure', 3 /*errorCode.task*/);
				}
			});

		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			if (!global.Lava) {
				require('../temp/lava_module.js');
			}
			var Firestorm = global.Firestorm;

			var groups = grunt.config('js_files');
			var _filelist =
				groups['classes']
				.concat(groups['widgets'])
				.concat(groups['firestorm'])
				.concat(groups['core'])
				.concat(groups['parsers']);

			var filelist = [];
			var exclusions = [
				"Firestorm/known_exceptions.js",
				"Firestorm/init.js",
				"Parsers/Generated/ObjectParser.js",
				"Parsers/Generated/ExpressionParser.js",
				"Parsers/Generated/TemplateParser.js"
			];

			_filelist.forEach(function(name) {
				if (exclusions.indexOf(name) == -1) filelist.push(name);
			});

			var filelist_string = 'src/' + filelist.join(' src/') + ' build/jsdoc_support.js';
			callJSDoc('jsdoc_classes_template', filelist_string);

			var fs = require('fs');
			var support_list = fs.readdirSync('support/');
			Firestorm.Array.exclude(support_list, 'interfaces.js');
			support_list.unshift('interfaces.js'); // force interfaces to appear before objects
			callJSDoc('jsdoc_support_template', 'support/' + support_list.join(' support/'));

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};