
Lava.define(
'Lava.view.ContentContainerAbstract',
/**
 * A view, which can have a container and inner template. The only kind of view, which can have a void tag as container
 *
 * @lends Lava.view.ContentContainerAbstract#
 * @extends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * The content of the view
	 * @type {Lava.system.Template}
	 */
	_content: null,

	render: function() {

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.renderVoid()
				: this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_refresh: function() {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');
		}

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			this._content = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._content;

	},

	destroy: function() {

		if (this._content) {
			this._content.destroy();
			this._content = null;
		}

		this.Abstract$destroy();

	}

});