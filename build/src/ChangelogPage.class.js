

Lava.define(
'Lava.widget.ChangelogPage',
{

	Extends: 'Lava.widget.Standard',
	name: 'changelog_page',

	_properties: {
		versions: null,
		selected_version: {
			title: 'Changelog'
		}
	},

	_event_handlers: {
		selectVersion: '_selectVersion'
	},

	_request: null,

	VERSIONS_DIR: 'versions/',

	init: function(config, widget, parent_view, template, properties) {

		this._properties.versions = Examples.makeLive(LavaVersions);
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_onRequestSuccess: function(html, target) {

		target.set('is_loading', false);
		this._request = null;
		target.set('is_loaded', true);
		target.set('html', html);

		this._showTarget(target);

	},

	_onRequestFailure: function(example) {

		example.set('is_loading', false);
		this._request = null;

	},

	_selectVersion: function(dom_event_name, dom_event, view, template_arguments) {

		var target = template_arguments[0];

		if (this._request == null) {

			if (target.get('is_loaded')) {

				this._showTarget(target);

			} else {

				this._loadTarget(target);

			}

		}

	},

	showInitialVersion: function(name) {

		var version = null;

		Firestorm.Element.removeClass(Firestorm.getElementById('initial_loading_indicator'), 'hidden');

		if (this._request != null) Lava.t();

		this._properties.versions.each(function(value){
			if (value.get('name') == name) {
				version = value;
				return false;
			}
		});

		if (version) {
			if (version.get('is_loaded')) Lava.t();
			this._loadTarget(version);
		} else {
			window.alert('Page not found: ' + name);
		}

	},

	_showTarget: function(target) {

		var example_content_container = Firestorm.getElementById('version_content_container');

		if (this._properties.selected_version != target) {

			Firestorm.Element.setProperty(example_content_container, 'html', target.get('html'));
			this._set('selected_version', target);
			target.set('is_selected', true);
			Lava.refreshViews();

		}

	},

	_loadTarget: function(target) {

		var self = this;

		target.set('is_loading', true);

		this._request = new SafeRequest({
			url: this.VERSIONS_DIR + target.get('name') + '.html',
			method: 'GET',
			onSuccess: function(text) {
				self._onRequestSuccess(text, target);
			},
			onFailure: function() {
				self._onRequestFailure(target);
			}
		});

		this._request.send();

	}

});