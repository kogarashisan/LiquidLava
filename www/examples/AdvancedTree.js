var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.TreeExample'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lavadoc.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'tree_example'</span>,\r\n\r\n\t_properties: {\r\n\t\trecords: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\texpand_collapse: <span class=\"hljs-string\">'_toggleTree'</span>\r\n\t},\r\n\r\n\t_toggleTree: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> action = template_arguments[<span class=\"hljs-number\">1</span>] ? <span class=\"hljs-string\">'expandAll'</span> : <span class=\"hljs-string\">'collapseAll'</span>;\r\n\t\tLava.view_manager.getViewById(template_arguments[<span class=\"hljs-number\">0</span>])[action]();\r\n\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"TreeExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n    Left:\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_left', true)\"</span>&gt;</span>Expand<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_left', false)\"</span>&gt;</span>Collapse<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    Right:\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_right', true)\"</span>&gt;</span>Expand<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n      <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_example.expand_collapse('tree_right', false)\"</span>&gt;</span>Collapse<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"clearfix\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n\r\n    <div class=\"lava-highlight\">{* left tree is a standard widget *}</div>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"margin-right: 10px\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"tree-example-container\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Tree\"</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"tree_left\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n\r\n    <div class=\"lava-highlight\">{* copy of a parent's include with changed refresher *}</div>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"tree-example-container\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Tree\"</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"tree_right\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"include\"</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"node_children\"</span>&gt;</span>\r\n          {$if(node.children.length &amp;&amp; $tree.meta_storage[node.guid].is_expanded)}\r\n            <div data-tooltip=\"'Default' refresher has no animation support\" class=\"lava-highlight\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:refresher</span>&gt;</span>{class: 'Default'}<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:refresher</span>&gt;</span></div>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:container_config</span>&gt;</span>\r\n              {\r\n                class: \"Emulated\",\r\n                options: {\r\n                  placement: \"after-previous\"\r\n                }\r\n              }\r\n            <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:container_config</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"pad\"</span>&gt;</span>{literal:}\r\n                (foreach_index == count - 1)\r\n                  ? pad + '<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-pad\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>'\r\n                  : pad + '<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-pad-line\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>'\r\n              {:literal}<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"level\"</span>&gt;</span>@parent-&gt;level + 1<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"container\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-container\"</span>&gt;</span>\r\n              {#foreach(node.children) as=node}\r\n                {&gt;$tree.node}\r\n              {/foreach}\r\n            <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n          {/if}\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"clearfix\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.TreeExample',\r\n/** @extends {Lavadoc.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'tree_example',\r\n\r\n\t_properties: {\r\n\t\trecords: null\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\texpand_collapse: '_toggleTree'\r\n\t},\r\n\r\n\t_toggleTree: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tvar action = template_arguments[1] ? 'expandAll' : 'collapseAll';\r\n\t\tLava.view_manager.getViewById(template_arguments[0])[action]();\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Full-functional tree usage example:</p>\r\n<ul>\r\n\t<li>data is loaded from a Module as Records</li>\r\n\t<li>both trees are bound to the same data</li>\r\n\t<li>internally widget uses MetaStorage class - this allows trees to expand nodes independently from each other.\r\n\t\tThis also means, that nodes lose their expanded state, when the tree is destroyed.</li>\r\n</ul>\r\n<p>\r\n\tNote: the right tree has animation disabled via template redefinition.\r\n\tThere is another way to disable animation dynamically - via refresher API (see CollapsiblePanelExt widget for an example)\r\n</p>\r\n<p>See the widgets/Tree.class.js for the class source and standard widget templates for the template.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
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
					"extends": "Tree",
					id: "tree_left",
					assigns: {
						records: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {
								hasModifiers: false,
								hasActiveModifiers: false,
								isScopeEval: true,
								isStatic: false,
								isLiteral: false,
								isNumber: false,
								isString: false
							},
							binds: [{
								locator_type: "Id",
								locator: "ExamplesApp",
								tail: ["tree_records"]
							}],
							modifiers: [],
							active_modifiers: []
						}
					},
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Default",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\r\n\t\t\r\n\t\t<div class=\"tree-example-container\">\r\n\t\t\t",
				{
					includes: {
						node_children: [
							"\r\n\t\t\t\t\t",
							{
								type: "view",
								"class": "If",
								argument: {
									evaluator: function() {
return (this._binds[0].getValue() && this._binds[1].getValue());
},
									flags: {
										hasModifiers: false,
										hasActiveModifiers: false,
										isScopeEval: false,
										isStatic: false,
										isLiteral: false,
										isNumber: false,
										isString: false
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
											tail: [
												"meta_storage",
												{
													property_name: "node",
													tail: ["guid"]
												},
												"is_expanded"
											]
										}
									],
									modifiers: [],
									active_modifiers: []
								},
								container: {
									"class": "Emulated",
									options: {placement: "after-previous"}
								},
								refresher: {"class": "Default"},
								assigns: {
									pad: {
										evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? this._binds[2].getValue() + '<div class="lava-tree-pad"></div>' : this._binds[3].getValue() + '<div class="lava-tree-pad-line"></div>');
},
										flags: {
											hasModifiers: false,
											hasActiveModifiers: false,
											isScopeEval: false,
											isStatic: false,
											isLiteral: false,
											isNumber: false,
											isString: false
										},
										binds: [
											{property_name: "foreach_index"},
											{property_name: "count"},
											{property_name: "pad"},
											{property_name: "pad"}
										],
										modifiers: [],
										active_modifiers: []
									},
									level: {
										evaluator: function() {
return (this._binds[0].getValue() + 1);
},
										flags: {
											hasModifiers: false,
											hasActiveModifiers: false,
											isScopeEval: false,
											isStatic: false,
											isLiteral: false,
											isNumber: false,
											isString: false
										},
										binds: [{
											locator_type: "Label",
											locator: "parent",
											property_name: "level"
										}],
										modifiers: [],
										active_modifiers: []
									}
								},
								template: [
									"\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t",
									{
										type: "view",
										"class": "Foreach",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue());
},
											flags: {
												hasModifiers: false,
												hasActiveModifiers: false,
												isScopeEval: true,
												isStatic: false,
												isLiteral: false,
												isNumber: false,
												isString: false
											},
											binds: [{
												property_name: "node",
												tail: ["children"]
											}],
											modifiers: [],
											active_modifiers: []
										},
										as: "node",
										template: [
											"\r\n\t\t\t\t\t\t\t\t",
											{
												locator_type: "Name",
												locator: "tree",
												name: "node",
												type: "include"
											},
											"\r\n\t\t\t\t\t\t\t"
										],
										container: {
											"class": "Element",
											tag_name: "div",
											static_classes: ["lava-tree-container"]
										}
									},
									"\r\n\t\t\t\t\t"
								]
							},
							"\r\n\t\t\t\t"
						]
					},
					"extends": "Tree",
					id: "tree_right",
					assigns: {
						records: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {
								hasModifiers: false,
								hasActiveModifiers: false,
								isScopeEval: true,
								isStatic: false,
								isLiteral: false,
								isNumber: false,
								isString: false
							},
							binds: [{
								locator_type: "Id",
								locator: "ExamplesApp",
								tail: ["tree_records"]
							}],
							modifiers: [],
							active_modifiers: []
						}
					},
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Default",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"clearfix\"></div>\r\n\t"
			],
			real_class: "TreeExample",
			"extends": "Example"
		}
	]
}