/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ExpressionParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"expressions":5,"event_calls":6,"SEMICOLON":7,"event_call":8,"EVENT_CALL":9,"OPEN_BRACE":10,"CLOSE_BRACE":11,"argumentList":12,"knownView":13,"expression":14,"COMMA":15,"modifiedOperand":16,"expressionTail":17,"operator":18,"OPERATOR":19,"UNARY_ARITHMETIC_OPERATOR":20,"operand":21,"UNARY_OPERATOR":22,"arrayDefinition":23,"NUMBER":24,"RAW_STRING":25,"LITERAL":26,"scopeEval":27,"dynamicScope":28,"functionCall":29,"OPEN_SQUARE":30,"expressionList":31,"CLOSE_SQUARE":32,"argument":33,"RESERVED_WORD":34,"VIEW_BY_LABEL":35,"VIEW_BY_ID":36,"VIEW_BY_NAME":37,"viewLocator":38,"DEPTH_OPERATOR":39,"GLOBAL_MODIFIER_CALL":40,"WIDGET_MODIFIER_CALL":41,"OPEN_CURLY":42,"IDENTIFIER":43,"CLOSE_CURLY":44,"scopePath":45,"SEARCH_OPERATOR":46,"scopePathSegment":47,"DOT_PROPERTY":48,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"SEMICOLON",9:"EVENT_CALL",10:"OPEN_BRACE",11:"CLOSE_BRACE",15:"COMMA",19:"OPERATOR",20:"UNARY_ARITHMETIC_OPERATOR",22:"UNARY_OPERATOR",24:"NUMBER",25:"RAW_STRING",26:"LITERAL",30:"OPEN_SQUARE",32:"CLOSE_SQUARE",34:"RESERVED_WORD",35:"VIEW_BY_LABEL",36:"VIEW_BY_ID",37:"VIEW_BY_NAME",39:"DEPTH_OPERATOR",40:"GLOBAL_MODIFIER_CALL",41:"WIDGET_MODIFIER_CALL",42:"OPEN_CURLY",43:"IDENTIFIER",44:"CLOSE_CURLY",46:"SEARCH_OPERATOR",48:"DOT_PROPERTY"},
productions_: [0,[3,1],[3,2],[3,2],[6,3],[6,1],[8,3],[8,4],[8,4],[8,5],[5,3],[5,3],[5,1],[14,2],[14,1],[17,3],[17,2],[18,1],[18,1],[16,2],[16,2],[16,1],[21,3],[21,1],[21,1],[21,1],[21,1],[21,1],[21,1],[21,1],[23,3],[23,2],[31,3],[31,1],[12,3],[12,1],[33,1],[33,1],[13,1],[13,1],[13,1],[38,1],[38,2],[29,3],[29,4],[29,4],[29,5],[28,4],[27,1],[27,2],[27,3],[27,2],[27,2],[45,2],[45,1],[47,1],[47,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/*``*/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
break;
case 2:
break;
case 3:
break;
case 4:
			yy.finishArgument($$[$0].trim());

break;
case 5:
			yy.finishArgument($$[$0].trim());

break;
case 6:
			if (Lava.schema.DEBUG && yy.is_events_mode) Lava.t("Event calls are not allowed in this expression");
			yy.x_counters.event_calls++;
			this.$ = 'Lava.view_manager.callBubblingEvent(this._widget, "' + $$[$0-2] + '")';

break;
case 7:
			if (Lava.schema.DEBUG && yy.is_events_mode) Lava.t("Event calls are not allowed in this expression");
			yy.x_counters.event_calls++;
			this.$ = 'Lava.view_manager.callBubblingEvent(this._widget, "' + $$[$0-3] + '", [' + $$[$0-1] + '])';

break;
case 8:
			if (Lava.schema.DEBUG && yy.is_events_mode) Lava.t("Event calls are not allowed in this expression");
			yy.x_counters.event_calls++;
			var index = yy.x_argument_targets.push($$[$0-3]) - 1;
			this.$ = 'this._callEvent(' + index + ', "' + $$[$0-2] + '")';

break;
case 9:
			if (Lava.schema.DEBUG && yy.is_events_mode) Lava.t("Event calls are not allowed in this expression");
			yy.x_counters.event_calls++;
			var index = yy.x_argument_targets.push($$[$0-4]) - 1;
			this.$ = 'this._callEvent(' + index + ', "' + $$[$0-3] + '", [' + $$[$0-1] + '])';

break;
case 10:
			if (yy.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.SEMICOLON) Lava.t("ExpressionParser: semicolon is not allowed here" + ((yy.x_allowed_separator == null) ? ". Tip: allowed separator is not set" : ''));
			yy.finishArgument($$[$0].trim());

break;
case 11:
			if (yy.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.COMMA) Lava.t("ExpressionParser: comma is not allowed here" + ((yy.x_allowed_separator == null) ? ". Tip: allowed separator is not set" : ''));
			yy.finishArgument($$[$0].trim());

break;
case 12: yy.finishArgument($$[$0].trim());
break;
case 13:
			yy.x_counters.operands++;
			yy.x_counters.expression_tails++;
			this.$ = $$[$0-1] + ' ' + $$[$0];

break;
case 14:
			yy.x_counters.operands++;
			this.$ = $$[$0];

break;
case 15:
			yy.x_counters.operands++;
			this.$ = $$[$0-2] + ' ' + $$[$0-1] + ' ' + $$[$0];

break;
case 16:
			yy.x_counters.operands++;
			this.$ = $$[$0-1] + ' ' + $$[$0];

break;
case 17: this.$ = $$[$0];
break;
case 18: this.$ = $$[$0];
break;
case 19: this.$ = $$[$0-1] + ' ' + $$[$0];
break;
case 20: this.$ = $$[$0-1] + ' ' + $$[$0];
break;
case 21: this.$ = $$[$0];
break;
case 22:
			yy.x_counters.braces++;
			this.$ = '(' + $$[$0-1] + ')';

break;
case 23: this.$ = $$[$0];
break;
case 24:
			this.$ = $$[$0];

break;
case 25:
			this.$ = $$[$0];

break;
case 26:
			this.$ = $$[$0];

break;
case 27:
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			//this.$ = 'this._binds[' + index + '].getValue()';
			this.$ = 'this._evalBind(' + index + ')';

break;
case 28:
			yy.x_counters.dynamic_scopes++;
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			//this.$ = 'this._binds[' + index + '].getValue()';
			this.$ = 'this._evalBind(' + index + ')';

break;
case 29: this.$ = $$[$0];
break;
case 30: this.$ = '[' + $$[$0-1] + ']';
break;
case 31: this.$ = '[]';
break;
case 32: this.$ = $$[$0-2] + ', ' + $$[$0];
break;
case 33: this.$ = $$[$0];
break;
case 34: this.$ = $$[$0-2] + ', ' + $$[$0];
break;
case 35: this.$ = $$[$0];
break;
case 36: this.$ = $$[$0];
break;
case 37: this.$ = $$[$0];
break;
case 38: this.$ = {locator_type: 'Label', locator: $$[$0]};
break;
case 39: this.$ = {locator_type: 'Id', locator: $$[$0]};
break;
case 40: this.$ = {locator_type: 'Name', locator: $$[$0]};
break;
case 41: this.$ = $$[$0];
break;
case 42:
			$$[$0-1].depth = parseInt($$[$0]);
			if (!$$[$0-1].depth) Lava.t('Deepness operator: depth must be > 0');
			this.$ = $$[$0-1];

break;
case 43:
			Lava.t(); // part of possible future functionality
			//yy.x_counters.modifiers++;
			//this.$ = 'this._callGlobalModifier("' + $$[$0-2] + '")';

break;
case 44:
			Lava.t(); // part of possible future functionality
			//yy.x_counters.modifiers++;
			//this.$ = 'this._callGlobalModifier("' + $$[$0-3] + '", [' + $$[$0-1] + '])';

break;
case 45:
			yy.x_counters.modifiers++;
			var index = yy.x_argument_targets.push($$[$0-3]) - 1;
			this.$ = 'this._callModifier(' + index + ', "' + $$[$0-2] + '")';

break;
case 46:
			yy.x_counters.modifiers++;
			var index = yy.x_argument_targets.push($$[$0-4]) - 1;
			this.$ = 'this._callModifier(' + index + ', "' + $$[$0-3] + '", [' + $$[$0-1] + '])';

break;
case 47:
			$$[$0-3].isDynamic = true;
			$$[$0-3].property_name = $$[$0-1];
			this.$ = $$[$0-3];

break;
case 48: this.$ = {property_name: $$[$0]};
break;
case 49: this.$ = {property_name: $$[$0-1], tail: $$[$0]};
break;
case 50:
			$$[$0-2].property_name = $$[$0-1];
			$$[$0-2].tail = $$[$0];
			this.$ = $$[$0-2];

break;
case 51:
			$$[$0-1].property_name = $$[$0];
			this.$ = $$[$0-1];

break;
case 52: $$[$0-1].tail = $$[$0]; this.$ = $$[$0-1];
break;
case 53: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 54: this.$ = [$$[$0]];
break;
case 55: this.$ = $$[$0];
break;
case 56:
			var segments = $$[$0-1].path_segments;
			if (segments) {
				for (var i = 0, count = segments.length; i < count; i++) {
					if (typeof(segments[i]) == 'object') Lava.t('Dynamic segment must not contain other dynamic segments');
				}
			}
			this.$ = $$[$0-1];

break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,8:6,9:[1,8],10:[1,16],13:9,14:5,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{1:[3]},{1:[2,1]},{4:[1,28],7:[1,29],15:[1,30]},{4:[1,31],7:[1,32]},{4:[2,12],7:[2,12],15:[2,12]},{4:[2,5],7:[2,5]},{4:[2,14],7:[2,14],11:[2,14],15:[2,14],17:33,18:34,19:[1,35],20:[1,36],32:[2,14]},{10:[1,37]},{9:[1,38],30:[2,41],39:[1,41],41:[1,40],42:[1,39],46:[2,41],48:[2,41]},{10:[1,16],13:43,21:42,23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{10:[1,16],13:43,21:44,23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,21],7:[2,21],11:[2,21],15:[2,21],19:[2,21],20:[2,21],32:[2,21]},{9:[2,38],30:[2,38],39:[2,38],41:[2,38],42:[2,38],46:[2,38],48:[2,38]},{9:[2,39],30:[2,39],39:[2,39],41:[2,39],42:[2,39],46:[2,39],48:[2,39]},{9:[2,40],30:[2,40],39:[2,40],41:[2,40],42:[2,40],46:[2,40],48:[2,40]},{10:[1,16],13:43,14:45,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,23],7:[2,23],11:[2,23],15:[2,23],19:[2,23],20:[2,23],32:[2,23]},{4:[2,24],7:[2,24],11:[2,24],15:[2,24],19:[2,24],20:[2,24],32:[2,24]},{4:[2,25],7:[2,25],11:[2,25],15:[2,25],19:[2,25],20:[2,25],32:[2,25]},{4:[2,26],7:[2,26],11:[2,26],15:[2,26],19:[2,26],20:[2,26],32:[2,26]},{4:[2,27],7:[2,27],11:[2,27],15:[2,27],19:[2,27],20:[2,27],32:[2,27]},{4:[2,28],7:[2,28],11:[2,28],15:[2,28],19:[2,28],20:[2,28],32:[2,28]},{4:[2,29],7:[2,29],11:[2,29],15:[2,29],19:[2,29],20:[2,29],32:[2,29]},{10:[1,16],13:43,14:48,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],31:46,32:[1,47],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,48],7:[2,48],11:[2,48],15:[2,48],19:[2,48],20:[2,48],30:[1,52],32:[2,48],45:49,47:50,48:[1,51]},{30:[1,52],45:54,46:[1,53],47:50,48:[1,51]},{10:[1,55]},{1:[2,2]},{10:[1,16],13:43,14:56,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{10:[1,16],13:43,14:57,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{1:[2,3]},{8:58,9:[1,8],13:59,35:[1,13],36:[1,14],37:[1,15]},{4:[2,13],7:[2,13],11:[2,13],15:[2,13],18:60,19:[1,35],20:[1,36],32:[2,13]},{10:[1,16],13:43,16:61,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{10:[2,17],20:[2,17],22:[2,17],24:[2,17],25:[2,17],26:[2,17],30:[2,17],35:[2,17],36:[2,17],37:[2,17],40:[2,17],43:[2,17]},{10:[2,18],20:[2,18],22:[2,18],24:[2,18],25:[2,18],26:[2,18],30:[2,18],35:[2,18],36:[2,18],37:[2,18],40:[2,18],43:[2,18]},{10:[1,16],11:[1,62],12:63,13:43,14:66,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],33:64,34:[1,65],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{10:[1,67]},{43:[1,68]},{10:[1,69]},{30:[2,42],46:[2,42],48:[2,42]},{4:[2,19],7:[2,19],11:[2,19],15:[2,19],19:[2,19],20:[2,19],32:[2,19]},{30:[2,41],39:[1,41],41:[1,40],42:[1,39],46:[2,41],48:[2,41]},{4:[2,20],7:[2,20],11:[2,20],15:[2,20],19:[2,20],20:[2,20],32:[2,20]},{11:[1,70]},{15:[1,72],32:[1,71]},{4:[2,31],7:[2,31],11:[2,31],15:[2,31],19:[2,31],20:[2,31],32:[2,31]},{15:[2,33],32:[2,33]},{4:[2,49],7:[2,49],11:[2,49],15:[2,49],19:[2,49],20:[2,49],30:[1,52],32:[2,49],47:73,48:[1,51]},{4:[2,54],7:[2,54],11:[2,54],15:[2,54],19:[2,54],20:[2,54],30:[2,54],32:[2,54],48:[2,54]},{4:[2,55],7:[2,55],11:[2,55],15:[2,55],19:[2,55],20:[2,55],30:[2,55],32:[2,55],48:[2,55]},{13:75,27:74,35:[1,13],36:[1,14],37:[1,15],38:26,43:[1,25]},{4:[2,51],7:[2,51],11:[2,51],15:[2,51],19:[2,51],20:[2,51],30:[1,52],32:[2,51],45:76,47:50,48:[1,51]},{4:[2,52],7:[2,52],11:[2,52],15:[2,52],19:[2,52],20:[2,52],30:[1,52],32:[2,52],47:73,48:[1,51]},{10:[1,16],11:[1,77],12:78,13:43,14:66,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],33:64,34:[1,65],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,10],7:[2,10],15:[2,10]},{4:[2,11],7:[2,11],15:[2,11]},{4:[2,4],7:[2,4]},{9:[1,38]},{10:[1,16],13:43,16:79,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,16],7:[2,16],11:[2,16],15:[2,16],19:[2,16],20:[2,16],32:[2,16]},{4:[2,6],7:[2,6]},{11:[1,80],15:[1,81]},{11:[2,35],15:[2,35]},{11:[2,36],15:[2,36]},{11:[2,37],15:[2,37]},{10:[1,16],11:[1,82],12:83,13:43,14:66,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],33:64,34:[1,65],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{44:[1,84]},{10:[1,16],11:[1,85],12:86,13:43,14:66,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],33:64,34:[1,65],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,22],7:[2,22],11:[2,22],15:[2,22],19:[2,22],20:[2,22],32:[2,22]},{4:[2,30],7:[2,30],11:[2,30],15:[2,30],19:[2,30],20:[2,30],32:[2,30]},{10:[1,16],13:43,14:87,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,53],7:[2,53],11:[2,53],15:[2,53],19:[2,53],20:[2,53],30:[2,53],32:[2,53],48:[2,53]},{32:[1,88]},{30:[2,41],39:[1,41],46:[2,41],48:[2,41]},{4:[2,50],7:[2,50],11:[2,50],15:[2,50],19:[2,50],20:[2,50],30:[1,52],32:[2,50],47:73,48:[1,51]},{4:[2,43],7:[2,43],11:[2,43],15:[2,43],19:[2,43],20:[2,43],32:[2,43]},{11:[1,89],15:[1,81]},{4:[2,15],7:[2,15],11:[2,15],15:[2,15],19:[2,15],20:[2,15],32:[2,15]},{4:[2,7],7:[2,7]},{10:[1,16],13:43,14:66,16:7,20:[1,10],21:12,22:[1,11],23:17,24:[1,18],25:[1,19],26:[1,20],27:21,28:22,29:23,30:[1,24],33:90,34:[1,65],35:[1,13],36:[1,14],37:[1,15],38:26,40:[1,27],43:[1,25]},{4:[2,8],7:[2,8]},{11:[1,91],15:[1,81]},{4:[2,47],7:[2,47],11:[2,47],15:[2,47],19:[2,47],20:[2,47],32:[2,47]},{4:[2,45],7:[2,45],11:[2,45],15:[2,45],19:[2,45],20:[2,45],32:[2,45]},{11:[1,92],15:[1,81]},{15:[2,32],32:[2,32]},{4:[2,56],7:[2,56],11:[2,56],15:[2,56],19:[2,56],20:[2,56],30:[2,56],32:[2,56],48:[2,56]},{4:[2,44],7:[2,44],11:[2,44],15:[2,44],19:[2,44],20:[2,44],32:[2,44]},{11:[2,34],15:[2,34]},{4:[2,9],7:[2,9]},{4:[2,46],7:[2,46],11:[2,46],15:[2,46],19:[2,46],20:[2,46],32:[2,46]}],
defaultActions: {2:[2,1],28:[2,2],31:[2,3]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/*``*/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: Lava.schema.DEBUG && Lava.t('Spaces between function name and opening brace are not allowed (1A)');
break;
case 1: Lava.schema.DEBUG && Lava.t('Spaces between function name and opening brace are not allowed (1B)');
break;
case 2: Lava.schema.DEBUG && Lava.t('Spaces between function name and opening brace are not allowed (2)');
break;
case 3: Lava.schema.DEBUG && Lava.t('Spaces between function name and opening brace are not allowed (3)');
break;
case 4: Lava.schema.DEBUG && Lava.t('Spaces in scope path are not allowed (1)');
break;
case 5: Lava.schema.DEBUG && Lava.t('Spaces in scope path are not allowed (2)');
break;
case 6: Lava.schema.DEBUG && Lava.t("'this' is a keyword. Did you forget '@'?");
break;
case 7: yy_.yytext = yy_.yytext.substr(1); return 35;
break;
case 8: yy_.yytext = yy_.yytext.substr(1); return 36;
break;
case 9: yy_.yytext = yy_.yytext.substr(1); return 37;
break;
case 10: yy_.yytext = yy_.yytext.substr(2); return 9;
break;
case 11: yy_.yytext = yy_.yytext.substr(5); return 9;
break;
case 12: yy_.yytext = yy_.yytext.substr(1); return 41;
break;
case 13: Lava.t("Syntax is not supported"); /* return 40; */
break;
case 14: yy_.yytext = yy_.yytext.substr(1); return 39;
break;
case 15: yy_.yytext = yy_.yytext.substr(1); return 48;
break;
case 16: yy_.yytext = yy_.yytext.substr(2); return 46;
break;
case 17: yy_.yytext = yy_.yytext.substr(5); return 46;
break;
case 18:
    if (yy_.yytext == '++' || yy_.yytext == '--') Lava.t('Increment and decrement are not allowed (operators with side-effects). Missing a brace after the first \'' + yy_.yytext[0] + '\'?');
    Lava.t('Operators with side-effects are not allowed: ' + yy_.yytext); // all assignments, increments and other side-effects

break;
case 19: yy_.yytext = Firestorm.String.unescape(yy_.yytext); return 19; /*escaped operator versions of <=, >= */
break;
case 20: yy_.yytext = Firestorm.String.unescape(yy_.yytext); return 19; /* escaped &&, <<, >>>, >> */
break;
case 21: yy_.yytext = Firestorm.String.unescape(yy_.yytext); return 19; /* escaped bitwise &, <, > */
break;
case 22: return 19; /*arithmetic without unary*/
break;
case 23: return 19; /*logical*/
break;
case 24: return 19; /*comparison*/
break;
case 25: return 19; /*bitwise*/
break;
case 26: return 19; /*ternary*/
break;
case 27: return 22; /*unary*/
break;
case 28: return 20; /*unary*/
break;
case 29: Lava.t('Operators with side-effects are not allowed: =');
break;
case 30:
	if (yy_.yytext != yy_.yytext.toLowerCase()) Lava.t("The 'in' operator must be written in lower case.");
	return 19;

break;
case 31: return 15;
break;
case 32: return 7;
break;
case 33: return 24;
break;
case 34: return 24;
break;
case 35: return 25;
break;
case 36: return 25;
break;
case 37: return 30;
break;
case 38: return 32;
break;
case 39: /* skip whitespace */
break;
case 40: return 42;
break;
case 41: return 44;
break;
case 42:
		this.x_lex_brace_levels++;
		return 10;

break;
case 43:
		if (this.x_tail_mode && this.x_lex_brace_levels == 0) {
			this.x_input_tail_length = this._input.length;
			this._input = '';
			this.done = true;
			return 4;
		} else {
			this.x_lex_brace_levels--;
			return 11;
		}

break;
case 44:
		var lowercase = yy_.yytext.toLowerCase();

		if (lowercase in this.reserved_words) {
			if (Lava.schema.DEBUG && lowercase != yy_.yytext) Lava.t("Reserved words must be lower case: " + yy_.yytext);
			if (Lava.schema.DEBUG && (!this.allowed_keywords || this.allowed_keywords.indexOf(lowercase) == -1)) Lava.t("Reserved word is not allowed in this expression: " + lowercase);
			yy_.yytext = this.reserved_words[lowercase];
			return 34;
		}

		if (lowercase in this.operators_map) {
			if (Lava.schema.DEBUG && lowercase != yy_.yytext) Lava.t("Expression parser: 'lt', 'gt', 'and' must be lower case");
			yy_.yytext = this.operators_map[lowercase];
			return 19;
		}

		if (lowercase in Lava.parsers.Common.LITERALS) {
			if (Lava.schema.DEBUG && lowercase != yy_.yytext) Lava.t("Expression parser, code style: literals must be lower case");
			return 26;
		}

		return 43;

break;
case 45: return 4;
break;
}
},
rules: [/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)\s+\()/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)\s+\()/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)\s+\()/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)\s+\()/,/^(?:\s+[\~\.])/,/^(?:\[\s\b)/,/^(?:this(\.|->|-&gt;|~))/,/^(?:@([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:#([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:\$([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:~\d+)/,/^(?:\.[a-zA-Z0-9\_]+)/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:&lt&lt=|&gt&gt=|&gt&gt&gt=|&amp=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|>>>=|&=|\^=|\|=)/,/^(?:(&lt;|&gt;))/,/^(?:&amp;&amp;|&lt;&lt;|&gt;&gt;&gt;|&gt;&gt;)/,/^(?:&amp;|&lt;|&gt;)/,/^(?:[\*\/\%])/,/^(?:\|\||&&)/,/^(?:===|!==|==|!=|<=|>=|<|>)/,/^(?:>>>|>>|<<|[\|\^]|&)/,/^(?:[\?\:])/,/^(?:!!|!)/,/^(?:\+|-)/,/^(?:=)/,/^(?:\sin\s|\sIN\s|\sIn\s|\siN\s\b)/,/^(?:,)/,/^(?:;)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"(\\"|[^"])*")/,/^(?:'(\\'|[^'])*')/,/^(?:\[(?=[^\s]))/,/^(?:\])/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


