
// warning: task loads and modifies widget configs

module.exports = function(grunt) {

	grunt.registerTask('buildSugar', function() {

		function wrapInTag(tag_name, content, attributes_string) {
			return '<div class="api-sugar-tag-outer-wrapper"><span class="hljs-tag">&lt;<span class="hljs-title">' + tag_name + '</span>' + (attributes_string || '') + '&gt;</span>'
				+ (content ? ('<div class="api-sugar-tag-inner-wrapper">\n' + content + '</div>') : '')
				+ '<span class="hljs-tag">&lt;/<span class="hljs-title">' + tag_name + '</span>&gt;</span></div>\n';
		}

		function renderTemplate(name) {
			var tooltip_text = name ? (' data-tooltip="Name: ' + name + '"') : '';
			return '<div class="api-sugar-container-template api-sugar-container" ' + tooltip_text + '>&nbsp;</div>\n';
		}

		/**
		 * @param {_cStorageItemSchema} item_schema
		 * @param {string} tag_name
		 * @param {boolean} content_only
		 * @param {string} additional_attributes
		 * @returns {string}
		 */
		function renderStorageObject(item_schema, tag_name, content_only, additional_attributes) {

			var html = '',
				fragment,
				attributes = {},
				descriptor;

			for (var name in item_schema.properties) {
				descriptor = item_schema.properties[name];
				if (descriptor.is_attribute) {
					attributes[name] = descriptor;
					continue;
				}

				switch (descriptor.type) {
					case 'template':
						fragment = renderTemplate();
						break;
					case 'lava_type':
						fragment = '<div class="api-sugar-container-type api-sugar-container">' + descriptor.type_name + '</div>\n';
						break;
					default:
						throw new Error();
				}

				html += wrapInTag(name, fragment);

			}

			//html = '<div class="api-sugar-object-content-wrapper">' + html + '</div>';

			if (!content_only) {
				html = wrapInTag(
					tag_name,
					html,
					renderAttributes(attributes) + (additional_attributes || '')
				);
			}

			return html;

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
						throw new Error();
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
						tooltip = 'Option\nType: &amp;lt;targets&amp;gt;';
						break;
					case 'expression_option':
						tooltip = 'Option\nType: &amp;lt;expression&amp;gt;';
						break;
					// object
					case 'lava_type':
						tooltip = _addAttributeTooltipData('Property', mappings[name], name);
						break;
					default:
						throw new Error();
				}
				result += ' <span class="hljs-attribute" ' + (tooltip ? ' data-tooltip="' + tooltip + '"' : '') + '>' + name + '</span>';
			}
			return result;
		}

		function renderStorage(storage_schema, content_only) {

			var result = '',
				fragment,
				item_schema;

			for (var name in storage_schema) {
				item_schema = storage_schema[name];
				fragment = '';
				switch (item_schema.type) {
					case 'template_collection':
						fragment = '<div class="api-sugar-container-template-collection api-sugar-container">\n'
							+ wrapInTag(item_schema.tag_name, renderTemplate())
							+ '</div>\n';
						if (!content_only) fragment = wrapInTag(name, fragment);
						break;
					case 'template_hash':
						fragment = '<div class="api-sugar-container-template-hash api-sugar-container">\n'
							+ wrapInTag(item_schema.tag_name, renderTemplate(), ' name')
							+ '</div>\n';
						if (!content_only) fragment = wrapInTag(name, fragment);
						break;
					case 'object':
						fragment = renderStorageObject(item_schema, name, content_only);
						break;
					case 'object_collection':
						fragment = '<div class="api-sugar-container-object-collection api-sugar-container">\n'
							+ renderStorageObject(item_schema, item_schema.tag_name, false)
							+ '</div>\n';
						if (!content_only) fragment = wrapInTag(name, fragment);
						break;
					case 'object_hash':
						fragment = '<div class="api-sugar-container-object-hash api-sugar-container">\n'
							+ renderStorageObject(item_schema, item_schema.tag_name, false, ' name')
							+ '</div>\n';
						if (!content_only) fragment = wrapInTag(name, fragment);
						break;
					default:
						throw new Error();
				}
				result += fragment;
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
				var html = '<h2 id="' + title + '" data-scroll-name="member:' + title + '">' + title + '</h2>\n';
				if (widget_config.extends) html += '<div>Extends: ' + widget_config.extends + '</div>';
				html += '<div>Controller: <a href="#object=' + class_path + '">' + class_path + '</a></div>\n';

				if (sugar_config['root_resource_name']) {
					html += '<div>Unknown root attributes: stored as ' + sugar_config['root_resource_name'] + ' resource</div>\n';
				}

				if (sugar_config.content_schema) {
					var content_schema = sugar_config.content_schema;
					fragment += '\n';
					switch (content_schema.type) {
						case 'include':
							fragment += renderTemplate(content_schema.name);
							break;
						case 'storage':
						case 'union':
							for (var name in content_schema.tag_roles) {
								if (content_schema.tag_roles[name].type != 'include') throw new Error();
								fragment += wrapInTag(name, renderTemplate(content_schema.tag_roles[name].name));
							}
							fragment += renderStorage(widget_config.storage_schema);
							break;
						case 'storage_object':
							var cut_schema = {};
							cut_schema[content_schema.name] = widget_config.storage_schema[content_schema.name];
							fragment += renderStorage(cut_schema, true);
							break;
						default:
							throw new Error();
					}
				}

				result += html
					+ '<div class="bs-example api-sugar-wrapper xml">'
						+ wrapInTag(sugar_config.tag_name, fragment, renderAttributes(sugar_config.attribute_mappings))
					+ '</div>\n\n';

				LavaBuild.registerLink('sugar:' + title, {
					hash: 'object=Widgets;member=' + title,
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
			LavaBuild.recursiveRemoveDirectory('www/reference/');
			fs.mkdirSync('www/reference/');

			var temp = JSON.stringify({
				description: result
			});
			grunt.file.write('www/api/Widgets.js', temp);

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};