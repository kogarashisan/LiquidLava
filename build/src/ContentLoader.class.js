
Lava.define(
'Lava.widget.ContentLoader',
{

	Extends: 'Lava.widget.Standard',

	name: 'page',

	_properties: {
		is_loading: false
	},

	_event_handlers: {
		selectItem: '_selectItem'
	},

	_request: null,

	_loadItemByHash: function(hash) {

		var path = hash.substr(1),
			item = this._getItemByHash(path);

		if (item) {
			this._loadItem(item);
		} else {
			window.alert('Page not found: ' + path);
		}

	},

	_exec: function(script_src) {

		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = script_src;
		document.head.appendChild(script);

	},

	_selectItem: function(dom_event_name, dom_event, view, template_arguments) {

		var item = template_arguments[0];

		if (this._request == null) {

			if (item.get('is_loaded')) {

				this._showItem(item);

			} else {

				this._loadItem(item);

			}

		}

	},

	_loadItem: function(item) {

		var self = this;
		this.set('is_loading', true);

		this._request = new SafeRequest({
			url: this._getFilePath(item),
			method: 'GET',
			onSuccess: function(text) {
				self._onRequestSuccess(text, item);
			},
			onFailure: function() {
				self._onRequestFailure(item);
			}
		});

		this._request.send();
		Lava.refreshViews();

	},

	_onRequestSuccess: function(text, item) {

		item.set('is_loaded', true);
		this.set('is_loading', false);
		this._request = null;

		this._onItemLoaded(text, item);
		this._showItem(item);

	},

	_onRequestFailure: function(item) {

		this.set('is_loading', false);
		this._request = null;
		Lava.refreshViews();

	},

	_getFilePath: function(item) {

		Lava.t('Abstract function call');

	},

	_getItemByHash: function(path) {

		Lava.t('Abstract function call');

	},

	_onItemLoaded: function(text, item) {

		Lava.t('Abstract function call');

	},

	_showItem: function(item) {

		Lava.t('Abstract function call');

	}

});