
Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for animation support.
 *
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Default
 */
{

	Extends: 'Lava.view.refresher.Default',

	_is_animation_enabled: true,

	refresh: function(current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Default$refresh(current_templates);

		}

	},

	_refreshAnimated: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			this._animateInsertion(current_templates[i], i);

			delete this._removed_templates[current_templates[i].guid];

		}

		for (guid in this._removed_templates) {

			this._animateRemoval(this._removed_templates[guid]);

		}

		this._removed_templates = {};

	},

	onRender: function(current_templates) {

		this.stopAnimations();

		this.Default$onRender(current_templates);

	},

	_onRenderAnimated: function(current_templates) {

	},

	enableAnimation: function() {

		this._is_animation_enabled = true;

	},

	disableAnimation: function() {

		this._is_animation_enabled = false;
		this.stopAnimations();

	},

	stopAnimations: function() {

		for (var guid in this._animations_by_template_guid) {

			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},

	hasAnimations: function() {

		for (var name in this._animations_by_template_guid) {

			return true;

		}

		return false;

	}

});