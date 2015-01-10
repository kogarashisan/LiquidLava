
Lava.define(
'Lava.view.refresher.Standard',
/**
 * Base class for animation support in views. Standard refresher does not animate templates, but inserts and removes them separately
 * @lends Lava.view.refresher.Standard#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

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

		if (config.get_start_element_callback) {

			this._getStartElement = config.get_start_element_callback;

		}

		if (config.get_end_element_callback) {

			this._getEndElement = config.get_end_element_callback;

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
	 * Insert new templates into DOM and remove those, which are queued for removal. Reorder existing templates
	 * @param {Array.<Lava.system.Template>} current_templates Templates, that refresher must render and insert into DOM.
	 *  Some of them can be already in DOM.
	 */
	refresh: function(current_templates) {

		var i = 1,
			count = current_templates.length,
			guid,
			previous_template = current_templates[0];

		if (previous_template) { // if list is not empty

			delete this._remove_queue[previous_template.guid];

			if (!previous_template.isInDOM()) {

				this._insertFirstTemplate(previous_template);
				this._fire('insertion_complete', previous_template);

			}

			for (; i < count; i++) {

				delete this._remove_queue[current_templates[i].guid];

				if (current_templates[i].isInDOM()) {

					this._moveTemplate(current_templates[i], previous_template);

				} else {

					this._insertTemplate(current_templates[i], previous_template, i);
					this._fire('insertion_complete', current_templates[i]);

				}

				previous_template = current_templates[i];

			}

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._removeTemplate(this._remove_queue[guid]);
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._current_templates = current_templates;
		this._remove_queue = {};

	},

	/**
	 * Insert template at the top of view's container
	 * @param {Lava.system.Template} template
	 */
	_insertFirstTemplate: function(template) {

		this._view.getContainer().prependHTML(template.render());
		template.broadcastInDOM();

	},

	/**
	 * Move `template` after `previous_template` (both are in DOM)
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} previous_template
	 */
	_moveTemplate: function (template, previous_template) {

		Firestorm.DOM.moveRegionAfter(
			this._getEndElement(previous_template),
			this._getStartElement(template),
			this._getEndElement(template)
		)

	},

	/**
	 * Get top element of a template
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getStartElement: function(template) {

		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Get bottom element of a template
	 * @param template
	 * @returns {HTMLElement}
	 */
	_getEndElement: function(template) {

		return template.getLastView().getContainer().getDOMElement();

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates Templates that must be in DOM
	 */
	render: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

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

		this._current_templates = current_templates;
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
	 * @param {Lava.system.Template} previous_template
	 * @param {number} index Index of this template in list of all active templates
	 */
	_insertTemplate: function(template, previous_template, index) {

		Firestorm.DOM.insertHTMLAfter(this._getEndElement(previous_template), template.render());
		template.broadcastInDOM();

	},

	/**
	 * Remove template from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		// save, cause we can not retrieve container's DOM elements after broadcastRemove
		var start_element = this._getStartElement(template),
			end_element = this._getEndElement(template);

		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();

		if (start_element == end_element) {

			Firestorm.Element.destroy(start_element);

		} else {

			// remove everything between tags and tags themselves
			Firestorm.DOM.clearOuterRange(start_element, end_element);

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

		this._current_templates = this._remove_queue = null;

	}

});