
Lava.define(
'Lava.system.PopoverManager',
/**
 * Shows and positions popups and tooltips
 * @lends Lava.system.PopoverManager#
 */
{

	/**
	 * Listener for {@link Lava.system.ViewManager#event:EVENTNAME_stack_changed}
	 * @type {_tListener}
	 */
	_mouseover_stack_changed_listener: null,

	/**
	 * The mouseover element with tooltip
	 * @type {HTMLElement}
	 */
	_tooltip_target: null,

	/**
	 * The attribute with tooltip text
	 * @type {string}
	 */
	_attribute_name: 'data-tooltip',

	/**
	 * Listener for the mousemove DOM event
	 * @type {_tListener}
	 */
	_mousemove_listener: null,

	/**
	 * Instance of the Tooltip widget
	 * @type {Lava.widget.Standard}
	 */
	_tooltip: null,

	/**
	 * Name of the widget that will show up as a tooltip
	 * @type {string}
	 */
	DEFAULT_TOOLTIP_WIDGET: 'Tooltip',

	/**
	 * Create tooltip widget instance and start listening to mouse events
	 */
	enable: function() {

		if (!this._mouseover_stack_changed_listener) {
			Lava.view_manager.lendEvent('mouse_events');
			this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
			if (!this._tooltip) this._tooltip = Lava.createWidget(this.DEFAULT_TOOLTIP_WIDGET);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},

	/**
	 * Remove tooltip widget from DOM and stop responding to events
	 */
	disable: function() {

		if (this._mouseover_stack_changed_listener) {
			Lava.view_manager.releaseEvent('mouse_events');
			Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
			this._mouseover_stack_changed_listener = null;
			if (this._mousemove_listener) {
				Lava.DOMEvents.removeListener(this._mousemove_listener);
				this._mousemove_listener = null;
			}
			this._tooltip.set('is_visible', false);
			this._tooltip.remove();
		}

	},

	/**
	 * Does it listen to mouse movements and show tooltips?
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._mouseover_stack_changed_listener != null;

	},

	/**
	 * Mouse has crossed an element boundary. Find new element with tooltip and show new content
	 * @param {Lava.system.ViewManager} view_manager
	 * @param {Array.<HTMLElement>} stack
	 */
	_onMouseoverStackChanged: function(view_manager, stack) {

		var new_tooltip_target = null,
			html;

		for (var i = 0, count = stack.length; i < count; i++) {

			if (Firestorm.Element.hasAttribute(stack[i], this._attribute_name)) {

				new_tooltip_target = stack[i];
				break;

			}

		}

		if (new_tooltip_target != this._tooltip_target) {

			if (!this._tooltip_target) { // if there was no tooltip

				if (Lava.schema.DEBUG && this._mousemove_listener) Lava.t();
				this._mousemove_listener = Lava.DOMEvents.addListener('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) { // if there was a tooltip, and now it should be hidden

				Lava.DOMEvents.removeListener(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				html = Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name);
				html = (Lava.schema.DISPLAY_HTML_IN_TOOLTIPS)
					// either treat tooltips as encoded HTML
					? this._decodeHTML(html)
					// or as plain text
					: html.replace(/\r?\n/g, '<br/>');

				this._tooltip.set('html', html);
				this._tooltip.set('is_visible', !!(html || !Lava.schema.popover_manager.HIDE_EMPTY_TOOLTIPS));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},

	/**
	 * Decode an escaped HTML string
	 * @param string
	 * @returns {string}
	 */
	_decodeHTML: function(string) {

		var e = document.createElement('div');
		e.innerHTML = string;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;

	},

	/**
	 * Mouse has changed position. Move tooltip accordingly
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	_onMouseMove: function(event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	},

	/**
	 * Destroy PopoverManager instance
	 */
	destroy: function() {

		this.isEnabled() && this.disable();

	}

});