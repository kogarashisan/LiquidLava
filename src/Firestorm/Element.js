
Firestorm.Element = {

	addListener: function(element, event_name, callback, capture) {

		document.id(element).addEvent(event_name, callback, capture);

	},

	removeListener: function(element, event_name, callback) {

		document.id(element).removeEvent(event_name, callback);

	},

	addDelegation: function(element, event_name, selector, callback) {

		document.id(element).addEvent(event_name + ':relay(' + selector + ')', callback);

	},

	removeDelegation: function(element, event_name, selector, callback) {

		document.id(element).removeEvent(event_name + ':relay(' + selector + ')', callback);

	},

	destroy: function(element) {

		document.id(element).destroy();

	},

	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	getChildren: function(element, expression) {

		return document.id(element).getChildren(expression);

	},

	_findChildById: function(element, id) {

		var count,
			i,
			node,
			result = null;

		for (i = 0, count = element.childNodes.length; i < count; i++) {

			node = element.childNodes[i];
			if (node.nodeType == 1) {

				if (node.getAttribute('id') === id) {

					result = node;
					break;

				} else {

					result = this.findChildById(node, id);
					if (result) {
						break;
					}

				}

			}

		}

		return result;

	},

	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert target_element just before context
	 * @param {Node} context
	 * @param {Node} target_element
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert target_element after context
	 * @param {Node} context
	 * @param {Node} target_element
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	}

};