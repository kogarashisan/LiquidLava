/**
 * Requires JSDoc 3.3.0-alpha9
 * @file
 */

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

	if (!doclet_param.name && is_name_required) throw new Error();
	var export_param = {};

	import_vars(export_param, doclet_param, {
		name: 'name',
		description: 'description',
		defaultValue: 'default_value'
	});

	['optional', 'nullable', 'variable'].forEach(function(name) {
		if (doclet_param[name]) export_param['is_' + name] = true;
	});
	if (doclet_param['nullable'] === false) export_param['is_non_nullable'] = true;
	if (doclet_param.type && doclet_param.type.names && doclet_param.type.names.length) export_param.type_names = doclet_param.type.names;

	return export_param;

}

/*
Export formats
	For property:
		description = <string>
		default_value
		is_nullable
		is_non_nullable
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
*/

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {

	var ignored_doclets = taffyData({ignore: true}).get();
	taffyData({ignore: true}).remove();
	//taffyData({memberof: '<anonymous>'}).remove();
	taffyData({scope: 'inner'}).remove();

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

	var doclets = taffyData().get();
	var export_data = {};
	var export_descriptor;

	for (var i = 0, count = doclets.length; i < count; i++) {

		var doclet = doclets[i];
		var longname = doclet.longname;

		if (doclet.name && !doclet.meta.code.name) {
			// this is produced by @extends comment in Firestorm/ElementSomething.js
			if (longname == 'Firestorm.Element') continue;
		}

		var allowed = (doclet.name && doclet.meta.code.name && doclet.meta.code.name.indexOf('this.') != 0);
		// for the three virtual comments with @name in Parsers/ParserName.js
		if (doclet.name && ['ExpressionParser', 'ObjectParser', 'TemplateParser'].indexOf(doclet.name) != -1) {
			allowed = true;
		}

		if (allowed) { // check meta to get rid of assignment doclets

			if (doclet.kind == 'function') {

				export_descriptor = {};
				var real_params = doclet.meta.code.node.params,
					j = 0,
					param_count = real_params.length,
					param_names = [];

				if (doclet.params) {
					// JSDoc does not check the parameters order, have to do it myself
					// (or create a JSHint rule)
					// https://github.com/google/closure-compiler/issues/485
					if (!doclet.params.length) throw new Error();
					export_descriptor.params = [];
					var last_param = '#';
					doclet.params.forEach(function(doclet_param) {
						var param = export_type_data(doclet_param, true);
						if (param.name.indexOf('.') != -1) {
							if (param.name.indexOf(last_param + '.') != 0) throw new Error('Wrong subparam order: ' + longname);
							//param.is_subparam = true;
						} else {
							param_names.push(param.name);
							last_param = param.name;
						}
						export_descriptor.params.push(param);
					});
					if (real_params.length != param_names.length) throw new Error('malformed jsdoc for ' + longname);
					for (; j < param_count; j++) {
						if (param_names[j] != real_params[j].name) throw new Error('Wrong JSDoc parameters order: ' + longname);
					}
					export_descriptor.param_names_string = param_names.join(', ');
				} else if (param_count) {
					// In case there is no JSDoc comment - make a string with parameters by hand.
					// Otherwise, the method will render without params.
					for (; j < param_count; j++) {
						param_names.push(real_params[j].name);
					}
					export_descriptor.param_names_string = param_names.join(', ');
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

			if (doclet.undocumented) export_descriptor.is_undocumented = true;
			export_descriptor.longname = doclet.longname;
			export_descriptor.kind = doclet.kind;

			if (longname in export_descriptor) throw new Error('JSDoc export: duplicate doclet for ' + longname);
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
