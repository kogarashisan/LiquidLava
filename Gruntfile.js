
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

		wrapHighlightedCode: function(code, type, line_numbers, overlay_lines, tooltip_lines) {

			return '<div class="lava-code-container">'
					+ this._wrapCodeBlock(code, type, line_numbers, overlay_lines, tooltip_lines)
				+ '</div>';

		},

		_wrapCodeBlock: function(code, type, line_numbers, overlay_lines, tooltip_lines) {

			return '<div class="lava-code">'
					+ '<pre class="lava-code-line-numbers">' + line_numbers + '</pre>'
					+ '<pre class="lava-code-content hljs ' + type + '">' + code + '</pre>'
					+ (overlay_lines ? (
						'<div class="lava-code-overlay">' + overlay_lines + '</div>'
							+ '<div class="lava-code-tooltips">' + tooltip_lines + '</div>'
						) : '')
				+ '</div>';

		},

		wrapHighlightedBlocks: function(blocks, custom_wrapper_class) {

			var content = '',
				block,
				parse_result,
				i = 0,
				count = blocks.length;

			for (; i < count; i++) {
				block = blocks[i];
				parse_result = block['parse_result'];
				if (block['header_text']) {
					content += '<div class="api-code-header ' + (block['custom_class'] || '') + '">' + block['header_text'] + '</div>\n';
				}
				content += this._wrapCodeBlock(parse_result.text, parse_result.type, parse_result.lines_text, parse_result.overlay_text, parse_result.tooltip_text);
			}

			return '```formatted\n<div class="lava-code-container ' + (custom_wrapper_class || 'lava-code-container-plain') + '">' + content + '</div>\n```';

		},

		highlight: function(type, text) {

			var parse_result = this.parseHighlight(type, text);
			return this.wrapHighlightedCode(parse_result.text, parse_result.type, parse_result.lines_text, parse_result.overlay_text, parse_result.tooltip_text);

		},

		CSS_CODE_LINE_HEIGHT: 18,

		parseHighlight: function(type, text) {

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
				var skip_lines_count = 0;
				for (var i = 0; i <= max_tooltip_index; i++) {
					if (i in tooltips) {
						var style_css = skip_lines_count ? (' style="margin-top: ' + skip_lines_count * this.CSS_CODE_LINE_HEIGHT + 'px"') : '';
						overlay_text += '<div' + style_css + ' class="lava-code-overlay-line"></div>';
						tooltip_text += '<div' + style_css + ' data-tooltip="' + tooltips[i] + '"></div>';
						skip_lines_count = 0;
					} else {
						skip_lines_count++;
					}
				}
			}

			var highlighted = this.highlight_js.highlight(type, text).value;

			if (type == 'xml') {
				// make control attributes red
				highlighted = highlighted.replace(/\<span class="hljs-attribute"\>x:([\s\S]+?)\<\/span>/g, function() {
					return '<span class="lava-control-prefix">x</span><span class="hljs-attribute">:' + arguments[1] + '</span>';
				});
			}

			return {
				text: highlighted,
				type: type,
				lines_text: this.createLineNumbers(text),
				overlay_text: overlay_text,
				tooltip_text: tooltip_text
			};

		},

		createLineNumbers: function(text) {
			var count_lines = text.split('\n').length;
			var lines_text = '&nbsp;&nbsp;';
			for (var i = 1; i <= count_lines; i++) {
				lines_text += i + '\r\n';
			}
			return lines_text;
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

		links: {}, // target -> descriptor
		_page_links: {
			'api': '/www/doc.html',
			'reference': '/www/doc.html',
			'tutorials': '/www/doc.html'
		},

		registerLink: function(target, descriptor) {
			if (!(descriptor.page in this._page_links)) throw new Error('1');
			if (target in this.links) throw new Error('link is already registered. probably, missing @ignore');
			this.links[target] = descriptor;
		},

		has_errors: false,

		generateLink: function(type, link_target, linktitle) {
			if (!(link_target in this.links)) {
				grunt.log.error('doc: link is not registered: ' + link_target);
				this.has_errors = true;
				return '[ERROR: INVALID LINK]';
			}
			var link_descriptor = this.links[link_target];
			var href = this._page_links[link_descriptor.page] + '#' + link_descriptor.hash;
			linktitle = linktitle || link_target;
			if (linktitle == link_target && link_descriptor.title) {
				linktitle = link_descriptor.title;
			}
			return '<a href="' + href + '">' + linktitle + '</a>';
		},

		objects_with_processed_markdown: [],
		processDescriptorMarkdown: function(descriptor) {
			if (this.objects_with_processed_markdown.indexOf(descriptor) == -1) {
				this.objects_with_processed_markdown.push(descriptor);

				if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
				// for events
				if (descriptor.argument_description) descriptor.argument_description = LavaBuild.processMarkdown(descriptor.argument_description);

				if (descriptor.type_names) {
					var new_type_names = [];
					descriptor.type_names.forEach(function(value){

						if (value.indexOf(' href=') != -1) throw new Error();
						var parts = value.replace(/(Lava[\.a-zA-Z\_]*|[\_a-zA-Z]+)/g, function(string){
							return '\n' + string + '\n';
						}).split('\n');

						for (var i = 0, count = parts.length; i < count; i++) {
							if (!parts[i]) continue;
							if (parts[i] in LavaBuild.links) {
								parts[i] = LavaBuild.generateLink(':types', parts[i], parts[i]);
							} else {
								parts[i] = Firestorm.String.escape(parts[i], Firestorm.String.HTML_ESCAPE_REGEX);
							}
						}

						new_type_names.push(parts.join(''));

					});
					descriptor.type_names = new_type_names;
				}
			}
		},

		_replaceMarkers: function(content) {

			content = content.replace(/\<kw\>([\s\S]+?)\<\/kw\>/g, function(match, inner) {
				return '<span class="api-keyword">' + inner + '</span>';
			});
			content = content.replace(/\<str\>([\s\S]+?)\<\/str\>/g, function(match, inner) {
				return '<span class="api-string">'
					+ global.Firestorm.String.escape(inner, global.Firestorm.String.HTML_ESCAPE_REGEX)
					+ '</span>';
			});
			content = content.replace(/\<wp\>([\s\S]+?)\<\/wp\>/g, function(match, inner) {
				return '<span class="api-widget-property">' + inner + '</span>';
			});

			return content;

		},

		_replaceLinks: function(content) {

			return content.replace(/\{\@(link) ([^\\\}]|\\.)+\}/g, function(match, type) {
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

		},

		_packCode: function(type, header_text, custom_class, src) {

			return {
				header_text: header_text,
				custom_class: custom_class,
				parse_result: type == 'text' ? {
					text: src,
					type: 'text',
					lines_text: this.createLineNumbers(src)
				} : this.parseHighlight(type, src)
			};

		},

		// eval and format special code blocks
		_replaceCodes: function(content) {

			var self = this;

			function evalResult(src) {
				var __sanitized_content = src.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s\;]+$/, '');
				var result;
				var __eval_result;
				try {
					__eval_result = eval('(' + __sanitized_content + ')');
				} catch (e) {
					result = void 0;
					__eval_result = eval(__sanitized_content);
				}
				return result || __eval_result;
			}

			// for dynamic content generation (tables, etc). Eval the given piece of code and return result.
			content = content.replace(/\<script[^\>]+?type=\"lavabuild\/eval\"[\S\s]+?\<\/script>/g, function(region){
				var ast = global.Lava.TemplateParser.parseRaw(region);
				var result;
				eval(ast[0].content[0]);
				return result;
			});

			// eval the code and make a box with 2 sections: 'source' and 'result'
			content = content.replace(/\<script[^\>]+?type=\"lavabuild\/source_result\"[\S\s]+?\<\/script>/g, function(region){
				var ast = global.Lava.TemplateParser.parseRaw(region);
				if (ast.length != 1 || !ast[0].attributes) throw new Error('wrong lavabuild/js region format');
				var region_content = ast[0].content[0];

				var eval_result = evalResult(region_content);
				var serialized_eval_result = self.smartSerialize(eval_result);
				return self.wrapHighlightedBlocks([
					self._packCode('javascript', 'Source', 'api-code-header-blue', region_content),
					self._packCode('text', 'Result', 'api-code-header-blue', serialized_eval_result)
				]);
			});

			// several highlighted blocks of code with headers
			content = content.replace(/\<lavabuild\:codeblocks\>([\s\S]+?)\<\/lavabuild\:codeblocks\>/g, function(region, inner_content){
				// regex includes cases for "\>" inside strings
				var re = /(\<codeblock(?:[^\"\'\>]|\"(?:\\\"|[^"])*\"|\'(?:\\\'|[^'])*\')*\>)([\s\S]+?)(\<\/codeblock\>)/g;
				var parsed_blocks = [];

				while(true) {
					var matches = re.exec(inner_content);
					if (!matches) break;
					var tag_ast = global.Lava.TemplateParser.parseRaw(matches[1] + matches[3])[0]; // extract attributes
					if (!tag_ast.attributes) throw new Error('codeblock without attributes');
					var lang = tag_ast.attributes.lang || 'javascript';
					parsed_blocks.push(self._packCode(lang, tag_ast.attributes.title, tag_ast.attributes.class, matches[2]));
				}

				return self.wrapHighlightedBlocks(parsed_blocks);
			});

			content = content.replace(/\<lavabuild\:template_result[^\>]*?\>([\s\S]+?)\<\/lavabuild\:template_result\>/g, function(region, region_content_text){
				var ast = global.Lava.TemplateParser.parseRaw(region);
				if (ast.length != 1 || !ast[0].content) throw new Error('wrong lavabuild/template_result region format');
				var region_content;
				var as = ast[0].attributes ? ast[0].attributes.as : '';
				switch (as) {
					case 'single_view':
						region_content = global.Lava.parsers.Common.compileAsView(ast[0].content);
						break;
					default:
						region_content = global.Lava.parsers.Common.compileTemplate(ast[0].content)
				}

				var serialized_eval_result = self.smartSerialize(region_content);
				return self.wrapHighlightedBlocks([
					self._packCode('xml', 'Template source', 'api-code-header-blue', region_content_text),
					self._packCode('javascript', 'Parse result', 'api-code-header-blue', serialized_eval_result)
				]);
			});

			return content;

		},

		for_template: false,

		processMarkdown: function(content, for_template) {

			this.for_template = for_template;
			content = this._replaceMarkers(content);
			content = this._replaceCodes(content);
			content = this._replaceLinks(content);
			var result = this.marked(content);
			this.for_template = false;
			return result;

		},

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// lava-style search for files in directory

		_expand_result: [],

		expand: function(base_path, extension) {

			this._expand_result = [];
			this._expand(base_path, base_path, extension);
			return this._expand_result;

		},

		_expand: function(base_path, path, extension) {

			var names = this.fs.readdirSync(path),
				full_name,
				relative_path,
				filename,
				i = 0,
				count = names.length,
				parts;

			for (; i < count; i++) {
				full_name = path + names[i];
				if (this.fs.lstatSync(full_name).isDirectory()) {
					this._expand(base_path, full_name + '/', extension);
				} else {
					if (names[i].substr(-extension.length) != extension) throw new Error();
					relative_path = path.substr(base_path.length) + names[i].substr(0, names[i].length - extension.length);
					parts = relative_path.split('/');
					filename = parts.pop();
					this._expand_result.push({
						name: filename,
						path_segments: parts.length ? parts : null,
						full_name: full_name,
						relative_path: relative_path
					});
				}
			}

		}

		//
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	};

	var LavaBuild = global.LavaBuild;
	LavaBuild.marked.Renderer.prototype.code = function(code, lang, escaped) {

		var result = '';
		if (!lang) throw new Error('highlight: no language specified');
		if (lang == 'text') {
			result = LavaBuild.wrapHighlightedCode(code, 'text', LavaBuild.createLineNumbers(code), '', '');
		} else if (lang == 'xml' || lang == 'javascript') {
			result = LavaBuild.highlight(lang, code);
		} else if (lang == 'formatted') {
			result = code;
		} else {
			throw new Error('highlight: unknown language');
		}
		return LavaBuild.for_template ? ('{literal:}' + result + '{:literal}') : result;

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
							"./build/src/DocPage.class.js",
							"./build/src/ExamplesPage.class.js",
							"./build/src/WidgetsPage.class.js",
							"./build/src/ApiCommon.js",
							"./build/src/MooTools/More.js",
							"./build/src/MooTools/Fx.Scroll.js",
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
	grunt.registerTask('doc', ['jsdocExport', 'buildSugar', 'buildDoc', 'buildSupport']);

};