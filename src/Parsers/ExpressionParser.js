
Lava.ExpressionParser._parse = Lava.ExpressionParser.parse;
Lava.ExpressionParser.lexer.operators_map = {
	'lt': '<',
	'gt': '>',
	'and': '&&'
};

Lava.ExpressionParser.lexer.reserved_words = {
	'this': 'this._view',
	'event_object': 'arguments[0]',
	'event_args': 'arguments[0]'
};

Lava.ExpressionParser.yy = {

	is_parsing: false,
	is_events_mode: false,
	x_allowed_separator: null,

	// parsed raw expressions
	x_arguments: [],
	// this belongs to one expression, which is currently being parsed
	x_argument_binds: [],
	x_argument_targets: [],
	x_counters: {
		modifiers: 0,
		operands: 0,
		expression_tails: 0,
		braces: 0,
		dynamic_scopes: 0,
		event_calls: 0
	},

	resetCurrentArgument: function() {

		// reset counters
		var counters = this.x_counters,
			name;

		for (name in counters) {
			counters[name] = 0;
		}

		this.x_argument_binds = [];
		this.x_argument_targets = [];

	},

	/**
	 * @param {string} evaluator_src
	 */
	finishArgument: function(evaluator_src) {

		var result = /** @type {_cArgument} */ {
				evaluator: new Function("return (" + evaluator_src + ")")
			},
			counters = this.x_counters;

		if (this.x_argument_binds.length) result.binds = this.x_argument_binds;
		if (this.x_argument_targets.length) result.targets = this.x_argument_targets;

		if (this.x_argument_binds.length == 1
			&& counters.modifiers == 0
			&& counters.operands == 1
			&& counters.expression_tails == 0
			&& counters.braces == 0
			&& counters.dynamic_scopes == 0
			&& counters.event_calls == 0
		) {
			result.isScopeEval = true;
		}

		this.x_arguments.push(result);

		this.resetCurrentArgument();

	}

};

Firestorm.extend(Lava.ExpressionParser, /** @lends Lava.ExpressionParser */ {

	/**
	 * Allowed separators between expressions
	 * @enum {number}
	 */
	SEPARATORS: {
		COMMA: 1,
		SEMICOLON: 2
	},

	/**
	 * @type {Object.<string, _cParseArgs>}
	 */
	PRESETS: {
		/**
		 * DOM Events on element
		 */
		dom_events: {
			is_events_mode: true,
			separator: Lava.ExpressionParser.SEPARATORS.SEMICOLON,
			allowed_keywords: ['this', 'event_object']
		},
		/**
		 * Class events, fired by {Lava.mixin.Observable}
		 */
		class_events: {
			is_events_mode: true,
			separator: Lava.ExpressionParser.SEPARATORS.SEMICOLON,
			allowed_keywords: ['this', 'event_args']
		},
		/**
		 * Semicolon-delimited expressions, that produce result.
		 * Usage example: for binding of element's classes
		 */
		expressions: {
			separator: Lava.ExpressionParser.SEPARATORS.SEMICOLON
		}
	},

	_callParse: function(input) {

		if (this.yy.is_parsing) Lava.t("You must not call ExpressionParser.parse*() recursively.");

		this.lexer.x_lex_brace_levels = 0;
		this.lexer.x_input_tail_length = 0;

		try {

			this.yy.is_parsing = true;
			this._parse(input);

		} finally {

			this.yy.is_parsing = false;
			// must reset everything, cause otherwise the parser will be left broken
			this.yy.x_arguments = [];
			this.yy.resetCurrentArgument();

		}

	},

	/**
	 * Parse expressions
	 * @param {string} input Source code
	 * @param {_cParseArgs} [config]
	 * @returns {Array.<_cArgument>}
	 */
	parse: function(input, config) {

		config = config || {};
		this.yy.x_allowed_separator = config.separator || null;
		this.yy.is_events_mode = config.is_events_mode || false;
		this.lexer.x_tail_mode = false;
		this.lexer.allowed_keywords = config.allowed_keywords || null;
		this._callParse(input);
		return this.yy.x_arguments;

	},

	/**
	 * Parse expressions, which are followed by a closing brace (and anything after it).
	 * Stores the length of unparsed content in `config_ref.tail_length`
	 * @param {{input: string, tail_length: number}} config_ref
	 * @param {_cParseArgs} config
	 * @returns {Array.<_cArgument>}
	 */
	parseWithTail: function(config_ref, config) {

		config = config || {};
		this.yy.x_allowed_separator = config.separator || null;
		this.yy.is_events_mode = config.is_events_mode || false;
		this.lexer.x_tail_mode = true;
		this.lexer.allowed_keywords = config.allowed_keywords || null;
		this._callParse(config_ref.input);

		config_ref.tail_length = this.lexer.x_input_tail_length;
		return this.yy.x_arguments;

	},

	/**
	 * Parse expression which represents a single path,
	 * like <str>"$my_widget.something.otherthing"</str> or <str>"$my_widget.something[name]"</str>
	 *
	 * @param {string} input Expression source
	 * @returns {_cScopeLocator}
	 */
	parseScopeEval: function(input) {

		var expression_configs = this.parse(input);
		if (Lava.schema.DEBUG && (expression_configs.length != 1 || !expression_configs[0].isScopeEval)) Lava.t('parseScopeEval: malformed scope path');
		return expression_configs[0].binds[0];

	}

});
