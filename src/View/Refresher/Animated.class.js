
Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for refreshers, which support animation
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Standard
 */
{

	Extends: 'Lava.view.refresher.Standard',

	/**
	 * Whether to perform template insertion and removal animations
	 * @type {boolean}
	 */
	_is_animation_enabled: true,
	/**
	 * Animation instances for each template
	 * @type {Object.<_tGUID, Lava.animation.Standard>}
	 */
	_animations_by_template_guid: {},
	/**
	 * Template of each animation
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_templates_by_animation_guid: {},

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

			delete this._remove_queue[current_templates[i].guid];

		}

		for (guid in this._remove_queue) {

			this._animateRemoval(this._remove_queue[guid]);

		}

		this._remove_queue = {};

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	render: function(current_templates) {

		this._finishAnimations();
		return this.Standard$render(current_templates);

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
		this._finishAnimations();

	},

	/**
	 * Get `_is_animation_enabled`
	 * @returns {boolean}
	 */
	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	/**
	 * Finish all active animations (rewind to end and raise "completed" events)
	 */
	_finishAnimations: function() {

		for (var guid in this._animations_by_template_guid) {

			// you can not just stop() them, cause you need onComplete events to fire
			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},

	hasAnimations: function() {

		return !Firestorm.Object.isEmpty(this._animations_by_template_guid);

	},

	/**
	 * Insert the template into DOM and apply corresponding animation
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of this template in list of all active templates
	 */
	_animateInsertion: function(template, index) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation) {

			if (!template.isInDOM()) {

				this._insertTemplate(template, index);
				animation = this._createAnimation(template, index);

			}

		}

		if (animation) {

			animation.resetDirection();
			animation.safeStart();

		}

	},

	/**
	 * Apply template removal animation and remove element from DOM in the end of it
	 * @param {Lava.system.Template} template
	 */
	_animateRemoval: function(template) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation && template.isInDOM()) {

			animation = this._createAnimation(template);

		}

		if (animation) {

			animation.reverseDirection();
			animation.safeStart();

		}

	},

	/**
	 * Cleanup animation instance and update state of it's template
	 * @param {Lava.animation.Abstract} animation
	 */
	_onAnimationComplete: function(animation) {

		var template = this._templates_by_animation_guid[animation.guid];

		if (animation.isReversed()) {

			this._onRemovalComplete(animation, template);
			this._fire('removal_complete', template);

		} else {

			this._onInsertionComplete(animation, template);
			this._fire('insertion_complete', template);

		}

		delete this._templates_by_animation_guid[animation.guid];
		delete this._animations_by_template_guid[template.guid];

	},

	/**
	 * Get the element of the template, that will be animated
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getAnimationTarget: function(template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Removal animation has ended. Remove template from DOM
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(animation, template) {

		this._removeTemplate(template);

	},

	/**
	 * Insertion animation has ended. Update state of the template
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onInsertionComplete: function(animation, template) {



	},

	/**
	 * Create animation instance
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_createAnimation: function(template, index) {

		Lava.t("Abstract function call: _createAnimation");

	},

	broadcastRemove: function() {

		this._finishAnimations();
		this.Standard$broadcastRemove();

	},

	destroy: function() {

		this._finishAnimations();

	}

});