/*
depends on previous tasks
 */

var ApiHelper = require('../ApiHelper.js');

module.exports = function(grunt) {

	var ApiCommon = null;
	eval(grunt.file.read('build/src/ApiCommon.js'));

	grunt.registerTask('buildSupport', function() {

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			var fs = require('fs');

			var Lava = global.Lava;
			var LavaBuild = global.LavaBuild;
			var jsdoc_support = eval('(' + grunt.file.read('build/temp/jsdoc_support_export.js') + ')');
			var result = '';

			if (jsdoc_support.typedefs) {
				result += '<h2 class="api-member-group-header">Type definitions</h2>\n\n';
				jsdoc_support.typedefs.forEach(function(data){
					result += '<h3>' + data.name + '</h3>\n';
					if (data.description) result += '<div>' + LavaBuild.processMarkdown(data.description) + '</div>\n';
					result += '<table class="api-member-table"><thead><tr><td>Types</td></tr></thead><tbody>';
					data.type_names.forEach(function(name){
						result += '<tr><td class="api-name-column">' + name + '</td></tr>\n'
					});
					result += '</tbody></table>\n\n';
				});
			}

			if (jsdoc_support.enums) {
				result += '<h2 class="api-member-group-header">Enums</h2>\n\n';
				jsdoc_support.enums.forEach(function(data){
					result += '<h3>' + data.name + '</h3>\n';
					if (data.description) result += '<div>' + LavaBuild.processMarkdown(data.description) + '</div>\n';
					if (data.type_names) {
						if (['number', 'string'].indexOf(data.type_names[0]) == -1) throw new Error(); // unknown type
						result += '<div><b>Type: </b> ' + data.type_names[0] + '</div>';
					}

					result += '<table class="api-member-table">' +
						'<thead>' +
						'<tr><td>Name</td><td>Value</td><td>Description</td></tr>' +
						'</thead><tbody>';
					data.properties.forEach(function(property_data){
						var tmp = {};
						ApiHelper.setDefaultFromValue(tmp, property_data.value);
						result += '<tr>' +
							'<td class="api-name-column">' + property_data.name + '</td>' +
							'<td>' + tmp.default_value + '</td>' +
							'<td>' + (property_data.description ? LavaBuild.processMarkdown(property_data.description) : '') + '</td>' +
							'</tr>\n'
					});
					result += '</tbody></table>\n\n';
				});
			}

			if (jsdoc_support.callbacks) {
				result += '<h2 class="api-member-group-header">Callbacks</h2>\n\n';
				jsdoc_support.callbacks.forEach(function(data){
					result += '<h3>' + data.name + '</h3>\n';
					if (data.description) result += '<div>' + LavaBuild.processMarkdown(data.description) + '</div>\n';
					if (data.params) {
						data.params.forEach(function(param_descriptor) {
							if (param_descriptor.description) param_descriptor.description = LavaBuild.processMarkdown(param_descriptor.description);
						});
						result += '<div><b>Arguments:</b></div>';
						result += ApiCommon.renderParamsTable(data.params, 'api-member-table');
						result += '\n\n';
					}
					if (data.returns) {
						if (data.returns.description) data.returns.description = LavaBuild.processMarkdown(data.returns.description);
						result += '<br/>' + ApiCommon.renderReturns(data.returns);
					}
				});
			}

			if (jsdoc_support.objects) {
				jsdoc_support.objects.forEach(function(descriptor){
					if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
					if (descriptor.member_chain) {
						descriptor.member_chain.forEach(function(block){
							block.descriptors.forEach(function(descriptor){
								if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
							})
						})
					}
					if (descriptor.method_chain) {
						descriptor.method_chain.forEach(function(block){
							block.descriptors.forEach(function(descriptor){
								if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
								if (descriptor.params) {
									descriptor.params.forEach(function(descriptor){
										if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
									})
								}
								if (descriptor.returns) {
									descriptor.returns.forEach(function(descriptor){
										if (descriptor.description) descriptor.description = LavaBuild.processMarkdown(descriptor.description);
									})
								}
							})
						})
					}
				});
			}

			fs.writeFileSync('www/api/Support.js', JSON.stringify({
				description: result,
				support_objects: jsdoc_support.objects
			}));

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};