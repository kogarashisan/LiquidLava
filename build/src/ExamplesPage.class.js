
Lava.define(
'Lava.widget.ExamplesPage',
{

	Extends: 'Lava.widget.ContentLoader',

	_properties: {
		examples: null,
		all_tree_records: null,
		tree_records: null,
		selected_example: {
			title: 'Examples'
		},
		live_example_tree: null
	},

	_active_example_widget: null,

	EXAMPLES_DIR: 'examples/',

	init: function(config, widget, parent_view, template, properties) {

		this._properties.examples = Examples.makeLive(LavaExamples);

		var demo_module = Lava.app.getModule('DemoTree'),
			hash = window.location.hash;

		// clone cause loading modifies the data
		demo_module.loadRecords(ExampleData.example_tree);
		this._properties.all_tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records.filter(function(record) {
			return !record.get('parent')
		});

		// create a global data object to avoid need for destroy() and garbage collection issues
		this.set('live_example_tree', Examples.makeLive(ExampleData.example_tree));

		this.ContentLoader$init(config, widget, parent_view, template, properties);

		if (hash) {

			this._loadItemByHash(hash);

		}

	},

	_onItemLoaded: function(package_json, example) {

		var package_content = eval(package_json),
			widget_config;

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

	},

	_getItemByHash: function(path) {

		var example = null;

		this._properties.examples.each(function(value){
			if (value.get('name') == path) {
				example = value;
				return false;
			}
		});

		return example;

	},

	_getTabsWidget: function() {
		return Lava.view_manager.getViewById('example_tabs');
	},

	_addTab: function(title, text) {

		var tabs_widget = this._getTabsWidget();

		tabs_widget.addTab({
			title: [title],
			content: [text]
		});

	},

	_showItem: function(example) {

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

	_getFilePath: function(item) {

		return this.EXAMPLES_DIR + item.get('name') + '.js';

	}

});