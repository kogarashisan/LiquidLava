
Lava.define(
'Lava.view.refresher.Standard',
/**
 * Base class for animation support in views. Standard refresher does not animate templates, but inserts and removes them separately
 * @lends Lava.view.refresher.Standard#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	Shared: '_insertion_strategies',

	/**
	 * Map of callbacks for dynamic insertion of templates
	 * @type {Object.<string, string>}
	 */
	_insertion_strategies: {
		sequential_elements: '_insertSequentialElements'
	},

	/**
	 * Settings for this instance
	 * @type {_cRefresher}
	 */
	_config: null,
	/**
	 * View, that owns this refresher instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,

	/**
	 * Temporary storage for templates which were removed during current refresh cycle
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_removed_templates: {},

	/**
	 * Templates, that are currently in DOM
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

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
	/**
	 * Whether to perform template insertion and removal animations
	 * @type {boolean}
	 */
	_is_animation_enabled: false,

	/**
	 * Create refresher instance
	 * @param {_cRefresher} config
	 * @param {Lava.view.Abstract} view
	 * @param {_iContainer} container
	 */
	init: function(config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.insertion_strategy) {

			this._insertTemplate = this[this._insertion_strategies[config.insertion_strategy]];

		}

	},

	/**
	 * Queue templates for removal
	 * @param {Array.<Lava.system.Template>} templates
	 */
	removeTemplates: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			templates[i].broadcastSleep();
			this._removed_templates[templates[i].guid] = templates[i];

		}

	},

	/**
	 * Insert new templates into DOM and remove those, which are queued for removal
	 * @param {Array.<Lava.system.Template>} current_templates Templates, that refresher must render and insert into DOM.
	 *  Some of them are already there, some are in DOM but sleeping, and others are not yet in DOM
	 */
	refresh: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			if (!current_templates[i].isInDOM()) {

				this._insertTemplate(current_templates[i], i);
				this._fire('insertion_complete', current_templates[i]);

			} else if (current_templates[i].guid in this._removed_templates) {

				current_templates[i].broadcastWakeup();
				delete this._removed_templates[current_templates[i].guid];

			}

		}

		for (guid in this._removed_templates) {

			if (this._removed_templates[guid].isInDOM()) {

				this._removeTemplate(this._removed_templates[guid]);
				this._fire('removal_complete', this._removed_templates[guid]);

			}

		}

		this._removed_templates = {};

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates Templates that must be in DOM
	 */
	onRender: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			delete this._removed_templates[current_templates[i].guid];

		}

		for (guid in this._removed_templates) {

			if (this._removed_templates[guid].isInDOM()) {

				this._removed_templates[guid].broadcastRemove();
				this._fire('removal_complete', this._removed_templates[guid]);

			}

		}

		this._removed_templates = {};

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

			} else {

				template.broadcastWakeup();

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
	 * Insert template into DOM
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of this template in list of all active templates
	 */
	_insertTemplate: function(template, index) {

		this._view.getContainer().appendHTML(template.render());
		template.broadcastInDOM();

	},

	/**
	 * Remove template from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		// save, cause element container will throw an error if we try to do it after broadcastRemove
		var element = template.getFirstView().getContainer().getDOMElement();
		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();
		Firestorm.Element.destroy(element);

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

		// if animation was reversed, then template must be sleeping now
		if (template.isSleeping()) {
			template.broadcastWakeup();
		}

	},

	/**
	 * Are there any active animations
	 * @returns {boolean}
	 */
	hasAnimations: function() {

		return false;

	},

	/**
	 * Create animation instance
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_createAnimation: function(template, index) {

		Lava.t("Abstract function call: _createAnimation");

	},

	/**
	 * Get `_is_animation_enabled`
	 * @returns {boolean}
	 */
	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	/**
	 * Stop all active animations
	 */
	stopAnimations: function() {

	},

	/**
	 * (insertion strategy)
	 * With this callback you can insert Foreach elements at the right place.
	 * All templates inside Foreach are treated as single view with Element container
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_insertSequentialElements: function(template, index) {

		if (index) {

			this._current_templates[index - 1].getFirstView().getContainer().insertHTMLAfter(template.render());

		} else {

			this._view.getContainer().prependHTML(template.render());

		}

		template.broadcastInDOM();

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this.stopAnimations();

	}

});