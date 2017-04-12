
// @todo This is work-in-progress

/**
 * @event Lava.system.FocusManager#focus_target_changed
 * @type {Lava.widget.Standard}
 * @lava-type-description New widget that owns the virtual focus
 */

Lava.define(
'Lava.system.FocusManager',
/**
 * Delegated keyboard events to currently focused view.
 * @lends Lava.system.FocusManager#
 * @extends Lava.mixin.Observable#
 */
{
	Extends: 'Lava.mixin.Observable',

	/**
	 * Currently focused DOM element
	 * @type {HTMLElement}
	 */
	_focused_element: null,
	/**
	 * View, which receives keyboard events (first <i>known</i> parent of the focused element)
	 * @type {Lava.widget.Standard}
	 */
	_focused_view: null,
	/**
	 * Listener for DOM "blur" event
	 * @type {_tListener}
	 */
	_blur_listener: null,
	/**
	 * @type {_tListener}
	 */
	_focus_stack_changed_listener: null,

    _keydown_listener: null,
    _keyup_listener: null,
    _keypress_listener: null,

	/**
	 * Start listening to global focus-related events
	 */
	enable: function() {

		if (!this._focus_stack_changed_listener) {

            /*$(document.body).onfocusin = handleMouseOver;
            $(document.body).onfocusout = handleMouseOut;
            $(document.body).addEventListener('focus',handleMouseOver,true);
            $(document.body).addEventListener('blur',handleMouseOut,true);*/

			Lava.view_manager.lendEvent("focusin");
			this._focus_stack_changed_listener = Lava.view_manager.on("focusin_stack_changed", this._onFocusStackChanged, this);
			this._blur_listener = Lava.DOMEvents.addListener('blur', this._onElementBlurred, this);
            this._keydown_listener = Lava.DOMEvents.addListener('keydown', this._onKeyboard, this, "KeyDown");
            this._keyup_listener = Lava.DOMEvents.addListener('keyup', this._onKeyboard, this, "KeyUp");
            this._keypress_listener = Lava.DOMEvents.addListener('keypress', this._onKeyboard, this, "KeyPress");
		}

	},

	/**
	 * Stop listening to all focus-related events
	 */
	disable: function() {

		if (this._focus_stack_changed_listener) {
			Lava.view_manager.releaseEvent("focusin");
			Lava.view_manager.removeListener(this._focus_stack_changed_listener);
			Lava.DOMEvents.removeListener(this._blur_listener);
            Lava.DOMEvents.removeListener(this._keydown_listener);
            Lava.DOMEvents.removeListener(this._keyup_listener);
            Lava.DOMEvents.removeListener(this._keypress_listener);
			this._focused_element
				= this._focused_view
				= this._focus_stack_changed_listener
				= this._blur_listener
				= this._keydown_listener
				= this._keyup_listener
				= this._keypress_listener
				= null;
		}

	},

    _onKeyboard: function(view_manager, event_object, event_name) {

        this._focused_view && this._focused_view.getWidget().sendBubblingEvent(
            "onFocus" + event_name,
            [event_object]
        );

    },

	/**
	 * Does it listen to focus changes and sends keyboard events
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._blur_listener != null;

	},

	/**
	 * Get the currently focused view, which receives keyboard navigation.
	 * @returns {Lava.view.Abstract}
	 */
	getFocusedView: function() {

		return this._focused_view;

	},

	/**
	 * Get the element with focus. May be null, when widget was set manually.
	 * @returns {HTMLElement}
	 */
	getFocusedElement: function() {

		return this._focused_element;

	},

	/**
	 * Test if the given widget equals to the currently focused view, or is one of it's parents.
	 * @param {Lava.widget.Standard} widget
	 * @returns {boolean}
	 */
	hasFocus: function(widget) {

		var current = this._focused_view;

		while (current && current != widget) {

			current = current.getParentWidget();

		}

		return current == widget;

	},

	_clearTarget: function() {

		var event_object = {
			old_focused_element: this._focused_element,
			old_focused_view: this._focused_view
		};

		this._focused_view && this._focused_view.getWidget().sendBubblingEvent('onFocusLost', [event_object]);

		this._focused_element
			= this._focused_view
			= null;

	},

	_onFocusStackChanged: function(view_manager, stack) {

		var focused_element = stack[0] || null,
			i = 0,
			count = stack.length,
			focused_view,
			event_object;

		if (this._focused_element != focused_element) {

			this._clearTarget();
			this._focused_element = focused_element;

			for (; i < count; i++) {
				focused_view = Lava.view_manager.getViewByElement(stack[i]);
				if (focused_view) {
                    this._focused_view = focused_view;
                    event_object = {
                        new_focused_element: focused_element,
                        new_focused_view: focused_view
                    };
					focused_view.getWidget().sendBubblingEvent('onFocusAcquired', [event_object]);
					break;
				}
			}

		}

	},

	/**
	 * Clear old virtual focus target and `_focused_element`
	 */
	_onElementBlurred: function() {

		this._clearTarget();
		this._focused_element = null;

	},

	/**
	 * Blur currently focused DOM element and clear virtual focus target
	 */
	blur: function() {

		// according to specification, the right way to blur - is to focus the root <html> element
		document.documentElement.focus();

	},

	/**
	 * Destroy FocusManager instance
	 */
	destroy: function() {

		this.disable();

	}

});