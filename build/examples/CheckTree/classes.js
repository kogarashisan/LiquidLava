Lava.ClassManager.define(
'Lava.widget.CheckTreeExample',
/** @extends {Lava.widget.Standard} */
{

	Extends: 'Lava.widget.Standard',

	name: 'tree_example',

	_properties: {
		records: null
	},

	_role_handlers: {
		_checkbox: '_handleCheckbox'
	},

	_checkboxes: {},

	_handleCheckbox: function(view, template_arguments) {

		// important: in this example we do not need to listen for views destruction,
		// but in real application - you will probably want to.
		view.on('checked_changed', this._onCheckedChanged, this);

	},

	_toggleTree: function(node, is_checked) {

		var children = node.get('children'),
			i = 0,
			count = children.getCount(),
			child;

		for (; i < count; i++) {
			child = children.getValueAt(i);
			child.set('is_checked', is_checked);
			child.set('is_indeterminate', false);
			if (child.get('type') == 'folder') {
				this._toggleTree(child, is_checked);
			}
		}

	},

	_fixState: function(node) {

		var children = node.get('children'),
			i = 0,
			count = children.getCount(),
			child,
			count_checked = 0,
			count_indeterminate = 0;

		for (; i < count; i++) {
			child = children.getValueAt(i);
			if (child.get('is_checked')) {
				count_checked++;
			}
			if (child.get('is_checked')) {
				count_indeterminate++;
			}
		}

		if (count_checked == count) {
			node.set('is_checked', true);
			node.set('is_indeterminate', false);
		} else if (count_checked == 0 && count_indeterminate == 0) {
			node.set('is_checked', false);
			node.set('is_indeterminate', false);
		} else {
			node.set('is_indeterminate', true);
		}

	},

	_onCheckedChanged: function(checkbox) {

		var node = checkbox.locateViewWithProperty('node').get('node'),
			is_checked = checkbox.get('is_checked'),
			parent = node.get('parent');

		if (node.get('type') == 'folder') {
			this._toggleTree(node, is_checked);
		}
		node.set('is_checked', is_checked);
		node.set('is_indeterminate', false);

		while (parent) {

			this._fixState(parent);
			parent = parent.get('parent');

		}

	}

});