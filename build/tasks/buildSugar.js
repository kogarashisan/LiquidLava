
// warning: task loads and modifies widget configs

module.exports = function(grunt) {

	grunt.registerTask('buildSugar', function() {

		function wrapInTag(tag_name, content, attributes_string) {
			return '<div class="api-sugar-tag-outer-wrapper"><span class="hljs-tag">&lt;<span class="hljs-title">' + tag_name + '</span>' + (attributes_string || '') + '&gt;</span>'
				+ (content ? ('<div class="api-sugar-tag-inner-wrapper">\n' + content + '</div>') : '')
				+ '<span class="hljs-tag">&lt;/<span class="hljs-title">' + tag_name + '</span>&gt;</span></div>\n';
		}

		function renderTemplate() {
			return '<div class="api-sugar-container-template api-sugar-container">&nbsp;</div>\n';
		}

		function renderObjectContent(tag_mappings) {

			var html = '',
				fragment;

			for (var name in tag_mappings) {
				switch (tag_mappings[name].type) {
					case 'template':
						fragment = renderTemplate();
						break;
					case 'type':
						fragment = '<div class="api-sugar-container-type api-sugar-container">' + tag_mappings[name].type_name + '</div>\n';
						break;
					default:
						throw new Error();
				}
				html += wrapInTag(name, fragment);
			}

			return html;

		}

		function renderObject(content_schema, tag_name, additional_attributes) {

			return wrapInTag(
				tag_name,
				renderObjectContent(content_schema.tag_mappings),
				renderAttributes(content_schema.attribute_mappings) + (additional_attributes || '')
			);

		}

		function renderTemplateCollection(content_schema) {
			return '<div class="api-sugar-container-template-collection api-sugar-container">\n'
					+ wrapInTag(content_schema.tag_name, renderTemplate())
				+ '</div>\n';
		}

		function renderObjectCollection(content_schema) {
			return '<div class="api-sugar-container-object-collection api-sugar-container">\n'
					+ renderObject(content_schema, content_schema.tag_name)
				+ '</div>\n';
		}

		function _addAttributeTooltipData(src_text, attribute_descriptor, name) {
			if (attribute_descriptor.name && name != attribute_descriptor.name) src_text += '\nName: ' + attribute_descriptor.name;
			if (attribute_descriptor.type_name) src_text += '\nType: ' + attribute_descriptor.type_name;
			return src_text;
		}

		function renderAttributes(mappings) {
			var result = '';
			for (var name in mappings) {
				var tooltip = '';
				switch (mappings[name].type) {
					// root
					case 'id':
						tooltip = 'ID';
						break;
					case 'option':
						tooltip = _addAttributeTooltipData('Option', mappings[name], name);
						break;
					case 'switch':
						tooltip = _addAttributeTooltipData('Switch', mappings[name], name);
						break;
					case 'property':
						tooltip = _addAttributeTooltipData('Property', mappings[name], name);
						break;
					case 'targets_option':
						tooltip = 'Option\nType: &lt;targets&gt;';
						break;
					case 'expression_option':
						tooltip = 'Option\nType: &lt;expression&gt;';
						break;
					// object
					case 'object_property':
						tooltip = _addAttributeTooltipData('Property', mappings[name], name);
						break;
					default:
						throw new Error();
				}
				result += ' <span class="hljs-attribute" ' + (tooltip ? ' data-tooltip="' + tooltip + '"' : '') + '>' + name + '</span>';
			}
			return result;
		}

		function getControllerPath(widget_config) {
			if (!Lava.ClassManager.getConstructor(widget_config.real_class, 'Lava.widget')) throw new Error();
			return (widget_config.real_class.indexOf('Lava.') == 0) ? widget_config.real_class : 'Lava.widget.' + widget_config.real_class;
		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			if (!global.Lava) {
				require('../temp/lava_module.js');
			}
			require('../temp/lava_widgets.js');

			var fs = require('fs'),
				Lava = global.Lava,
				Firestorm = global.Firestorm,
				LavaBuild = global.LavaBuild,
				result = '',
				inner_content,
				associated_widgets_by_controller = {}, // exported
				widgets_without_sugar = [];

			global.associated_widgets_by_controller = associated_widgets_by_controller;

			for (var title in Lava.widgets) {

				var fragment = '';
				var class_path = '';
				var widget_config = Lava.getWidgetConfig(title);

				if (widget_config.real_class) class_path = getControllerPath(widget_config);
				if (!associated_widgets_by_controller[class_path]) associated_widgets_by_controller[class_path] = [];

				var sugar_config = widget_config.sugar;
				if (!sugar_config || !sugar_config.tag_name) {
					widgets_without_sugar.push(title);
					associated_widgets_by_controller[class_path].push({
						title: title,
						has_sugar: false
					});
					continue;
				} else {
					associated_widgets_by_controller[class_path].push({
						title: title,
						has_sugar: true
					});
				}

				if (!widget_config.real_class) throw new Error();
				var html = '<h2 id="' + title + '">' + title + '</h2>\n';
				if (widget_config.extends) html += '<div>Extends: ' + widget_config.extends + '</div>';
				html += '<div>Controller: <a href="#object=' + class_path + '">' + class_path + '</a></div>\n';

				if (sugar_config['unknown_root_attributes']) {
					var action_html = '&lt;' + sugar_config['unknown_root_attributes'].type + '&gt;';
					if (sugar_config['unknown_root_attributes'].type == 'as_resource') {
						action_html = 'stored as ' + sugar_config['unknown_root_attributes'].container_resource_name + ' resource';
					}
					html += '<div>Unknown root attributes: ' + action_html + '</div>\n';
				}

				if (sugar_config.content_schema) {
					var content_schema = sugar_config.content_schema;
					fragment += '\n';
					switch (content_schema.type) {
						case 'template':
							fragment += renderTemplate();
							break;
						case 'template_collection':
							fragment += renderTemplateCollection(content_schema);
							break;
						case 'template_hash':
							fragment +=
								'<div class="api-sugar-container-template-hash api-sugar-container">\n'
									+ wrapInTag(content_schema.tag_name, renderTemplate(), ' name')
								+ '</div>\n';
							break;
						case 'object':
							fragment += '<div class="api-sugar-object-content-wrapper">'
									+ renderObjectContent(content_schema.tag_mappings)
								+ '</div>';
							break;
						case 'object_collection':
							fragment += renderObjectCollection(content_schema);
							break;
						case 'object_hash':
							fragment +=
								'<div class="api-sugar-container-object-collection api-sugar-container">\n'
									+ renderObject(content_schema, content_schema.tag_name, ' name')
								+ '</div>\n';
							break;
						case 'object_map':
							fragment += '<div class="api-sugar-container-object-map api-sugar-container">\n';
							for (var name in content_schema.tag_roles) {
								switch (content_schema.tag_roles[name].type) {
									case 'template':
										inner_content = renderTemplate();
										fragment += wrapInTag(name, inner_content);
										break;
									case 'template_collection':
										inner_content = renderTemplateCollection(content_schema.tag_roles[name]);
										fragment += wrapInTag(name, inner_content);
										break;
									case 'object':
										fragment += renderObject(content_schema.tag_roles[name], name);
										break;
									case 'object_collection':
										inner_content = renderObjectCollection(content_schema.tag_roles[name]);
										fragment += wrapInTag(name, inner_content);
										break;
									case 'template_hash':
										inner_content =
											'<div class="api-sugar-container-template-hash api-sugar-container">\n'
												+ wrapInTag(content_schema.tag_roles[name].tag_name, renderTemplate(), ' name')
											+ '</div>\n';
										fragment += wrapInTag(name, inner_content);
										break;
									case 'object_hash':
										fragment +=
											'<div class="api-sugar-container-object-collection api-sugar-container">\n'
												+ renderObject(content_schema.tag_roles[name], content_schema.tag_roles[name].tag_name, ' name')
												+ '</div>\n';
										fragment += wrapInTag(name, inner_content);
										break;
									default:
										throw new Error();
								}
							}
							fragment += '</div>\n';
							break;
						default:
							throw new Error();
					}
				}

				result += html
					+ '<div class="api-sugar-wrapper xml">'
						+ wrapInTag(sugar_config.tag_name, fragment, renderAttributes(sugar_config.attribute_mappings))
					+ '</div>\n\n';

				LavaBuild.registerLink('sugar:' + title, {
					hash: 'object=sugar;member=' + title,
					page: 'api',
					title: title,
					type: 'sugar'
				});

			}

			if (widgets_without_sugar.length) {
				result += '\n\n<h2>Widgets without sugar</h2>'
					+ '<table class="api-member-table"><thead><tr><td>Title</td><td>Controller</td><td>Extends</td></tr></thead><tbody>';
				widgets_without_sugar.forEach(function(title) {

					var controller_link = '';
					if (Lava.widgets[title].real_class) {
						var class_path = getControllerPath(Lava.widgets[title]);
						controller_link = '<a href="#object=' + class_path + '">' + class_path + '</a>'
					}
					result += '<tr>'
						+ '<td>' + title + '</td>'
						+ '<td>' + controller_link + '</td>'
						+ '<td>' + (Lava.widgets[title].extends || '') + '</td>'
						+ '</tr>'
				});
				result += '</tbody></table>';

			}

			LavaBuild.recursiveRemoveDirectory('www/api/');
			fs.mkdirSync('www/api/');

			var temp = JSON.stringify({
				description: result
			});
			grunt.file.write('www/api/Sugar.js', temp);

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};