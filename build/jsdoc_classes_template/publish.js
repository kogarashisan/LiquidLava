/**
 * Requires JSDoc: latest master after 3.3.0-alpha9 (25.08.14)
 * @file
 */

/*
Export formats

For property:
	description = <string>
	default_value
	is_nullable
	is_non_nullable
	is_readonly
	type_names = [<string>]

For function:
	description = <string>
	param_names_string = <string>
	params = [<param>]
		name = <string>
		description = <string>
		default_value
		is_optional
		is_nullable
		is_non_nullable
		is_variable
		//is_subparam // if name contains a dot
		type_names = [<string>]
	returns = {}
		description = <string>
		is_nullable = <bool>
		is_non_nullable = <bool>
		type_names = [<string>]
	param_renames = Object.<from, to>

event:
	description
	name
	type_names
	params[] // same as function params

*/

var template = require('jsdoc/template'),
    fs = require('jsdoc/fs'),
    path = require('jsdoc/path'),
    handle = require('jsdoc/util/error').handle,
	ApiHelper = require('../ApiHelper.js');

exports.publish = function(taffyData, opts, tutorials) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// export list of ignored members

	var ignored_doclets = taffyData({ignore: true}).get();
	var ignored_by_object = {
		Firestorm: [],
		Lava: []
	};

	for (i = 0, count = ignored_doclets.length; i < count; i++) {

		doclet = ignored_doclets[i];
		var filename = doclet.meta.filename;
		if (filename == 'Firestorm.js' || filename == 'Lava.js') {
			if (doclet.memberof in ignored_by_object) {
				ignored_by_object[doclet.memberof].push(doclet.name);
			}
		}

	}

	fs.writeFileSync('build/temp/jsdoc_ignored_export.js', JSON.stringify(ignored_by_object));

	// end export ignored
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	taffyData({ignore: true}).remove();
	taffyData({scope: 'inner'}).remove();
	var doclets = taffyData().get();
	var export_data = {};
	var events_export = {};
	var export_descriptor;

	for (var i = 0, count = doclets.length; i < count; i++) {

		var doclet = doclets[i];
		var longname = doclet.longname;
		export_descriptor = {};

		if (doclet.name && !doclet.meta.code.name) {
			// this is produced by @extends comment in Firestorm/ElementSomething.js
			if (longname == 'Firestorm.Element') continue;
		}

		// get rid of doclets for "this.varname = something" inside functions
		var allowed = (doclet.name && doclet.meta.code.name && doclet.meta.code.name.indexOf('this.') != 0);
		if (doclet.kind == 'event') allowed = true;
		if (!allowed) continue;

		if (doclet.description) export_descriptor.description = doclet.description;

		if (doclet.kind == 'function') {

			ApiHelper.exportMethod(doclet, export_descriptor);
			if (doclet.tags) {
				doclet.tags.forEach(function(tag){
					if (tag.title != 'lava-param-renamed') throw new Error ();
					var renames_match = /^\s*([a-zA-Z\_]+)\s*\-\>\s*([a-zA-Z\_]+)\s*$/.exec(tag.value); // example: 'name -> guid'
					if (!renames_match) throw new Error();
					if (!export_descriptor.param_renames) export_descriptor.param_renames = {};
					export_descriptor.param_renames[renames_match[1]] = renames_match[2];
				});
			}

		} else if (doclet.kind == 'event') {

			if (/@type\s+\{[^\}]\}\s+[^\n]+/.test(doclet.comment)) throw new Error('jsdoc does not support description for @type in @event. Use lava-type-description tag.');

			ApiHelper.export_type_data(doclet, export_descriptor, true);
			if (export_descriptor.default_value || export_descriptor.is_variable) throw new Error();

			if (doclet.type && doclet.type.names && (doclet.type.names.length != 1 || doclet.type.names[0] != 'Object')) {

				if (!doclet.tags || doclet.tags[0].title != 'lava-type-description') throw new Error();
				// event's argument is not an object, but some other type (maybe simple)
				export_descriptor.argument_description = doclet.tags[0].value;

			} else {

				delete export_descriptor.type_names;

			}

			if (!(doclet.memberof in events_export)) events_export[doclet.memberof] = [];
			events_export[doclet.memberof].push(export_descriptor);

			if (doclet.properties) {
				export_descriptor.params = [];
				doclet.properties.forEach(function(property_descriptor){
					var param = {};
					ApiHelper.export_type_data(property_descriptor, param, true);
					export_descriptor.params.push(param);
				})
			}

		} else {

			if (doclet.kind == 'constant') export_descriptor.is_constant = true;
			ApiHelper.export_type_data(doclet, export_descriptor, true);
			if (export_descriptor.is_optional || export_descriptor.is_variable) throw new Error('TODO: unexpected flags on class member');
			delete export_descriptor.name;

		}

		if (doclet.undocumented) export_descriptor.is_undocumented = true;
		export_descriptor.longname = doclet.longname;
		export_descriptor.kind = doclet.kind;

		if (longname in export_descriptor) throw new Error('JSDoc export: duplicate doclet for ' + longname);
		export_data[longname] = export_descriptor;

	}

	fs.writeFileSync('build/temp/jsdoc_classes_export.js', JSON.stringify(export_data));
	fs.writeFileSync('build/temp/jsdoc_events_export.js', JSON.stringify(events_export));

};
