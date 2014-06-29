var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.TreeView1'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lavadoc.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'tree_view'</span>,\r\n\r\n\t_event_handlers: {\r\n\t\tnode_click: <span class=\"hljs-string\">'_onNodeClick'</span>\r\n\t},\r\n\r\n\t_onNodeClick: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> node = template_arguments[<span class=\"hljs-number\">0</span>];\r\n\t\t<div data-tooltip=\"The only significant line of code\" class=\"lava-highlight\"></span>node.set(<span class=\"hljs-string\">'is_expanded'</span>, !node.get(<span class=\"hljs-string\">'is_expanded'</span>));<span class=\"hljs-comment\"></div>\r\n\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"TreeView1\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">view</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"border: 1px solid black\"</span>&gt;</span>\r\n        {$foreach($tree_view.tree) as=node}\r\n          {&gt;$tree_view.node}\r\n        {/foreach}\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">view</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"include\"</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"node\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"container\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"border: 1px solid black\"</span>\r\n        <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree_view.node_click(node)\"</span>\r\n        <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:background</span>=<span class=\"hljs-value\">\"(node.children.length) ? 'yellow' : ''\"</span>&gt;</span>\r\n        {#&gt;node.title}\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {$if(node.children.length &amp;&amp; node.is_expanded)}\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"container\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"padding-left: 2em\"</span>&gt;</span>\r\n          {#foreach(node.children) as=node}\r\n            {&gt;$tree_view.node}\r\n          {/foreach}\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {/if}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"tree\"</span>&gt;</span>#ExamplesApp.live_example_tree<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span>\r\n</code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.TreeView1',\r\n/** @extends {Lavadoc.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'tree_view',\r\n\r\n\t_event_handlers: {\r\n\t\tnode_click: '_onNodeClick'\r\n\t},\r\n\r\n\t_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tvar node = template_arguments[0];\r\n\t\t/*H:The only significant line of code*/node.set('is_expanded', !node.get('is_expanded'));/*:H*/\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>This is the simplest HTML tree, built with the Framework.</p>\r\n<p>The nodes, which have children, are highlighted in yellow by the widget's template.</p>\r\n<p></p>\r\n<p>The tree takes data from the ExamplesPage widget (see ExamplesPage::init for details).\r\n\tThe <i>is_expanded</i> property is stored in the data record, so if several trees are bound to the same data - they share the expanded nodes.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
			"extends": "Example",
			includes: {
				content: [
					"\r\n\t",
					{
						type: "widget",
						"class": "Lava.WidgetConfigExtensionGateway",
						extender_type: "Default",
						template: [
							"\r\n\t\t\t\t",
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
										locator_type: "Name",
										locator: "tree_view",
										tail: ["tree"]
									}],
									modifiers: [],
									active_modifiers: []
								},
								container: {"class": "Morph"},
								as: "node",
								template: [
									"\r\n\t\t\t\t\t",
									{
										locator_type: "Name",
										locator: "tree_view",
										name: "node",
										type: "include"
									},
									"\r\n\t\t\t\t"
								]
							},
							"\r\n\t\t\t"
						],
						container: {
							"class": "Element",
							tag_name: "div",
							static_styles: {border: "1px solid black"}
						},
						includes: {
							node: [
								"\r\n\t\t\t",
								{
									type: "view",
									"class": "Expression",
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
											tail: ["title"]
										}],
										modifiers: [],
										active_modifiers: []
									},
									container: {
										"class": "Element",
										tag_name: "div",
										static_styles: {border: "1px solid black"},
										events: {
											click: [{
												locator_type: "Name",
												locator: "tree_view",
												name: "node_click",
												arguments: [{
													type: 2,
													data: {property_name: "node"}
												}]
											}]
										},
										style_bindings: {
											background: {
												evaluator: function() {
return ((this._binds[0].getValue()) ? 'yellow' : '');
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
													property_name: "node",
													tail: [
														"children",
														"length"
													]
												}],
												modifiers: [],
												active_modifiers: []
											}
										}
									}
								},
								"\r\n\t\t\t",
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
												property_name: "node",
												tail: ["is_expanded"]
											}
										],
										modifiers: [],
										active_modifiers: []
									},
									container: {"class": "Morph"},
									template: [
										"\r\n\t\t\t\t",
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
												"\r\n\t\t\t\t\t\t",
												{
													locator_type: "Name",
													locator: "tree_view",
													name: "node",
													type: "include"
												},
												"\r\n\t\t\t\t\t"
											],
											container: {
												"class": "Element",
												tag_name: "div",
												static_styles: {"padding-left": "2em"}
											}
										},
										"\r\n\t\t\t"
									]
								},
								"\r\n\t\t"
							]
						},
						real_class: "TreeView1",
						assigns: {
							tree: {
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
									tail: ["live_example_tree"]
								}],
								modifiers: [],
								active_modifiers: []
							}
						}
					},
					"\r\n"
				]
			}
		},
		"\r\n"
	]
}