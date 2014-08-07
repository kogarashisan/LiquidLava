/*global env: true */
var template = require('jsdoc/template'),
    fs = require('jsdoc/fs'),
    path = require('jsdoc/path'),
    handle = require('jsdoc/util/error').handle;

function import_vars(local, external, map) {
	for (var external_name in map) {
		if (external_name in external) {
			local[map[external_name]] = external[external_name];
		}
	}
}

function export_type_data(doclet_param, is_name_required) {

	if (!doclet_param.name && is_name_required) throw new Error('todo');
	var export_param = {},
		flags = [];

	import_vars(export_param, doclet_param, {
		name: 'name',
		description: 'description',
		defaultValue: 'default_value'
	});

	['optional', 'nullable', 'variable'].forEach(function(name) {
		if (doclet_param[name]) {
			flags.push(name);
			export_param['is_' + name] = true;
		}
	});

	if (flags.length) export_param.flags = flags;
	if (doclet_param.type && doclet_param.type.names && doclet_param.type.names.length) export_param.type_names = doclet_param.type.names;

	return export_param;

}

/*
Export formats
	For property:
		description = <string>
		default_value
		is_nullable
		flags = ['nullable']
		type_names = [<string>]

	For function:
		params = [<param>]
			name = <string>
			description = <string>
			default_value
			is_optional
			is_nullable
			is_variable
			flags = ['optional', 'nullable', 'variable']
			type_names = [<string>]
		returns = {}
			description = <string>
			is_nullable = <bool>
			flags = ['nullable']
			type_names = [<string>]
		description = <string>
*/

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {

	//taffyData({ignore: true}).remove();
	//taffyData({memberof: '<anonymous>'}).remove();
	taffyData({scope: 'inner'}).remove();

	var doclets = taffyData().get();
	var doclet_index = {};
	var export_data = {};
	var export_descriptor;

	for (var i = 0, count = doclets.length; i < count; i++) {

		var doclet = doclets[i];
		var longname = doclet.longname;
		if (!(longname in doclet_index) && longname.split('#').length == 2 && longname.indexOf('~') == -1) { // export only class members

			if (doclet.kind == 'function') {

				export_descriptor = {};
				if (doclet.params) {
					if (!doclet.params.length) throw new Error();
					export_descriptor.params = [];
					doclet.params.forEach(function(doclet_param) {
						export_descriptor.params.push(export_type_data(doclet_param, true));
					})
				}

				if (doclet.returns) {
					//if (!doclet.returns.length) throw new Error('malformed doclet.returns');
					if (doclet.returns.length != 1) throw new Error('jsdoc publish: Unexpected returns format: ' + longname);
					export_descriptor.returns = export_type_data(doclet.returns[0], false);
					if (export_descriptor.returns.is_optional || export_descriptor.returns.is_variable || export_descriptor.returns.default_value)
						throw new Error('jsdoc publish: Unexpected returns format(2): ' + longname);
//					doclet.returns.forEach(function(doclet_param) {
//						export_descriptor.returns.push(export_type_data(doclet_param, false));
//					})
				}

				if (doclet.description) export_descriptor.description = doclet.description;

			} else {

				export_descriptor = export_type_data(doclet, true);
				if (export_descriptor.is_optional || export_descriptor.is_variable) throw new Error('TODO: unexpected flags on class member');
				delete export_descriptor.name;

			}

			export_descriptor.kind = doclet.kind;
			export_data[longname] = export_descriptor;

		}

	}

	fs.writeFileSync('build/temp/jsdoc_classes_export.js', JSON.stringify(export_data));

    // data.sort('longname, version, since');
    
    //var members = helper.getMembers(data);
    //members.tutorials = tutorials.children;

    // output pretty-printed source files by default; do this before generating any other pages, so
    // that the other pages can link to the source files
    /*if (!conf['default'] || conf['default'].outputSourceFiles !== false) {
        generateSourceFiles(sourceFiles, opts.encoding);
    }*/

};
