
if (!global.Lava) {
	require('./temp/lava_module.js');
}
var Lava = global.Lava,
	Firestorm = global.Firestorm;

var ApiHelper = {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// static methods for JSDoc themes

	export_type_data: function(doclet, export_descriptor, is_name_required) {

		if (!doclet.name && is_name_required) throw new Error();

		this.importVars(export_descriptor, doclet, ['name', 'description']);
		if (doclet.defaultValue) export_descriptor.default_value = doclet.defaultValue;

		['optional', 'nullable', 'variable', 'readonly'].forEach(function(name) {
			if (doclet[name]) export_descriptor['is_' + name] = true;
		});
		if (doclet['nullable'] === false) export_descriptor['is_non_nullable'] = true;
		if (doclet.type && doclet.type.names && doclet.type.names.length) export_descriptor.type_names = doclet.type.names;

	},

	exportMethod: function(doclet, export_descriptor) {

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
				var param = {};
				ApiHelper.export_type_data(doclet_param, param, true);
				if (param.name.indexOf('.') != -1) {
					if (param.name.indexOf(last_param + '.') != 0) throw new Error('Wrong subparam order: ' + doclet.longname);
					//param.is_subparam = true;
				} else {
					param_names.push(param.name);
					last_param = param.name;
				}
				export_descriptor.params.push(param);
			});
			if (real_params.length != param_names.length) throw new Error('malformed jsdoc for ' + doclet.longname);
			for (; j < param_count; j++) {
				if (param_names[j] != real_params[j].name) throw new Error('Wrong JSDoc parameters order: ' + doclet.longname);
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

		this.exportReturns(export_descriptor, doclet);

	},

	exportReturns: function(export_descriptor, doclet) {
		if (doclet.returns) {
			if (doclet.returns.length != 1) throw new Error('unexpected returns format');
			export_descriptor.returns = {};
			this.export_type_data(doclet.returns[0], export_descriptor.returns, false);
			if (export_descriptor.returns.is_optional || export_descriptor.returns.is_variable || export_descriptor.returns.default_value)
				throw new Error('jsdoc publish: Unexpected returns format(2)');
	//			doclet.returns.forEach(function(doclet_param) {
	//				var tmp = {};
	//				ApiHelper.export_type_data(doclet_param, tmp, false);
	//				export_descriptor.returns.push(tmp);
	//			})
		}
	},

	// end: methods for JSDoc themes
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	importVars: function(destination, source, name_list) {
		for (var i = 0, count = name_list.length; i < count; i++) {
			var name = name_list[i];
			if ((name in source) && !(name in destination)) destination[name] = source[name];
		}
	},

	setDefaultValue: function(member_descriptor, type, value, is_empty) {

		var default_value = null;

		if (['null','undefined'].indexOf(type) != -1) {
			default_value = '<span class="api-keyword">' + type + '</span>';
		} else if (type == 'boolean') {
			default_value = '<span class="api-keyword">' + value + '</span>';
		} else if (type == 'object') {
			if (is_empty) {
				default_value = '<span class="api-highlight-empty">{ }</span>';
			} else {
				default_value = '<span class="api-highlight-gray">{ ... }</span>';
			}
		} else if (type == 'inlineArray' && is_empty) {
			default_value = '<span class="api-highlight-empty">[ ]</span>';
		} else if (type == 'inlineArray' || type == 'sliceArray') {
			default_value = '<span class="api-highlight-gray">[ ... ]</span>';
		} else if (type == 'number') {
			default_value = value;
		} else if (type == 'string') {
			default_value = '<span class="api-string">' + Firestorm.String.quote(value) + '</span>';
		} else if (type == 'regexp') {
			default_value = '<span class="api-highlight-gray">/ ... /</span>';
		}

		if (default_value != null) member_descriptor.default_value = default_value;

	},

	setDefaultFromValue: function(member_descriptor, value) {

		var is_empty = false;
		var member_type = Firestorm.getType(value);
		if (['object', 'function', 'array', 'null', 'undefined', 'boolean', 'number', 'string', 'regexp'].indexOf(member_type) == -1) throw new Error();
		if (member_type == 'array') {
			if (value.length == 0) {
				is_empty = true;
				member_type = 'inlineArray';
			} else if (Lava.ClassManager.INLINE_SIMPLE_ARRAYS && Lava.ClassManager.isInlineArray(value)) {
				member_type = 'inlineArray';
			} else {
				member_type = 'sliceArray';
			}
		} else if (member_type == 'object') {
			if (Firestorm.Object.isEmpty(value)) {
				is_empty = true;
			}
		}
		ApiHelper.setDefaultValue(member_descriptor, member_type, value, is_empty);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// recursively walk the schema and make a list of paths, like "schema.system.APP_CLASS"
	_schema_export: {},
	_exportSchemaPaths: function(schema_object, path) {
		for (var name in schema_object) {
			if (Firestorm.getType(schema_object[name]) == 'object') {
				this._exportSchemaPaths(schema_object[name], path ? (path + '.' + name) : name);
			} else {
				this._schema_export[path ? (path + '.' + name) : name] = schema_object[name];
			}
		}
	},
	exportSchemaPaths: function(schema_object) {
		this._schema_export = {};
		this._exportSchemaPaths(schema_object, '');
		return this._schema_export;
	}
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};

module.exports = ApiHelper;