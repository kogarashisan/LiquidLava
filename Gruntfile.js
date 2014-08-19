
module.exports = function(grunt) {

	global.LavaBuild = {
		//grunt: grunt,
		highlight_js: require('highlight.js'),
		fs: require('fs'),
		marked: require('marked'),
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

			var tooltips = {};
			var max_tooltip_index = 0;
			var tooltip_text = '';
			var overlay_text = '';

			// extract regions with tooltips
			[/\{\*H\:([\s\S]+?)\*\}/g, /\/\*H\:([\s\S]+?)\*\//g].forEach(function(tooltip_pattern){
				text = text.replace(tooltip_pattern, function(full_comment, tooltip_text, index, source) {

					// count the lines before the tooltip
					var tooltip_index = source.substr(0, index).split('\n').length;
					if (tooltip_index > max_tooltip_index) {
						max_tooltip_index = tooltip_index;
					}
					tooltips[tooltip_index - 1] = tooltip_text;
					return '';

				});
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

			var lines_text = this._createLineNumbers(text);
			var highlighted = this.highlight_js.highlight(type, text).value;

			if (type == 'xml') {
				// make control attributes red
				highlighted = highlighted.replace(/\<span class="hljs-attribute"\>x:([\s\S]+?)\<\/span>/g, function() {
					return '<span class="lava-control-prefix">x</span><span class="hljs-attribute">:' + arguments[1] + '</span>';
				});
			}

			return this._wrapHighlightedCode(highlighted, type, lines_text, overlay_text, tooltip_text);

		},

		_createLineNumbers: function(text) {
			var count_lines = text.split('\n').length;
			var lines_text = '';
			for (i = 1; i <= count_lines; i++) {
				lines_text += i + '\r\n';
			}
			return lines_text;
		},

		wrapText: function(text) {
			var lines_text = this._createLineNumbers(text);
			this._wrapHighlightedCode(text, 'text', lines_text, '', '');
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

		/**
		 * Serializer does not indent function bodies, cause author was not sure that it's safe to do so
		 */
		smartSerialize: function(value) {

			var original = global.Lava.Serializer._serializeFunction;
			global.Lava.Serializer._serializeFunction = this._serializeFunction;
			var result = global.Lava.Serializer.serialize(value);
			global.Lava.Serializer._serializeFunction = original;
			return result;

		},

		recursiveRemoveDirectory: function(path) {
			var self = this;
			if(this.fs.existsSync(path) ) {
				this.fs.readdirSync(path).forEach(function(file){
					var curPath = path + "/" + file;
					if(self.fs.lstatSync(curPath).isDirectory()) {
						self.recursiveRemoveDirectory(curPath);
					} else {
						self.fs.unlinkSync(curPath);
					}
				});
				this.fs.rmdirSync(path);
			}
		},

		sandbox_eval: function(code) {
			return eval(code);
		},

		_links: {}, // target -> descriptor
		_page_links: {
			'api': '/www/api.html'
		},

		registerLink: function(target, descriptor) {
			if (!(descriptor.page in this._page_links)) throw new Error();
			this._links[target] = descriptor;
		},

		generateLink: function(type, link_target, linktitle) {
			if (!(link_target in this._links)) throw new Error('doc: link is not registered: ' + link_target);
			var link_descriptor = this._links[link_target];
			var href = this._page_links[link_descriptor.page] + '#' + link_descriptor.hash;
			linktitle = linktitle || link_target;
			if (linktitle == link_target && link_descriptor.title) {
				linktitle = link_descriptor.title;
			}
			return '<a href="' + href + '">' + linktitle + '</a>';
		},

		processMarkdown: function(content) {

			// eval and format special code blocks
			content = content.replace(/\<script[^\>]+?type=\"lavabuild\/js\"[\S\s]+?\<\/script>/g, function(region){
				var ast = global.Lava.TemplateParser.parseRaw(region);
				if (ast.length != 1 || !ast[0].attributes) throw new Error('wrong lavabuild/js region format');
				var region_content = ast[0].content[0];
				var replace_result = '```javascript\n' + region_content + '\n```\n';
				if ('eval' in ast[0].attributes) {
					var sanitized_region_content = region_content.trim();
					if (sanitized_region_content[sanitized_region_content.length - 1] == ';') {
						sanitized_region_content = sanitized_region_content.substr(0, sanitized_region_content.length - 1);
					}
					var eval_result = this.sandbox_eval('(' + sanitized_region_content + ')');
					replace_result += '```text\n' + Lava.Serializer.serialize(eval_result) + '\n```\n';
				}
				return replace_result;
			});

			// replace links
			content = content.replace(/\{\@(link) ([^\\\}]|\\.)+\}/g, function(match, type) {
				// type is the content of the first brace (the instruction name): "link", "apilink", "reflink" and so on
				var linktarget = match.substr(0, match.length - 1).substr(type.length + 3).trim(); // leave only the content
				var linktitle = linktarget;
				var separator_index = linktarget.indexOf('|');
				if (separator_index != -1) { // includes title, not just name/url
					linktitle = linktarget.substr(separator_index + 1);
					linktarget = linktarget.substr(0, separator_index);
				}
				return LavaBuild.generateLink(type, linktarget, linktitle);
			});

			return this.marked(content);

		}

	};

	var LavaBuild = global.LavaBuild;
	LavaBuild.marked.Renderer.prototype.code = function(code, lang, escaped) {

		var result = '';
		if (!lang) throw new Error('highlight: no language specified');
		if (lang == 'text') {
			result = LavaBuild.wrapText(code);
		} else if (lang == 'xml' || lang == 'javascript') {
			result = LavaBuild.highlight(lang, code);
		}
		return result;

	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
							"./build/src/ContentLoader.class.js",
							"./build/src/ChangelogPage.class.js",
							"./build/src/ApiPage.class.js",
							"./build/src/ExamplesPage.class.js",
							"./build/src/WidgetsPage.class.js",
							"./build/temp/site_widgets.js"
						],
						dest: './www/js/site.js'
					}
				]
			}
		}

	});

	grunt.option('stack', true);
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadTasks('build/tasks/');

	// Note: all tasks depend on previous tasks
	grunt.registerTask('default', ['buildLava', 'buildIncludes', 'buildExamples', 'buildWeb', 'buildTasksPage', 'concat']);
	grunt.registerTask('doc', ['jsdocExport', 'buildDoc']);

};