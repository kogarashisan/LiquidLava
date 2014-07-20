
Lava.define(
'Lava.widget.ExamplesPage',
{

	Extends: 'Lava.widget.Standard',

	name: 'examples_page',

	_properties: {
		examples: null,
		all_tree_records: null,
		tree_records: null,
		selected_example: {
			title: 'Examples'
		}
	},

	_event_handlers: {
		selectExample: '_selectExample'
	},

	_request: null,
	_active_example_widget: null,

	EXAMPLES_DIR: 'examples/',

	init: function(config, widget, parent_view, template, properties) {

		this._properties.examples = Examples.makeLive(LavaExamples);

		var demo_module = Lava.app.getModule('DemoTree');
		// clone cause loading modifies the data
		demo_module.loadRecords(ExampleData.example_tree);
		this._properties.all_tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records.filter(function(record) {
			return !record.get('parent')
		});

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_exec: function(text) {

		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);

	},

	_onRequestSuccess: function(package_json, example) {

		example.set('is_loading', false);
		this._request = null;
		example.set('is_loaded', true);

		var package_content = null,
			widget_config;

		eval(package_json);

		if (package_content['classes']) {
			Browser.exec(package_content['classes']);
			//this._exec(classes);
		}

		example.setProperties(package_content);

		widget_config = {
			type: 'widget',
			is_extended: true,
			template: package_content.template,
			container: {class: 'Morph'}
		};

		example.set('widget_config', widget_config);

		this._showExample(example);

	},

	_onRequestFailure: function(example) {

		example.set('is_loading', false);
		this._request = null;

	},

	_selectExample: function(dom_event_name, dom_event, view, template_arguments) {

		var example = template_arguments[0];

		if (this._request == null) {

			if (example.get('is_loaded')) {

				this._showExample(example);

			} else {

				this._loadExample(example);

			}

		}

	},

	showInitialExample: function(name) {

		var example = null;

		Firestorm.Element.removeClass(Firestorm.getElementById('initial_loading_indicator'), 'hidden');

		if (this._request != null) Lava.t();

		this._properties.examples.each(function(value){
			if (value.get('name') == name) {
				example = value;
				return false;
			}
		});

		if (example) {
			if (example.get('is_loaded')) Lava.t();
			this._loadExample(example);
		} else {
			window.alert('Example not found: ' + name);
		}

	},

	_getTabsWidget: function() {
		return Lava.view_manager.getViewById('example_tabs');
	},

	_addTab: function(title, text) {

		var tabs_widget = this._getTabsWidget();

		tabs_widget.addTab({
			title_template: [title],
			content_template: [text]
		});

	},

	_showExample: function(example) {

		var constructor,
			widget_config,
			example_content_container = Firestorm.getElementById('example_content_container'),
			tabs = example.get('tabs'),
			i = 0,
			count = tabs.length;

		if (this._properties.selected_example != example) {

			if (this._active_example_widget) {

				this._active_example_widget.remove();
				this._active_example_widget.destroy();
				this.get('selected_example').set('is_selected', false);

			} else {

				Firestorm.Element.setProperty(example_content_container, 'html', '');

			}

			this._set('selected_example', example);
			example.set('is_selected', true);

			widget_config = example.get('widget_config');

			constructor = Lava.ClassManager.getConstructor('Lava.widget.Standard');
			this._active_example_widget = new constructor(widget_config);
			//this._active_example_widget = Lava.createWidget('Example', widget_config);
			this._active_example_widget.inject(example_content_container);

			this._getTabsWidget().removeAllTabs();

			for (; i < count; i++) {
				this._addTab(tabs[i].title, tabs[i].content);
			}

			Lava.refreshViews();

		}

	},

	_loadExample: function(example) {

		var self = this;

		example.set('is_loading', true);

		this._request = new SafeRequest({
			url: this.EXAMPLES_DIR + example.get('name') + '.js',
			method: 'GET',
			onSuccess: function(text) {

				self._onRequestSuccess(text, example);

			},
			onFailure: function() {

				self._onRequestFailure(example);

			}
		});

		this._request.send();

	}

});