Lava.ClassManager.define(
'Lava.widget.DemoDraggable',
/**
 * @extends {Lava.widget.Standard}
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'demo_draggable',

	_property_descriptors: {
		x: {type: 'Integer'},
		y: {type: 'Integer'}
	},

	_properties: {
		x: 0,
		y: 0
	},

	_event_handlers: {
		mouse_down: 'onMouseDown'
	},

	_mousemove_listener: null,
	_mouseup_listener: null,

	_current_coordinates: {
		x: 0,
		y: 0
	},

	_start_coordinates: {
		x: 0,
		y: 0
	},

	onMouseDown: function(dom_event_name, dom_event) {

		if (!this._mousemove_listener) {

			this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
			this._mouseup_listener = Lava.Core.addGlobalHandler('mouseup', this._onMouseUp, this);

			this._start_coordinates = dom_event.page;

		}

		dom_event.preventDefault(); // to prevent text selection

	},

	_onMouseUp: function(event_name, event_object) {

		Lava.Core.removeGlobalHandler(this._mousemove_listener);
		Lava.Core.removeGlobalHandler(this._mouseup_listener);
		this._mousemove_listener = null;
		this._mouseup_listener = null;

		this._current_coordinates.x = this._properties.x;
		this._current_coordinates.y = this._properties.y;

	},

	_onMouseMove: function(event_name, event_object) {

		this.set('x', this._current_coordinates.x + event_object.page.x - this._start_coordinates.x);
		this.set('y', this._current_coordinates.y + event_object.page.y - this._start_coordinates.y);

	}

});