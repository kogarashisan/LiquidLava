
Lava.define(
'Lava.system.PopoverManager',
/**
 * @lends Lava.system.PopoverManager#
 */
{

	_mouseover_stack_changed_listener: null,

	_tooltip_target: null,

	_attribute_name: 'data-tooltip',

	_mousemove_listener: null,

	_tooltip: null,

	_default_tooltip_widget: 'Tooltip',

	enable: function() {

		if (Lava.schema.DEBUG && this._mouseover_stack_changed_listener) Lava.t("PopoverManager is already enabled");
		Lava.view_manager.lendEvent('mouse_events');
		this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
		if (!this._tooltip) {
			this._tooltip = Lava.createWidget(this._default_tooltip_widget);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},

	disable: function() {

		Lava.view_manager.releaseEvent('mouse_events');
		Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
		this._mouseover_stack_changed_listener = null;
		if (this._mousemove_listener) {
			Lava.Core.removeGlobalHandler(this._mousemove_listener);
			this._mousemove_listener = null;
		}
		this._tooltip.remove();

	},

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
				this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) { // if there was a tooltip, and now it should be hidden

				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				html = Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name).replace(/\r?\n/g, '<br/>');
				this._tooltip.set('html', html);
				this._tooltip.set('is_visible', !!(html || !Lava.schema.popover_manager.HIDE_EMPTY_TOOLTIPS));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},

	_onMouseMove: function(event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	}

});