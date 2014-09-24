({
	tabs: [
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n</pre><pre class=\"lava-code-content hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.TreeExample'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lava.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'tree_example'</span>,\r\n\r\n\t_properties: {\r\n\t\trecords: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\texpand_collapse: <span class=\"hljs-string\">'_toggleTree'</span>\r\n\t},\r\n\r\n\t_toggleTree: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> action = template_arguments[<span class=\"hljs-number\">1</span>] ? <span class=\"hljs-string\">'expandAll'</span> : <span class=\"hljs-string\">'collapseAll'</span>;\r\n\t\tLava.view_manager.getViewById(template_arguments[<span class=\"hljs-number\">0</span>])[action]();\r\n\r\n\t}\r\n\r\n});</pre></div></div>"
		},
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n36\r\n37\r\n38\r\n39\r\n40\r\n41\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"TreeExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n    Left:\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_left', true)\"</span>&gt;</span>Expand<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_left', false)\"</span>&gt;</span>Collapse<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    Right:\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_right', true)\"</span>&gt;</span>Expand<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_right', false)\"</span>&gt;</span>Collapse<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"clearfix\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n\r\n    {* left tree is a standard widget without modifications *}\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"margin-right: 10px\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"tree-example-container\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"FolderTree\"</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"tree_left\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"options\"</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"application/json\"</span>&gt;</span><span class=\"javascript\">\r\n          {use_meta_storage: <span class=\"hljs-literal\">true</span>}\r\n        </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"tree-example-container\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"FolderTree\"</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"tree_right\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">edit_template</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"node_children\"</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">task</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"known\"</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"replace_config_option\"</span> <span class=\"hljs-attribute\">node_type</span>=<span class=\"hljs-value\">\"View\"</span> <span class=\"hljs-attribute\">condition</span>=<span class=\"hljs-value\">\"node.refresher\"</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">path</span>=<span class=\"hljs-value\">\"refresher.class\"</span>&gt;</span>\"Standard\"<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">task</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">edit_template</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"options\"</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"application/json\"</span>&gt;</span><span class=\"javascript\">\r\n          {use_meta_storage: <span class=\"hljs-literal\">true</span>}\r\n        </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"clearfix\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></pre><div class=\"lava-code-overlay\"><div style=\"margin-top: 522px\" class=\"lava-code-overlay-line\"></div></div><div class=\"lava-code-tooltips\"><div style=\"margin-top: 522px\" data-tooltip=\"Change refresher to 'Standard' - without animation support\"></div></div></div></div>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.TreeExample',\r\n/** @extends {Lava.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'tree_example',\r\n\r\n\t_properties: {\r\n\t\trecords: null\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\texpand_collapse: '_toggleTree'\r\n\t},\r\n\r\n\t_toggleTree: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tvar action = template_arguments[1] ? 'expandAll' : 'collapseAll';\r\n\t\tLava.view_manager.getViewById(template_arguments[0])[action]();\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Full-functional tree usage example:</p>\r\n<ul>\r\n\t<li>data is loaded from a Module as Records</li>\r\n\t<li>both trees are bound to the same data</li>\r\n\t<li>internally widget uses MetaStorage class - this allows trees to expand nodes independently from each other.\r\n\t\tThis also means, that nodes lose their expanded state, when the tree is destroyed.</li>\r\n</ul>\r\n<p>\r\n\tNote: the right tree has animation disabled via template redefinition.\r\n\tThere is another way to disable animation dynamically - via refresher API (see CollapsiblePanelExt widget for an example)\r\n</p>\r\n<p>See the widgets/Tree.class.js for the class source and standard widget templates for the template.</p>",
		{
			template: [
				"\r\n\t\tLeft:\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "button",
						static_classes: [
							"btn",
							"btn-primary"
						],
						static_properties: {type: "button"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree_example",
								name: "expand_collapse",
								arguments: [
									{
										type: 1,
										data: "tree_left"
									},
									{
										type: 1,
										data: true
									}
								]
							}]
						}
					},
					template: ["Expand"]
				},
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "button",
						static_classes: [
							"btn",
							"btn-primary"
						],
						static_properties: {type: "button"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree_example",
								name: "expand_collapse",
								arguments: [
									{
										type: 1,
										data: "tree_left"
									},
									{
										type: 1,
										data: false
									}
								]
							}]
						}
					},
					template: ["Collapse"]
				},
				"\r\n\t\tRight:\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "button",
						static_classes: [
							"btn",
							"btn-primary"
						],
						static_properties: {type: "button"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree_example",
								name: "expand_collapse",
								arguments: [
									{
										type: 1,
										data: "tree_right"
									},
									{
										type: 1,
										data: true
									}
								]
							}]
						}
					},
					template: ["Expand"]
				},
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "button",
						static_classes: [
							"btn",
							"btn-primary"
						],
						static_properties: {type: "button"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree_example",
								name: "expand_collapse",
								arguments: [
									{
										type: 1,
										data: "tree_right"
									},
									{
										type: 1,
										data: false
									}
								]
							}]
						}
					},
					template: ["Collapse"]
				},
				"\r\n\t\t<div class=\"clearfix\"></div>\r\n\r\n\t\t\r\n\t\t<div style=\"margin-right: 10px\" class=\"tree-example-container\">\r\n\t\t\t",
				{
					"extends": "FolderTree",
					assigns: {
						records: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Id",
								locator: "ExamplesApp",
								tail: ["tree_records"]
							}]
						}
					},
					options: {use_meta_storage: true},
					id: "tree_left",
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Standard",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\r\n\t\t<div class=\"tree-example-container\">\r\n\t\t\t",
				{
					"extends": "FolderTree",
					assigns: {
						records: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Id",
								locator: "ExamplesApp",
								tail: ["tree_records"]
							}]
						}
					},
					includes: {
						node_children: [
							"\r\n\t\t",
							{
								type: "view",
								"class": "If",
								argument: {
									evaluator: function() {
return (this._binds[0].getValue() && this._binds[1].getValue());
},
									binds: [
										{
											property_name: "node",
											tail: [
												"children",
												"length"
											]
										},
										{
											locator_type: "Name",
											locator: "tree",
											isDynamic: true,
											property_name: "is_expanded"
										}
									]
								},
								container: {
									"class": "Emulated",
									options: {appender: "AfterPrevious"}
								},
								refresher: {"class": "Standard"},
								assigns: {
									pad: {
										evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? this._binds[2].getValue() + '<div class="lava-tree-pad"></div>' : this._binds[3].getValue() + '<div class="lava-tree-pad-line"></div>');
},
										binds: [
											{property_name: "foreach_index"},
											{property_name: "count"},
											{property_name: "pad"},
											{property_name: "pad"}
										]
									},
									level: {
										evaluator: function() {
return (this._binds[0].getValue() + 1);
},
										binds: [{
											locator_type: "Label",
											locator: "parent",
											property_name: "level"
										}]
									}
								},
								template: [
									"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
									{
										type: "view",
										"class": "Foreach",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue());
},
											flags: {isScopeEval: true},
											binds: [{
												property_name: "node",
												tail: ["children"]
											}]
										},
										as: "node",
										template: [
											"\r\n\t\t\t\t\t",
											{
												locator_type: "Name",
												locator: "tree",
												name: "node",
												type: "include"
											},
											"\r\n\t\t\t\t"
										],
										container: {
											"class": "Element",
											tag_name: "div",
											static_classes: ["lava-tree-container"]
										}
									},
									"\r\n\t\t"
								]
							},
							"\r\n\t"
						]
					},
					options: {use_meta_storage: true},
					id: "tree_right",
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Standard",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"clearfix\"></div>\r\n\t"
			],
			"extends": "Example",
			real_class: "TreeExample",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Standard",
			type: "widget"
		}
	]
})