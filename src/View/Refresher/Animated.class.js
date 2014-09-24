
Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for refreshers, which support animation
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Standard
 */
{

	Extends: 'Lava.view.refresher.Standard',

	_is_animation_enabled: true,

	refresh: function(current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Standard$refresh(current_templates);

		}

	},

	/**
	 * Version of `refresh()`, which animates insertion and removal of templates
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
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

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	onRender: function(current_templates) {

		this.stopAnimations();

		this.Standard$onRender(current_templates);

	},

	/**
	 * Set `_is_animation_enabled` to <kw>true</kw>
	 */
	enableAnimation: function() {

		this._is_animation_enabled = true;

	},

	/**
	 * Set `_is_animation_enabled` to <kw>false</kw> and stop all animations
	 */
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

		return !Firestorm.Object.isEmpty(this._animations_by_template_guid);

	}

});