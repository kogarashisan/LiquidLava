
Lava.define(
'Lava.view.refresher.Default',
/**
 * Base class for animation support. Does not animate templates, but inserts and removes them separately.
 * @lends Lava.view.refresher.Default#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	Shared: '_insertion_strategies',

	// all functions are called in context of THIS class, not the shared object
	_insertion_strategies: {
		sequential_elements: '_insertSequentialElements'
	},

	_config: null,
	/**
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	_container: null,

	/**
	 * Temporary storage for templates which were removed during current refresh cycle
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_removed_templates: {},

	/**
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * @type {Object.<_tGUID, Lava.animation.Standard>}
	 */
	_animations_by_template_guid: {},
	/**
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_templates_by_animation_guid: {},

	_is_animation_enabled: false,

	/**
	 * @param {_cRefresher} config
	 * @param {Lava.view.Abstract} view
	 * @param {iContainer} container
	 */
	init: function(config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.insertion_strategy) {

			this._insertTemplate = this[this._insertion_strategies[config.insertion_strategy]];

		}

	},

	removeTemplates: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			templates[i].broadcastSleep();
			this._removed_templates[templates[i].guid] = templates[i];

		}

	},

	/**
	 * @param current_templates Templates, that refresher must render and insert in DOM. Some of them are already there,
	 * some are in DOM but sleeping, and others are not in DOM.
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

	_insertTemplate: function(template, index) {

		this._view.getContainer().appendHTML(template.render());
		template.broadcastInDOM();

	},

	_removeTemplate: function(template) {

		// save, cause element container will throw an error if we try to do it after broadcastRemove
		var element = template.getFirstView().getContainer().getDOMElement();
		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();
		Firestorm.Element.destroy(element);

	},

	_getAnimationTarget: function(template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},

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

	_onRemovalComplete: function(animation, template) {

		this._removeTemplate(template);

	},

	_onInsertionComplete: function(animation, template) {

		// if animation was reversed, then template must be sleeping now
		if (template.isSleeping()) {
			template.broadcastWakeup();
		}

	},

	hasAnimations: function() {

		return false;

	},

	/**
	 * @param {Lava.system.Template} template
	 */
	_createAnimation: function(template) {

		Lava.t("Abstract function call: _createAnimation");

	},

	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	stopAnimations: function() {

	},

	/**
	 * (insertion strategy)
	 * With this callback you can insert Foreach elements at the right place.
	 * All templates inside Foreach are treated as single view with Element container.
	 * @param template
	 * @param index
	 */
	_insertSequentialElements: function(template, index) {

		if (index) {

			this._current_templates[index - 1].getFirstView().getContainer().insertHTMLAfter(template.render());

		} else {

			this._view.getContainer().prependHTML(template.render());

		}

		template.broadcastInDOM();

	},

	destroy: function() {

		this.stopAnimations();

	}

});