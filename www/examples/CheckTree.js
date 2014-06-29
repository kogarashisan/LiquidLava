var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.CheckTreeExample'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lavadoc.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'tree_example'</span>,\r\n\r\n\t_properties: {\r\n\t\trecords: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_role_handlers: {\r\n\t\t_checkbox: <span class=\"hljs-string\">'_handleCheckbox'</span>\r\n\t},\r\n\r\n\t_checkboxes: {},\r\n\r\n\t_handleCheckbox: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-comment\">// important: in this example we do not need to listen for views destruction,</span>\r\n\t\t<span class=\"hljs-comment\">// but in real application - you will probably want to.</span>\r\n\t\tview.on(<span class=\"hljs-string\">'checked_changed'</span>, <span class=\"hljs-keyword\">this</span>._onCheckedChanged, <span class=\"hljs-keyword\">this</span>);\r\n\r\n\t},\r\n\r\n\t_toggleTree: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(node, is_checked)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> children = node.get(<span class=\"hljs-string\">'children'</span>),\r\n\t\t\ti = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild;\r\n\r\n\t\t<span class=\"hljs-keyword\">for</span> (; i &lt; count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tchild.set(<span class=\"hljs-string\">'is_checked'</span>, is_checked);\r\n\t\t\tchild.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'type'</span>) == <span class=\"hljs-string\">'folder'</span>) {\r\n\t\t\t\t<span class=\"hljs-keyword\">this</span>._toggleTree(child, is_checked);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_fixState: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(node)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> children = node.get(<span class=\"hljs-string\">'children'</span>),\r\n\t\t\ti = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild,\r\n\t\t\tcount_checked = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount_indeterminate = <span class=\"hljs-number\">0</span>;\r\n\r\n\t\t<span class=\"hljs-keyword\">for</span> (; i &lt; count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'is_checked'</span>)) {\r\n\t\t\t\tcount_checked++;\r\n\t\t\t}\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'is_checked'</span>)) {\r\n\t\t\t\tcount_indeterminate++;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (count_checked == count) {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, <span class=\"hljs-literal\">true</span>);\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t} <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (count_checked == <span class=\"hljs-number\">0</span> &amp;&amp; count_indeterminate == <span class=\"hljs-number\">0</span>) {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t} <span class=\"hljs-keyword\">else</span> {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">true</span>);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCheckedChanged: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(checkbox)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> node = checkbox.locateViewWithProperty(<span class=\"hljs-string\">'node'</span>).get(<span class=\"hljs-string\">'node'</span>),\r\n\t\t\tis_checked = checkbox.get(<span class=\"hljs-string\">'is_checked'</span>),\r\n\t\t\tparent = node.get(<span class=\"hljs-string\">'parent'</span>);\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (node.get(<span class=\"hljs-string\">'type'</span>) == <span class=\"hljs-string\">'folder'</span>) {\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._toggleTree(node, is_checked);\r\n\t\t}\r\n\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, is_checked);\r\n\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\r\n\t\t<span class=\"hljs-keyword\">while</span> (parent) {\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._fixState(parent);\r\n\t\t\tparent = parent.get(<span class=\"hljs-string\">'parent'</span>);\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"CheckTreeExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"position: relative;height: 320px;width: 350px;overflow: auto;border: 1px solid gray;\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Tree\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>$tree_example.records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"include\"</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"node_body\"</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-node\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"hljs-attribute\">unselectable</span>=<span class=\"hljs-value\">\"on\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:classes</span>=<span class=\"hljs-value\">\"'level-' + level\"</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">checkbox</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"float: right\"</span>&gt;</span>\r\n              <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"is_checked\"</span>&gt;</span>node.is_checked<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n              <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"is_indeterminate\"</span>&gt;</span>node.is_indeterminate<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n              <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:roles</span>&gt;</span>$tree_example._checkbox<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:roles</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">checkbox</span>&gt;</span>\r\n            {#expression(pad) escape_off}{/expression}<div class=\"lava-highlight\">{* remove whitespace\r\n            *}</div><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">i</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n                 <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-expander\"</span>\r\n                 <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$tree.node_click(node)\"</span>\r\n                 <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:classes</span>=<span class=\"hljs-value\">\"'lava-tree'\r\n                + ((foreach_index == @parent-&gt;count - 1) ? '-bottom' : '-middle')\r\n                + ((node.type == 'folder' &amp;&amp; node.children.length)\r\n                  ? (@widget.meta_storage[node.guid].is_expanded ? '-expanded' : '-collapsed')\r\n                  : '-node')\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">i</span>&gt;</span><div class=\"lava-highlight\">{* remove whitespace\r\n            *}</div><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">i</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-tree-icon\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:classes</span>=<span class=\"hljs-value\">\"'icon-' + node.type\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">i</span>&gt;</span>\r\n            {&gt;$tree.node_title}\r\n          <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.CheckTreeExample',\r\n/** @extends {Lavadoc.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'tree_example',\r\n\r\n\t_properties: {\r\n\t\trecords: null\r\n\t},\r\n\r\n\t_role_handlers: {\r\n\t\t_checkbox: '_handleCheckbox'\r\n\t},\r\n\r\n\t_checkboxes: {},\r\n\r\n\t_handleCheckbox: function(view, template_arguments) {\r\n\r\n\t\t// important: in this example we do not need to listen for views destruction,\r\n\t\t// but in real application - you will probably want to.\r\n\t\tview.on('checked_changed', this._onCheckedChanged, this);\r\n\r\n\t},\r\n\r\n\t_toggleTree: function(node, is_checked) {\r\n\r\n\t\tvar children = node.get('children'),\r\n\t\t\ti = 0,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild;\r\n\r\n\t\tfor (; i < count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tchild.set('is_checked', is_checked);\r\n\t\t\tchild.set('is_indeterminate', false);\r\n\t\t\tif (child.get('type') == 'folder') {\r\n\t\t\t\tthis._toggleTree(child, is_checked);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_fixState: function(node) {\r\n\r\n\t\tvar children = node.get('children'),\r\n\t\t\ti = 0,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild,\r\n\t\t\tcount_checked = 0,\r\n\t\t\tcount_indeterminate = 0;\r\n\r\n\t\tfor (; i < count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tif (child.get('is_checked')) {\r\n\t\t\t\tcount_checked++;\r\n\t\t\t}\r\n\t\t\tif (child.get('is_checked')) {\r\n\t\t\t\tcount_indeterminate++;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (count_checked == count) {\r\n\t\t\tnode.set('is_checked', true);\r\n\t\t\tnode.set('is_indeterminate', false);\r\n\t\t} else if (count_checked == 0 && count_indeterminate == 0) {\r\n\t\t\tnode.set('is_checked', false);\r\n\t\t\tnode.set('is_indeterminate', false);\r\n\t\t} else {\r\n\t\t\tnode.set('is_indeterminate', true);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCheckedChanged: function(checkbox) {\r\n\r\n\t\tvar node = checkbox.locateViewWithProperty('node').get('node'),\r\n\t\t\tis_checked = checkbox.get('is_checked'),\r\n\t\t\tparent = node.get('parent');\r\n\r\n\t\tif (node.get('type') == 'folder') {\r\n\t\t\tthis._toggleTree(node, is_checked);\r\n\t\t}\r\n\t\tnode.set('is_checked', is_checked);\r\n\t\tnode.set('is_indeterminate', false);\r\n\r\n\t\twhile (parent) {\r\n\r\n\t\t\tthis._fixState(parent);\r\n\t\t\tparent = parent.get('parent');\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Tree with cascading checkboxes. Indeterminate state is also supported.</p>\r\n<p>Notes:</p>\r\n<ul>\r\n\t<li>checkbox is bound to a native record's field, \r\n\t\tso they restore their state when you switch to other examples and back</li>\r\n\t<li>checkbox's bindings are unidirectional</li>\r\n\t<li>the state of checkbox hierarchy is not validated in the data layer \r\n\t\t(such validation would be extremely hard to implement and maintain). \r\n\t\tInstead, the touched part of hierarchy is recalculated in controller.</li>\r\n</ul>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
			template: [
				"\r\n\t\t<div style=\"position: relative;height: 320px;width: 350px;overflow: auto;border: 1px solid gray;\">\r\n\t\t\t",
				{
					includes: {
						node_body: [
							"\r\n\t\t\t\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "div",
									static_classes: ["lava-tree-node"],
									static_properties: {unselectable: "on"},
									class_bindings: {
										0: {
											evaluator: function() {
return ('level-' + this._binds[0].getValue());
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
											binds: [{property_name: "level"}],
											modifiers: [],
											active_modifiers: []
										}
									}
								},
								template: [
									"\r\n\t\t\t\t\t\t",
									{
										type: "widget",
										"class": "Lava.WidgetConfigExtensionGateway",
										extender_type: "Default",
										"extends": "CheckBox",
										assigns: {
											is_checked: {
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
													tail: ["is_checked"]
												}],
												modifiers: [],
												active_modifiers: []
											},
											is_indeterminate: {
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
													tail: ["is_indeterminate"]
												}],
												modifiers: [],
												active_modifiers: []
											}
										},
										roles: [{
											locator_type: "Name",
											locator: "tree_example",
											name: "_checkbox"
										}],
										resources: {
											"default": {
												CHECKBOX_ELEMENT: {
													type: "container_stack",
													value: [{
														name: "static_styles",
														value: {"float": "right"}
													}]
												}
											}
										}
									},
									"\r\n\t\t\t\t\t\t",
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
											binds: [{property_name: "pad"}],
											modifiers: [],
											active_modifiers: []
										},
										escape_off: true,
										template: []
									},
									{
										type: "view",
										"class": "View",
										container: {
											"class": "Element",
											tag_name: "i",
											static_classes: ["lava-tree-expander"],
											events: {
												click: [{
													locator_type: "Name",
													locator: "tree",
													name: "node_click",
													arguments: [{
														type: 2,
														data: {property_name: "node"}
													}]
												}]
											},
											class_bindings: {
												0: {
													evaluator: function() {
return ('lava-tree' + ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? '-bottom' : '-middle') + ((this._binds[2].getValue() == 'folder' && this._binds[3].getValue()) ? (this._binds[4].getValue() ? '-expanded' : '-collapsed') : '-node'));
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
														{
															locator_type: "Label",
															locator: "parent",
															property_name: "count"
														},
														{
															property_name: "node",
															tail: ["type"]
														},
														{
															property_name: "node",
															tail: [
																"children",
																"length"
															]
														},
														{
															locator_type: "Label",
															locator: "widget",
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
												}
											}
										}
									},
									{
										type: "view",
										"class": "View",
										container: {
											"class": "Element",
											tag_name: "i",
											static_classes: ["lava-tree-icon"],
											class_bindings: {
												0: {
													evaluator: function() {
return ('icon-' + this._binds[0].getValue());
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
														tail: ["type"]
													}],
													modifiers: [],
													active_modifiers: []
												}
											}
										}
									},
									"\r\n\t\t\t\t\t\t",
									{
										locator_type: "Name",
										locator: "tree",
										name: "node_title",
										type: "include"
									},
									"\r\n\t\t\t\t\t"
								]
							},
							"\r\n\t\t\t\t"
						]
					},
					"extends": "Tree",
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
								locator_type: "Name",
								locator: "tree_example",
								tail: ["records"]
							}],
							modifiers: [],
							active_modifiers: []
						}
					},
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Default",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\t"
			],
			real_class: "CheckTreeExample",
			"extends": "Example",
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
			}
		}
	]
}