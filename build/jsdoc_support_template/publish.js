/**
 * Requires JSDoc: latest master after 3.3.0-alpha9 (25.08.14)
 * @file
 */

/*
typedefs = []
	name
	description
	type_names
enums = []
	name
	description
	type_names
	properties = []
		name
		value
		description
callbacks = []
	name
	description
	params
	returns
objects = []
	name
	description
	is_interface
	extends_list = [] // list of @extends type names

	member_chain = []
	method_chain = []
 */

var template = require('jsdoc/template'),
    fs = require('jsdoc/fs'),
    path = require('jsdoc/path'),
    handle = require('jsdoc/util/error').handle,
	ApiHelper = require('../ApiHelper.js');

exports.publish = function(taffyData, opts, tutorials) {

	taffyData({ignore: true}).remove();
	taffyData({scope: 'inner'}).remove();
	var doclets = taffyData().get();

	var export_descriptor;
	// the current descriptor, which is collecting members
	var current_object_package;
	var current_object_package_type;
	var support_links = [];
	var all_extends_names = [];
	var all_names = [];

	var typedefs = [];
	var enums = [];
	var callbacks = [];
	var objects = [];

	for (var i = 0, count = doclets.length; i < count; i++) {

		var doclet = doclets[i];
		var longname = doclet.longname;
		export_descriptor = {
			name: longname
		};
		if (doclet.description) export_descriptor.description = doclet.description;

		support_links.push({
			hash: 'object=Support;member=' + longname,
			page: 'api',
			title: longname.replace('.', '#'),
			type: 'support'
		});

		if (doclet.kind == 'typedef') {

			if ('params' in doclet || doclet.type.names[0] == 'function') {

				// @callback
				export_descriptor.params = doclet.params;
				callbacks.push(export_descriptor);
				ApiHelper.exportReturns(export_descriptor, doclet);

			} else {

				// @typedef
				export_descriptor.type_names = doclet.type.names;
				typedefs.push(export_descriptor);

			}

			current_object_package = null;
			current_object_package_type = null;

		} else if (doclet.isEnum) {

			export_descriptor.type_names = doclet.type.names;
			export_descriptor.properties = [];
			doclet.properties.forEach(function(jsdoc_descriptor) {
				var property_descriptor = {
					name: jsdoc_descriptor.name,
					value: jsdoc_descriptor.defaultvalue // yes, lowercase
				};
				if (jsdoc_descriptor.description) property_descriptor.description = jsdoc_descriptor.description;
				export_descriptor.properties.push(property_descriptor);
			});
			enums.push(export_descriptor);
			current_object_package = export_descriptor;
			current_object_package_type = 'enum';

		} else if (doclet.memberof) {

			if (current_object_package_type == 'enum') continue;
			if (current_object_package_type != 'object') throw new Error();

			if (doclet.longname.indexOf(current_object_package.name) != 0) throw new Error();
			export_descriptor.name = doclet.longname.substr(current_object_package.name.length + 1);

			if (doclet.kind == 'function') {

				ApiHelper.exportMethod(doclet, export_descriptor);
				if (!current_object_package.method_chain) current_object_package.method_chain = [{descriptors: []}];
				current_object_package.method_chain[0].descriptors.push(export_descriptor);

			} else {

				ApiHelper.export_type_data(doclet, export_descriptor, true);
				if (export_descriptor.is_optional || export_descriptor.is_variable) throw new Error('TODO: unexpected flags on class member');
				if (doclet.meta.code && doclet.meta.code.type == 'Literal') {
					ApiHelper.setDefaultFromValue(export_descriptor, doclet.meta.code.node.value);
				}
				if (!current_object_package.member_chain) current_object_package.member_chain = [{descriptors: []}];
				current_object_package.member_chain[0].descriptors.push(export_descriptor);

			}

		} else if (doclet.name == doclet.longname && doclet.scope == 'global' && ['member','interface'].indexOf(doclet.kind) != -1) {

			if (doclet.kind == 'interface') export_descriptor.is_interface = true;

			if (doclet.tags && doclet.tags[0] && doclet.tags[0].title == 'interface') {
				throw new Error(); // requires JSDoc: latest master after 3.3.0-alpha9 (25.08.14)
			}

			if (doclet.augments) {
				export_descriptor.extends_list = doclet.augments;
				all_extends_names = all_extends_names.concat(doclet.augments);
			}
			all_names.push(longname);

			objects.push(export_descriptor);
			current_object_package = export_descriptor;
			current_object_package_type = 'object';

		} else {

			if (doclet.kind != 'package') throw new Error();

		}

	}

	all_extends_names.forEach(function(name){
		if (all_names.indexOf(name) == -1) throw new Error('unknown extends name: ' + name);
	});

	var export_result = {};
	if (typedefs.length) export_result.typedefs = typedefs;
	if (enums.length) export_result.enums = enums;
	if (callbacks.length) export_result.callbacks = callbacks;
	if (objects.length) export_result.objects = objects;
	fs.writeFileSync('build/temp/jsdoc_support_export.js', JSON.stringify(export_result));

	// this script is launched in separate process
	fs.writeFileSync('build/temp/jsdoc_support_links_export.js', JSON.stringify(support_links));

};
