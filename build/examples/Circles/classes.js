Lava.ClassManager.define(
'Lava.widget.CirclesExample',
{
	Extends: 'Lava.widget.Standard',
	name: 'circles_example',

	_properties: {
		circles: null,
		selected_circle: null
	},

	_event_handlers: {
		circle_mouse_down: '_onCircleMouseDown',
		add: '_addCircle',
		'delete': '_deleteCircle'
	},

	_circles: null,

	CIRCLE_SIZE: 40,
	AREA_SIZE: 500,

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

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		this._properties.circles = Examples.makeLive(ExampleData.circles);
		this._circles = this._properties.circles;

	},

	_addCircle: function(dom_event_name, dom_event, view, template_arguments) {

		var circle = new Lava.mixin.Properties({
			x: 0,
			y: 0,
			text: ''
		});
		this._circles.push(circle);
		this.set('selected_circle', circle);

	},

	_deleteCircle: function(dom_event_name, dom_event, view, template_arguments) {

		if (this._properties.selected_circle) {
			this._circles.removeValue(this._properties.selected_circle);
			this.set('selected_circle', null);
		}

	},

	_onCircleMouseDown: function(dom_event_name, dom_event, view, template_arguments) {

		var circle = template_arguments[0];
		this.set('selected_circle', circle);

		if (!this._mousemove_listener) {

			this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
			this._mouseup_listener = Lava.Core.addGlobalHandler('mouseup', this._onMouseUp, this);

			this._start_coordinates = dom_event.page;
			this._current_coordinates.x = circle.get('x');
			this._current_coordinates.y = circle.get('y');

		}

		dom_event.preventDefault(); // to prevent text selection

	},

	_onMouseUp: function(event_name, event_object) {

		Lava.Core.removeGlobalHandler(this._mousemove_listener);
		Lava.Core.removeGlobalHandler(this._mouseup_listener);
		this._mousemove_listener = null;
		this._mouseup_listener = null;

	},

	_constrain: function(coordinate) {

		var result = coordinate,
			limit = this.AREA_SIZE - this.CIRCLE_SIZE;
		if (coordinate < 0) result = 0;
		if (coordinate > limit) result = limit;
		return result;

	},

	_onMouseMove: function(event_name, event_object) {

		var circle = this._properties.selected_circle;
		circle.set('x', this._constrain(
			this._current_coordinates.x + event_object.page.x - this._start_coordinates.x)
		);
		circle.set('y', this._constrain(
			this._current_coordinates.y + event_object.page.y - this._start_coordinates.y)
		);

	}

});