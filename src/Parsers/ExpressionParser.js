
Lava.ExpressionParser._parse = Lava.ExpressionParser.parse;

/** @enum {number} */
Lava.ExpressionParser.SEPARATORS = {
	COMMA: 1,
	SEMICOLON: 2
};

/**
 * @param {string} input
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseRaw = function(input, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = false;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return this.yy.x_arguments;

};

/**
 * @param {string} input
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parse = function(input, separator) {
	return this.yy.convertArguments(this.parseRaw(input, separator));
};

/**
 * @param {string} input
 * @returns {_cScopeLocator}
 */
Lava.ExpressionParser.parsePath = function(input) {
	var configs = this.yy.convertArguments(this.parseRaw(input));
	if (configs.length != 1) Lava.t("ExpressionParser: single scope expected, got either many expressions or nothing");
	if (!configs[0].flags || !configs[0].flags.isScopeEval) Lava.t("ExpressionParser: expected scope path, got expression");
	return configs[0].binds[0];
};

/**
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseWithTailRaw = function(config_ref, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = true;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(config_ref.input);

	} finally {

		this.yy.is_parsing = false;

	}

	config_ref.tail_length = this.lexer.x_input_tail_length;
	return this.yy.x_arguments;

};

/**
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parseWithTail = function(config_ref, separator) {
	return this.yy.convertArguments(this.parseWithTailRaw(config_ref, separator));
};

Lava.ExpressionParser.yy = {

	is_parsing: false,
	x_arguments: null,
	x_argument_binds: null,
	x_argument_widget_modifiers: null,
	x_argument_active_modifiers: null,
	x_allowed_separator: null,

	x_counters: {
		modifiers: 0,
		active_modifiers: 0,
		operands: 0,
		expression_tails: 0,
		braces: 0,
		literals: 0,
		numbers: 0,
		strings: 0
	},

	unescape: function(string) {
		return Firestorm.String.unescape(string);
	},

	reset: function() {
		// must reset everything, cause in case of parsing exception the parser will be left broken
		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.x_arguments = [];
	},

	resetCounters: function() {
		this.x_counters.global_modifiers = 0;
		this.x_counters.widget_modifiers = 0;
		this.x_counters.active_modifiers = 0;
		this.x_counters.operands = 0;
		this.x_counters.expression_tails = 0;
		this.x_counters.braces = 0;
		this.x_counters.literals = 0;
		this.x_counters.numbers = 0;
		this.x_counters.strings = 0;
	},

	finishArgument: function(evaluator_src) {
		var result = {
				evaluator_src: evaluator_src
			},
			flags = {};
		if (this.x_argument_binds.length) result.binds = this.x_argument_binds;
		if (this.x_argument_widget_modifiers.length) result.modifiers = this.x_argument_widget_modifiers;
		if (this.x_argument_active_modifiers.length) result.active_modifiers = this.x_argument_active_modifiers;

		if (this.x_counters.global_modifiers > 0) flags.hasGlobalModifiers = true;
		if (this.x_argument_binds.length == 1
			&& this.x_counters.operands == 1
			&& this.x_counters.expression_tails == 0
			&& this.x_counters.braces == 0
		)
			flags.isScopeEval = true;
		if (this.x_argument_binds.length == 0 && this.x_counters.active_modifiers == 0) {
			flags.isStatic = true;
			if (this.x_counters.literals == 1 && this.x_counters.operands == 1) flags.isLiteral = true;
			if (this.x_counters.numbers == 1 && this.x_counters.operands == 1) flags.isNumber = true;
			if (this.x_counters.strings == 1 && this.x_counters.operands == 1) flags.isString = true;
		}

		if (!Firestorm.Object.isEmpty(flags)) result.flags = flags;
		this.x_arguments.push(result);

		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.resetCounters();
	},

	/**
	 * @param {Array.<_cRawArgument>} raw_arguments
	 * @returns {Array.<_cArgument>}
	 */
	convertArguments: function(raw_arguments) {

		var i = 0,
			count = raw_arguments.length,
			result = [];

		for (; i < count; i++) {
			result.push(this.convertArgument(raw_arguments[i]))
		}

		return result;

	},

	/**
	 * @param {_cRawArgument} raw_argument
	 * @returns {_cArgument}
	 */
	convertArgument: function(raw_argument) {

		var src = "return (" + raw_argument.evaluator_src + ");",
			result = {
				evaluator: new Function(src)
			};

		if ('flags' in raw_argument) result.flags = raw_argument.flags;
		if ('binds' in raw_argument) result.binds = raw_argument.binds;
		if ('modifiers' in raw_argument) result.modifiers = raw_argument.modifiers;
		if ('active_modifiers' in raw_argument) result.active_modifiers = raw_argument.active_modifiers;

		return result;

	},

	assertSemicolonAllowed: function() {

		if (typeof(this.x_allowed_separator) == 'undefined') Lava.t("ExpressionParser: semicolon encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.SEMICOLON) Lava.t("ExpressionParser: comma is not allowed as separator here");

	},

	assertCommaAllowed: function() {

		if (typeof(this.x_allowed_separator) == 'undefined') Lava.t("ExpressionParser: comma encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.COMMA) Lava.t("ExpressionParser: semicolon is not allowed as separator here");

	}

};