
Lava.define(
'Lava.view.refresher.Standard',
/**
 * Base class for animation support in views. Standard refresher does not animate templates, but inserts and removes them separately
 * @lends Lava.view.refresher.Standard#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	Shared: ['_insertion_strategies', '_removal_strategies'],

	/**
	 * Map of callbacks for dynamic insertion of templates
	 * @type {Object.<string, string>}
	 */
	_insertion_strategies: {
		sequential_elements: '_insertTemplate_SequentialElements'
	},

	/**
	 * Map of callbacks for dynamic removal of templates
	 * @type {Object.<string, string>}
	 */
	_removal_strategies: {
		element_range: '_removeTemplate_ElementRange'
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
	_remove_queue: {},
	/**
	 * Templates, that are currently in DOM
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

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

		} else if (config.insert_callback) {

			this._insertTemplate = config.insert_callback;

		}

		if (config.removal_strategy) {

			this._removeTemplate = this[this._removal_strategies[config.removal_strategy]];

		} else if (config.remove_callback) {

			this._removeTemplate = config.remove_callback;

		}

	},

	/**
	 * Queue templates for removal
	 * @param {Array.<Lava.system.Template>} templates
	 */
	prepareRemoval: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			this._remove_queue[templates[i].guid] = templates[i];

		}

	},

	/**
	 * Insert new templates into DOM and remove those, which are queued for removal
	 * @param {Array.<Lava.system.Template>} current_templates Templates, that refresher must render and insert into DOM.
	 *  Some of them can be already in DOM.
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

			} else if (current_templates[i].guid in this._remove_queue) {

				delete this._remove_queue[current_templates[i].guid];

			}

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._removeTemplate(this._remove_queue[guid]);
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._remove_queue = {};

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates Templates that must be in DOM
	 */
	render: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		// from templates, which are prepared for removal, filter out those, which should be in DOM
		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._remove_queue[guid].broadcastRemove();
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._remove_queue = {};

		return this._render();

	},

	/**
	 * Render current templates
	 * @returns {string}
	 */
	_render: function() {

		var buffer = '',
			i = 0,
			count = this._current_templates.length;

		for (; i < count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

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
	 * [insertion strategy]
	 * With this callback you can insert Foreach elements at the right place.
	 * All templates inside Foreach are treated as single view with Element container
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_insertTemplate_SequentialElements: function(template, index) {

		if (index) {

			this._current_templates[index - 1].getLastView().getContainer().insertHTMLAfter(template.render());

		} else {

			this._view.getContainer().prependHTML(template.render());

		}

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
	 * [removal strategy]
	 * Remove a template that has views with real containers at it's beginning and at the end.
	 * Removes the first and last views and anything between them
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate_ElementRange: function(template) {

		// save, cause we can not retrieve container's DOM elements after broadcastRemove
		var start_element = template.getFirstView().getContainer().getStartElement(),
			end_element = template.getLastView().getContainer().getEndElement();

		if (start_element == end_element) Lava.t();

		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();

		// remove everything between tags and tags themselves
		Firestorm.DOM.clearOuterRange(start_element, end_element);

	},

	/**
	 * Are there any active animations
	 * @returns {boolean}
	 */
	hasAnimations: function() {

		return false;

	},

	/**
	 * Is insertion or removal animation enabled
	 * @returns {boolean} <kw>false</kw>
	 */
	isAnimationEnabled: function() {

		return false;

	},

	/**
	 * Actions to take before owner view is removed from DOM
	 */
	broadcastRemove: function() {

		for (var guid in this._remove_queue) {

			this._remove_queue[guid].broadcastRemove();

		}

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._current_templates = this._remove_queue;

	}

});