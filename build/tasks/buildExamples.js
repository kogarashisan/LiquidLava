
/*
Create JS files in www/examples directory.
This script was written for the framework site's maintenance, and author suggests that you will NOT need it.
 */

module.exports = function(grunt) {

	grunt.registerTask('buildExamples', function() {

		var fs = require('fs');
		var highlight_js = require('highlight.js');
		var example_names = fs.readdirSync('./build/examples/');
		var Lava;

		var packs = {};

		function makeTab(example, title, type, text) {

			if (type == 'xml') {
				text = text.replace(/\t/g, '  ');
			}

			var highlighted = highlight_js.highlight(type, text).value;

			if (type == 'javascript') {
				highlighted = highlighted.replace(/<span class="hljs-comment">\/\*H\:(.*?)\*\/([\s\S]+?)\/\*:H\*\/<\/span>/g, function() {
					return '<div data-tooltip="' + arguments[1] + '" class="lava-highlight">' + arguments[2] + '</div>';
				});
			} else if (type == 'xml') {
				// highlight regions with tooltip
				highlighted = highlighted.replace(/\{\*H\:(.*?)\*\}([\s\S]+?)\{\*\:H\*\}/g, function() {
					return '<div data-tooltip="' + arguments[1] + '" class="lava-highlight">' + arguments[2] + '</div>';
				});
				// also highlight other comments
				highlighted = highlighted.replace(/\{\*[\s\S]+?\*\}/g, function() {
					return '<div class="lava-highlight">' + arguments[0] + '</div>';
				});
				// make control attributes red
				highlighted = highlighted.replace(/\<span class="hljs-attribute"\>x:([\s\S]+?)\<\/span>/g, function() {
					return '<span class="lava-control-prefix">x</span><span class="hljs-attribute">:' + arguments[1] + '</span>';
				});
			}

			example.tabs.push({
				title: title,
				content: '<pre><code class="hljs ' + type + '">' + highlighted + '</code></pre>'
			});

		}

		function buildExample(example_name) {

			var dirname = './build/examples/' + example_name + '/';
			var filenames = fs.readdirSync(dirname);
			var example_package = {};
			var example = {
				tabs: []
			};

			for (var i = 0, count = filenames.length; i < count; i++) {

				example_package[filenames[i]] = grunt.file.read(dirname + filenames[i]);

			}

			if (example_package['classes.js']) {
				example.classes = example_package['classes.js'];
				makeTab(example, 'Classes', 'javascript', example_package['classes.js']);
			}

			example.template = Lava.TemplateParser.parse(
				(example_package['description.html'] || '')
				+ example_package['template.html']
			);
			makeTab(example, 'Template', 'xml', example_package['template.html']);
			//example.description = example_package['description.html'];

			packs[example_name] = example;

		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			require('../temp/lava_module.js');
			Lava = global.Lava;
			eval(grunt.file.read('./build/temp/example_box_widget.js'));

			for (var i = 0, count = example_names.length; i < count; i++) {

				if (example_names[i] == '_empty') continue;
				buildExample(example_names[i]);

			}

			packs['Panel3'].classes
				= packs['Panel2'].classes
				= packs['Panel1'].classes;

			var define_source = grunt.file.read('./build/templates/editable_table.html');
			define_source = define_source.replace(/^\<!\-\-[\s\S]+?\-\-\>\r?\n/, '');
			makeTab(packs['editable_table'], 'Defines', 'xml', define_source);
			makeTab(packs['editable_table'], 'Classes', 'javascript', grunt.file.read('./build/src/EditableTableExample.class.js'));

			for (var example_name in packs) {
				var result = 'var package_content = ' + Lava.Serializer.serialize(packs[example_name]);
				grunt.file.write('./www/examples/' + example_name + '.js', result);
			}

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};