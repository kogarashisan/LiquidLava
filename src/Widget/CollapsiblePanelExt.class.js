
/**
 * Panel started to expand it's body
 * @event Lava.widget.CollapsiblePanelExt#expanding
 */

/**
 * Panel started to collapse it's body
 * @event Lava.widget.CollapsiblePanelExt#collapsing
 */

/**
 * Panel's body has fully expanded
 * @event Lava.widget.CollapsiblePanelExt#expanded
 */

/**
 * Panel's body is collapsed
 * @event Lava.widget.CollapsiblePanelExt#collapsed
 */

Lava.define(
'Lava.widget.CollapsiblePanelExt',
/**
 * An expandable panel that removes it's content from DOM in collapsed state
 * @lends Lava.widget.CollapsiblePanelExt#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_expanded: {type: 'Boolean'},
		is_locked: {type: 'Boolean'},
		is_animation_enabled: {type: 'Boolean', setter: '_setAnimationEnabled'}
	},

	_properties: {
		/** Is panel expanded */
		is_expanded: true,
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Does panel use animation to expand and collapse it's body */
		is_animation_enabled: true,
		/** Panel's title */
		title: '',
		/** Content for the default panel's template */
		content: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_role_handlers: {
		_content_if: '_handleContentIf'
	},

	/**
	 * Refresher of the panel's body
	 * @type {Lava.view.refresher.Standard}
	 */
	_content_refresher: null,

	/**
	 * Handle view with the panel's body
	 * @param {Lava.view.Abstract} view
	 */
	_handleContentIf: function(view) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},

	/**
	 * Refresher has expanded the body, fire "expanded" event
	 */
	_onInsertionComplete: function() {

		this._fire('expanded');

	},

	/**
	 * Refresher has collapsed and removed the body, fire "collapsed" event
	 */
	_onRemovalComplete: function() {

		this._fire('collapsed');

	},

	/**
	 * Toggle <wp>is_expanded</wp> property, if not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},

	/**
	 * Setter for `is_animation_enabled`
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setAnimationEnabled: function(value, name) {

		if (this._properties.is_animation_enabled != value) {

			this._set(name, value);

			// it may be set via assign or right after creation. At this time refresher does not exist yet.
			if (this._content_refresher) {

				if (value) {

					this._content_refresher.enableAnimation();

				} else {

					this._content_refresher.disableAnimation();

				}

			}

		}

	}

});