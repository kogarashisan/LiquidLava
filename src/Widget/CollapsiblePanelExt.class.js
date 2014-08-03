
Lava.define(
'Lava.widget.CollapsiblePanelExt',
/**
 * A panel that removes it's content from DOM in collapsed state.
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
		is_expanded: true,
		is_locked: false,
		is_animation_enabled: true,
		title: '',
		content: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_role_handlers: {
		_content_if: '_handleContentIf'
	},

	_content_refresher: null,

	_handleContentIf: function(view, template_arguments) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},

	_onInsertionComplete: function() {

		this._fire('expanded');

	},

	_onRemovalComplete: function() {

		this._fire('collapsed');

	},

	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},

	_setAnimationEnabled: function(name, value) {

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