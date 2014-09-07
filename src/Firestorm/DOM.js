
Firestorm.DOM = {

	_wrap_map: {
		select: [ 1, "<select multiple='multiple'>", "</select>" ],
		fieldset: [ 1, "<fieldset>", "</fieldset>" ],
		table: [ 1, "<table>", "</table>" ],
		tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
		thead: [ 2, "<table><tbody>", "</tbody></table>" ],
		tfoot: [ 2, "<table><tbody>", "</tbody></table>" ],
		tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		map: [ 1, "<map>", "</map>" ]
	},

	_needs_shy: false,
	_moves_whitespace: false,

	init: function() {

		var e = Firestorm.Environment;

		this._needs_shy = e.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS;
		this._moves_whitespace = e.MOVES_WHITESPACE_BEFORE_SCRIPT;

		if (Firestorm.schema.dom.PREFER_RANGE_API && e.SUPPORTS_RANGE) {

			this.insertHTMLBefore = this.insertHTMLBefore_Range;
			this.insertHTMLAfter = this.insertHTMLAfter_Range;
			this.insertHTMLTop = this.insertHTMLTop_Range;
			this.insertHTMLBottom = this.insertHTMLBottom_Range;
			this.clearOuterRange = this.clearOuterRange_Range;
			this.clearInnerRange = this.clearInnerRange_Range;
			this.replaceInnerRange = this.replaceInnerRange_Range;

		} else {

			this.insertHTMLBefore = this.insertHTMLBefore_Nodes;
			this.insertHTMLAfter = this.insertHTMLAfter_Nodes;
			this.insertHTMLTop = this.insertHTMLTop_Nodes;
			this.insertHTMLBottom = this.insertHTMLBottom_Nodes;
			this.clearOuterRange = this.clearOuterRange_Nodes;
			this.clearInnerRange = this.clearInnerRange_Nodes;
			this.replaceInnerRange = this.replaceInnerRange_Nodes;

		}

	},

	insertHTMLBefore: function(element, html) { Firestorm.t(1); },
	insertHTMLAfter: function(element, html) { Firestorm.t(1); },
	insertHTMLTop: function(element, html) { Firestorm.t(1); },
	insertHTMLBottom: function(element, html) { Firestorm.t(1); },

	clearOuterRange: function(start_element, end_element) { Firestorm.t(1); },
	clearInnerRange: function(start_element, end_element) { Firestorm.t(1); },
	replaceInnerRange: function(start_element, end_element, html) { Firestorm.t(1); },

	insertHTML: function(element, html, position) {

		this['insertHTML' + (position || 'Bottom')](element, html);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// nodes api

	_setInnerHTML: function(element, html) {

		var matches,
			count,
			i,
			script;

		if (this._moves_whitespace) {
			matches = [];
			// Right now we only check for script tags with ids with the goal of targeting morphs.
			// Remove space before script to insert it later.
			html = html.replace(/(\s+)(<script id='([^']+)')/g, function(match, spaces, tag, id) {
				matches.push([id, spaces]);
				return tag;
			});

		}

		element.innerHTML = html;

		// If we have to do any whitespace adjustments, do them now
		if (matches && matches.length > 0) {

			count = matches.length;
			for (i = 0; i < count; i++) {
				script = Firestorm.Element.findChildById(element, matches[i][0]);
				script.parentNode.insertBefore(document.createTextNode(matches[i][1]), script);
			}

		}

	},

	/**
	 * Given a parent node and some HTML, generate a set of nodes. Return the first
	 * node, which will allow us to traverse the rest using nextSibling.
	 *
	 * In cases of certain elements like tables and lists we cannot just assign innerHTML and get the nodes,
	 * cause innerHTML is either readonly on them in IE, or it would destroy some of the content.
	 **/
	_firstNodeFor: function(parentNode, html) {

		var map = this._wrap_map[parentNode.tagName.toLowerCase()] || [ 0, "", "" ],
			depth = map[0],
			start = map[1],
			end = map[2],
			element,
			i,
			shy_element;

		if (this._needs_shy) {
			// make the first tag an invisible text node to retain scripts and styles at the beginning
			html = '&shy;' + html;
		}

		element = document.createElement('div');

		this._setInnerHTML(element, start + html + end);

		for (i = 0; i <= depth; i++) {

			element = element.firstChild;

		}

		if (this._needs_shy) {

			// Look for &shy; to remove it.
			shy_element = element;

			// Sometimes we get nameless elements with the shy inside
			while (shy_element.nodeType === 1 && !shy_element.nodeName) {
				shy_element = shy_element.firstChild;
			}

			// At this point it's the actual unicode character.
			if (shy_element.nodeType === 3 && shy_element.nodeValue.charAt(0) === "\u00AD") {
				shy_element.nodeValue = shy_element.nodeValue.slice(1);
			}

		}

		return element;

	},

	/**
	 * Remove everything between two tags
	 * @param start_element
	 * @param end_element
	 */
	clearInnerRange_Nodes: function(start_element, end_element) {

		var node = start_element.nextSibling;

		while (node) {

			if (node === end_element) {
				break;
			}

			node.parentNode.removeChild(node);
			node = start_element.nextSibling;

		}

	},

	clearOuterRange_Nodes: function(start_element, end_element) {

		this.clearInnerRange_Nodes(start_element, end_element);
		start_element.parentNode.removeChild(start_element);
		end_element.parentNode.removeChild(end_element);

	},

	replaceInnerRange_Nodes: function(start_element, end_element, html) {

		this.clearInnerRange_Nodes(start_element, end_element);
		this.insertHTMLBefore_Nodes(end_element, html);

	},

	_insertHTMLBefore: function(parent_node, html, insert_before) {

		var node,
			next_sibling;

		node = this._firstNodeFor(parent_node, html);

		while (node) {
			next_sibling = node.nextSibling;
			parent_node.insertBefore(node, insert_before);
			node = next_sibling;
		}

	},

	insertHTMLAfter_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element.nextSibling);

	},

	insertHTMLBefore_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element);

	},

	insertHTMLTop_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, element.firstChild);

	},

	insertHTMLBottom_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, null);

	},

	// endL nodes api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// range api

	_createInnerRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartAfter(start_element);
		range.setEndBefore(end_element);
		return range;

	},

	_createOuterRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartBefore(start_element);
		range.setEndAfter(end_element);
		return range;

	},

	replaceInnerRange_Range: function(start_element, end_element, html) {

		var range = this._createInnerRange(start_element, end_element);

		range.deleteContents();
		range.insertNode(range.createContextualFragment(html));
	},

	clearOuterRange_Range: function(start_element, end_element) {

		var range = this._createOuterRange(start_element, end_element);
		range.deleteContents();

	},

	clearInnerRange_Range: function(start_element, end_element) {

		var range = this._createInnerRange(start_element, end_element);
		range.deleteContents();

	},

	insertHTMLAfter_Range: function(element, html) {

		var range = document.createRange();
		range.setStartAfter(element);
		range.setEndAfter(element);

		range.insertNode(range.createContextualFragment(html));

	},

	insertHTMLBefore_Range: function(element, html) {

		var range = document.createRange();
		range.setStartBefore(element);
		range.setEndBefore(element);

		range.insertNode(range.createContextualFragment(html));

	},

	insertHTMLTop_Range: function(element, html) {

		var range = document.createRange();
		range.setStart(element, 0);
		range.collapse(true);
		range.insertNode(range.createContextualFragment(html));

	},

	insertHTMLBottom_Range: function(element, html) {

		var last_child = element.lastChild,
			range;

		if (last_child) {

			range = document.createRange();
			range.setStartAfter(last_child);
			range.collapse(true);
			range.insertNode(range.createContextualFragment(html));

		} else {

			this.insertHTMLTop_Range(element, html);

		}

	}

	// end: range api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};