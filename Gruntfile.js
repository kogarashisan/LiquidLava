
module.exports = function(grunt) {

	global.LavaBuild = {
		//grunt: grunt,
		highlight_js: require('highlight.js'),
		exportClasses: function() {
			var export_classes_result = '';
			var exported_paths = [];
			var Lava = global.Lava;

			function export_path(path) {

				var exported = Lava.ClassManager.exportClass(path);

				if (exported.extends && exported_paths.indexOf(exported.extends) == -1) {
					export_path(exported.extends);
				}

				delete exported.skeleton;
				delete exported.source_object;
				export_classes_result += "Lava.ClassManager.loadClass(" + Lava.Serializer.serialize(exported) + ");\n\n";
				exported_paths.push(path);

			}

			var class_names = Lava.ClassManager.getClassNames();
			for (var i = 0, count = class_names.length; i < count; i++) {

				if (exported_paths.indexOf(class_names[i]) == -1) {
					export_path(class_names[i]);
				}

			}

			return export_classes_result;
		},

		_wrapHighlightedCode: function(code, type, line_numbers, overlay_lines, tooltip_lines) {

			return '<div class="lava-code-container">'
					+ '<div class="lava-code">'
						+ '<pre class="lava-code-line-numbers">' + line_numbers + '</pre>'
						+ '<pre class="lava-code-content hljs ' + type + '">' + code + '</pre>'
						+ (overlay_lines ? (
							'<div class="lava-code-overlay">' + overlay_lines + '</div>'
							+ '<div class="lava-code-tooltips">' + tooltip_lines + '</div>'
						) : '')
					+ '</div>'
				+ '</div>';

		},

		highlight: function(type, text) {

			text = text.trim();
			if (type == 'xml') {
				text = text.replace(/\t/g, '  ');
			}

			var tooltip_pattern = type == 'xml' ? /\{\*H\:([\s\S]+?)\*\}/g : /\/\*H\:([\s\S]+?)\*\//g;
			var tooltips = {};
			var max_tooltip_index = 0;
			var tooltip_text = '';
			var overlay_text = '';

			// extract regions with tooltips
			text = text.replace(tooltip_pattern, function(full_comment, tooltip_text, index, source) {

				// count the lines before the tooltip
				var tooltip_index = source.substr(0, index).split('\n').length;
				if (tooltip_index > max_tooltip_index) {
					max_tooltip_index = tooltip_index;
				}
				tooltips[tooltip_index - 1] = tooltip_text;
				return '';

			});

			if (max_tooltip_index > 0 || ('0' in tooltips)) {
				for (var i = 0; i <= max_tooltip_index; i++) {
					if (i in tooltips) {
						overlay_text += '<div class="lava-code-overlay-line"></div>';
						tooltip_text += '<div data-tooltip="' + tooltips[i] + '"></div>';
					} else {
						overlay_text += '<div></div>';
						tooltip_text += '<div></div>';
					}
				}
			}

			// create line numbers
			var count_lines = text.split('\n').length;
			var lines_text = '';
			for (i = 1; i <= count_lines; i++) {
				lines_text += i + '\r\n';
			}

			var highlighted = this.highlight_js.highlight(type, text).value;

			if (type == 'xml') {
				// make control attributes red
				highlighted = highlighted.replace(/\<span class="hljs-attribute"\>x:([\s\S]+?)\<\/span>/g, function() {
					return '<span class="lava-control-prefix">x</span><span class="hljs-attribute">:' + arguments[1] + '</span>';
				});
			}

			return this._wrapHighlightedCode(highlighted, type, lines_text, overlay_text, tooltip_text);

		},

		_serializeFunction: function(data, padding) {

			var result = data + '';

			// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
			if (result.substr(0, 18) == 'function anonymous') {
				result = 'function' + result.substr(18);
			}

			var lines = result.split(/\r?\n/);
			var last_line = lines[lines.length - 1];
			if (/^\t*\}$/.test(last_line)) {
				if (last_line.length > 1) { // if there are tabs
					var tabs = last_line.substr(0, last_line.length - 1);
					var num_tabs = tabs.length;
					for (var i = 1, count = lines.length; i < count; i++) {
						if (lines[i].indexOf(tabs) == 0) {
							lines[i] = lines[i].substr(num_tabs);
						}
					}
				}
				lines.pop();
				result = lines.join('\r\n\t' + padding) + '\r\n' + padding + last_line;
			}

			return result;

		},

		smartSerialize: function(value) {

			var original = global.Lava.Serializer._serializeFunction;
			global.Lava.Serializer._serializeFunction = this._serializeFunction;
			var result = global.Lava.Serializer.serialize(value);
			global.Lava.Serializer._serializeFunction = original;
			return result;

		}

	};

	grunt.initConfig({

		js_files: grunt.file.readJSON('build/js_files.json'),
		www_files: grunt.file.readJSON('build/www_files.json'),

		concat: {
			options: {
				banner: "\n/*\nThis file was generated via build script. See Gruntfile.js\n*/\n\n"
			},
			css: {
				files: [
					{
						src: [
							"./build/css/bootstrap/bootstrap.css",
							"./build/css/bootstrap/bootstrap-theme.min.css",
							"./build/css/bootstrap/partial-docs.css",
							"./build/css/site.css",
							"./dist/lava-widgets.css",
							"./build/css/highlightjs/vs.css"
						],
						dest: './www/css/site.css'
					}
				]
			},
			site_js: {
				files: [
					{
						src: [
							"./build/src/site.js",
							"./build/src/sample_data.js",
							"./build/src/EditableTableExample.class.js",
							"./build/src/ChangelogPage.class.js",
							"./build/src/ExamplesPage.class.js",
							"./build/src/WidgetsPage.class.js",
							"./build/src/MainPageTree.class.js",
							"./build/temp/example_box_widget.js",
							"./build/temp/editable_table_widget.js",
							"./build/temp/main_page_widgets_template.js"
						],
						dest: './www/js/site.js'
					}
				]
			}
		}

		//lavadoc_files: ['./build/reference/**/*.md'],

	});

	grunt.option('stack', true);
	grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadTasks('build/tasks/');

	// Note: all tasks depend on previous tasks
	grunt.registerTask('default', ['buildLava', 'buildIncludes', 'buildExamples', 'buildWeb', 'buildTasksPage', 'concat']);

};