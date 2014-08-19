
Lava.define(
'Lava.view.View',
/**
 * @lends Lava.view.View#
 * @extends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Lava.system.Template}
	 */
	_contents: null,

	_postInit: function() {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	},

	render: function() {

		if (this._is_sleeping) this._wakeup();

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.renderVoid()
				: this._container.wrap(this._renderContents());

		} else {

			result = this._renderContents();

		}

		return result;

	},

	_refresh: function() {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');
		}

	},

	_renderContents: function() {

		return this._getContents().render();

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._contents != null) {

			this._contents[function_name]();

		}

	},

	_getContents: function() {

		if (this._contents == null) {

			this._contents = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._contents;

	},

	destroy: function() {

		if (this._contents) {
			this._contents.destroy();
			this._contents = null;
		}

		this.Abstract$destroy();

	}

});