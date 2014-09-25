/**
 * Methods for working with DOM elements
 */
Firestorm.Element = {

	/**
	 * Attach DOM listener to an element
	 * @param {HTMLElement} element The DOM element for attaching the event
	 * @param {string} event_name Name of DOM event
	 * @param {function} callback Callback for the listener
	 * @param {boolean} capture Use capturing phase
	 */
	addListener: function(element, event_name, callback, capture) {

		document.id(element).addEvent(event_name, callback, capture);

	},

	/**
	 * Detach DOM listener
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {function} callback
	 */
	removeListener: function(element, event_name, callback) {

		document.id(element).removeEvent(event_name, callback);

	},

	/**
	 * Route events from elements inside `element` that match the `selector`
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	addDelegation: function(element, event_name, selector, callback) {

		document.id(element).addEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Stop delegating events
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	removeDelegation: function(element, event_name, selector, callback) {

		document.id(element).removeEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Remove an element from DOM and clean all framework dependencies on that element.
	 * Destroyed elements cannot be reused
	 * @param {HTMLElement} element
	 */
	destroy: function(element) {

		document.id(element).destroy();

	},

	/**
	 * Remove the element from DOM tree. After removal it may be inserted back
	 * @param {HTMLElement} element
	 */
	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	/**
	 * Perform search by id for {@link Firestorm.Element#findChildById}
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
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

	/**
	 * Traverse element's children and find a child with given `id`
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	/**
	 * Insert an element relatively to `parent` element
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} where
	 */
	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	/**
	 * Insert an element inside `parent`, at the top of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	/**
	 * Insert an element inside `parent`, at the bottom of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert `target_element` just before `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert `target_element` after `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	},

	/**
	 * Get elements, that are children of `element` and match the given `selector`
	 * @param {HTMLElement} element Root element
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(element, selector) {

		return Slick.search(element, selector, []);

	}

};