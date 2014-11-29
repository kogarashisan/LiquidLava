
/**
 * Virtual focus target has changed
 * @event Lava.system.FocusManager#focus_target_changed
 * @type {Lava.widget.Standard}
 * @lava-type-description New widget that owns the virtual focus
 */

Lava.define(
'Lava.system.FocusManager',
/**
 * Tracks current focused element and widget, delegates keyboard navigation events. [Alpha, work in progress]
 * @lends Lava.system.FocusManager#
 * @extends Lava.mixin.Observable#
 */
{
	Extends: 'Lava.mixin.Observable',

	/**
	 * DOM element, which holds the focus
	 * @type {HTMLElement}
	 */
	_focused_element: null,

	/**
	 * Virtual focus target
	 * @type {Lava.widget.Standard}
	 */
	_focus_target: null,

	/**
	 * Listener for global "focus_acquired" event
	 * @type {_tListener}
	 */
	_focus_acquired_listener: null,
	/**
	 * Listener for global "focus_lost" event
	 * @type {_tListener}
	 */
	_focus_lost_listener: null,
	/**
	 * Listener for Core "focus" event
	 * @type {_tListener}
	 */
	_focus_listener: null,
	/**
	 * Listener for Core "blur" event
	 * @type {_tListener}
	 */
	_blur_listener: null,

	/**
	 * Initialize FocusManager instance
	 */
	init: function() {

		this._focus_acquired_listener = Lava.app.on('focus_acquired', this._onFocusTargetAcquired, this);
		this._focus_lost_listener = Lava.app.on('focus_lost', this.clearFocusedTarget, this);
		this._focus_listener = Lava.Core.addGlobalHandler('blur', this._onElementBlurred, this);
		this._blur_listener = Lava.Core.addGlobalHandler('focus', this._onElementFocused, this);

	},

	/**
	 * Get `_focus_target`
	 * @returns {Lava.widget.Standard}
	 */
	getFocusedTarget: function() {

		return this._focus_target;

	},

	/**
	 * Get `_focused_element`
	 * @returns {HTMLElement}
	 */
	getFocusedElement: function() {

		return this._focused_element;

	},

	/**
	 * Replace old virtual focus target widget with the new one. Fire "focus_target_changed"
	 * @param new_target
	 */
	_setTarget: function(new_target) {

		// will be implemented later
		//if (this._focus_target && this._focus_target != new_target) {
		//	this._focus_target.informFocusLost();
		//}

		if (this._focus_target != new_target) {
			this._focus_target = new_target;
			this._fire('focus_target_changed', new_target);
		}

	},

	/**
	 * Clear old virtual focus target and `_focused_element`
	 */
	_onElementBlurred: function() {

		this._setTarget(null);
		this._focused_element = null;

	},

	/**
	 * Clear old virtual focus target and set new `_focused_element`.
	 * @param event_name
	 * @param event_object
	 */
	_onElementFocused: function(event_name, event_object) {

		if (this._focused_element != event_object.target) {
			this._setTarget(null);
			this._focused_element = event_object.target;
		}

	},

	/**
	 * Set new virtual focus target and `_focused_element`
	 * @param app
	 * @param event_args
	 */
	_onFocusTargetAcquired: function(app, event_args) {

		this._setTarget(event_args.target);
		this._focused_element = event_args.element;

	},

	/**
	 * Clear old virtual focus target
	 */
	clearFocusedTarget: function() {

		this._setTarget(null);

	},

	/**
	 * Blur currently focused DOM element and clear virtual focus target
	 */
	blur: function() {

		if (this._focused_element) {
			this._focused_element.blur();
			this._focused_element = document.activeElement || null;
		}
		this._setTarget(null);

	},

	/**
	 * Destroy FocusManager instance
	 */
	destroy: function() {

		Lava.app.removeListener(this._focus_acquired_listener);
		Lava.app.removeListener(this._focus_lost_listener);
		Lava.Core.removeGlobalHandler(this._focus_listener);
		Lava.Core.removeGlobalHandler(this._blur_listener);

	}

});