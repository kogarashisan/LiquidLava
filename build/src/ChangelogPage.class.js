
Lava.define(
'Lava.widget.ChangelogPage',
{

	Extends: 'Lava.widget.ContentLoader',

	_properties: {
		versions: null,
		selected_version: {
			title: 'Changelog'
		}
	},

	VERSIONS_DIR: 'versions/',

	init: function(config, widget, parent_view, template, properties) {

		var hash = window.location.hash;

		this._properties.versions = Examples.makeLive(LavaVersions);
		this.ContentLoader$init(config, widget, parent_view, template, properties);

		if (hash) {

			this._loadItemByHash(hash);

		}

	},

	_onItemLoaded: function(text, item) {

		item.set('html', text);

	},

	_getItemByHash: function(path) {

		var version = null;

		this._properties.versions.each(function(value){
			if (value.get('name') == path) {
				version = value;
				return false;
			}
		});

		return version;

	},

	_showItem: function(item) {

		var example_content_container = Firestorm.getElementById('version_content_container');

		if (this._properties.selected_version != item) {

			if (this._properties.selected_version.isProperties) this._properties.selected_version.set('is_selected', false);
			Firestorm.Element.setProperty(example_content_container, 'html', item.get('html'));
			this._set('selected_version', item);
			item.set('is_selected', true);
			Lava.refreshViews();

		}

	},

	_getFilePath: function(item) {

		return this.VERSIONS_DIR + item.get('name') + '.html';

	}

});