({
	tabs: [
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n36\r\n37\r\n38\r\n39\r\n40\r\n41\r\n42\r\n43\r\n44\r\n45\r\n46\r\n47\r\n48\r\n49\r\n50\r\n51\r\n52\r\n53\r\n54\r\n55\r\n56\r\n57\r\n58\r\n59\r\n60\r\n61\r\n62\r\n63\r\n64\r\n65\r\n66\r\n67\r\n68\r\n69\r\n70\r\n71\r\n72\r\n73\r\n74\r\n75\r\n76\r\n77\r\n78\r\n79\r\n80\r\n81\r\n82\r\n83\r\n84\r\n85\r\n86\r\n87\r\n88\r\n89\r\n90\r\n91\r\n92\r\n93\r\n94\r\n95\r\n96\r\n97\r\n98\r\n</pre><pre class=\"lava-code-content hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.CheckTreeExample'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lava.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'tree_example'</span>,\r\n\r\n\t_properties: {\r\n\t\trecords: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_role_handlers: {\r\n\t\t_checkbox: <span class=\"hljs-string\">'_handleCheckbox'</span>\r\n\t},\r\n\r\n\t_checkboxes: {},\r\n\r\n\t_handleCheckbox: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-comment\">// important: in this example we do not need to listen for views destruction,</span>\r\n\t\t<span class=\"hljs-comment\">// but in real application - you will probably want to.</span>\r\n\t\tview.on(<span class=\"hljs-string\">'checked_changed'</span>, <span class=\"hljs-keyword\">this</span>._onCheckedChanged, <span class=\"hljs-keyword\">this</span>);\r\n\r\n\t},\r\n\r\n\t_toggleTree: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(node, is_checked)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> children = node.get(<span class=\"hljs-string\">'children'</span>),\r\n\t\t\ti = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild;\r\n\r\n\t\t<span class=\"hljs-keyword\">for</span> (; i &lt; count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tchild.set(<span class=\"hljs-string\">'is_checked'</span>, is_checked);\r\n\t\t\tchild.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'type'</span>) == <span class=\"hljs-string\">'folder'</span>) {\r\n\t\t\t\t<span class=\"hljs-keyword\">this</span>._toggleTree(child, is_checked);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_fixState: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(node)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> children = node.get(<span class=\"hljs-string\">'children'</span>),\r\n\t\t\ti = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild,\r\n\t\t\tcount_checked = <span class=\"hljs-number\">0</span>,\r\n\t\t\tcount_indeterminate = <span class=\"hljs-number\">0</span>;\r\n\r\n\t\t<span class=\"hljs-keyword\">for</span> (; i &lt; count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'is_checked'</span>)) {\r\n\t\t\t\tcount_checked++;\r\n\t\t\t}\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (child.get(<span class=\"hljs-string\">'is_checked'</span>)) {\r\n\t\t\t\tcount_indeterminate++;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (count_checked == count) {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, <span class=\"hljs-literal\">true</span>);\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t} <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (count_checked == <span class=\"hljs-number\">0</span> &amp;&amp; count_indeterminate == <span class=\"hljs-number\">0</span>) {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\t\t} <span class=\"hljs-keyword\">else</span> {\r\n\t\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">true</span>);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCheckedChanged: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(checkbox)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> node = checkbox.locateViewWithProperty(<span class=\"hljs-string\">'node'</span>).get(<span class=\"hljs-string\">'node'</span>),\r\n\t\t\tis_checked = checkbox.get(<span class=\"hljs-string\">'is_checked'</span>),\r\n\t\t\tparent = node.get(<span class=\"hljs-string\">'parent'</span>);\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (node.get(<span class=\"hljs-string\">'type'</span>) == <span class=\"hljs-string\">'folder'</span>) {\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._toggleTree(node, is_checked);\r\n\t\t}\r\n\t\tnode.set(<span class=\"hljs-string\">'is_checked'</span>, is_checked);\r\n\t\tnode.set(<span class=\"hljs-string\">'is_indeterminate'</span>, <span class=\"hljs-literal\">false</span>);\r\n\r\n\t\t<span class=\"hljs-keyword\">while</span> (parent) {\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._fixState(parent);\r\n\t\t\tparent = parent.get(<span class=\"hljs-string\">'parent'</span>);\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n});</pre></div></div>"
		},
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"CheckTreeExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"position: relative;height: 320px;width: 350px;overflow: auto;border: 1px solid gray;\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"FolderTree\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>$tree_example.records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">edit_template</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"node_body\"</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">task</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"traverse\"</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"handler\"</span>&gt;</span><span class=\"javascript\">\r\n              ({\r\n                <span class=\"hljs-built_in\">arguments</span>: <span class=\"hljs-literal\">null</span>, \r\n                visitView: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(walker, node)</span> {</span>\r\n                  node.template = <span class=\"hljs-keyword\">this</span>.arguments[<span class=\"hljs-number\">0</span>].concat(node.template); \r\n                  walker.interrupt();\r\n                }\r\n              })\r\n            </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">arguments</span>&gt;</span>\r\n              <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span>&gt;</span>\r\n                <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">checkbox</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"float: right\"</span>&gt;</span>\r\n                  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"is_checked\"</span>&gt;</span>node.is_checked<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n                  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"is_indeterminate\"</span>&gt;</span>node.is_indeterminate<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:assign</span>&gt;</span>\r\n                  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:roles</span>&gt;</span>$tree_example._checkbox<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:roles</span>&gt;</span>\r\n                <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">checkbox</span>&gt;</span>\r\n              <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n            <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">arguments</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">task</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">edit_template</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"options\"</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"application/json\"</span>&gt;</span><span class=\"javascript\">\r\n          {use_meta_storage: <span class=\"hljs-literal\">true</span>}\r\n        </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></pre><div class=\"lava-code-overlay\"><div style=\"margin-top: 162px\" class=\"lava-code-overlay-line\"></div><div style=\"margin-top: 18px\" class=\"lava-code-overlay-line\"></div></div><div class=\"lava-code-tooltips\"><div style=\"margin-top: 162px\" data-tooltip=\"Will be assigned by framework, see the &amp;lt;arguments&amp;gt; below\"></div><div style=\"margin-top: 18px\" data-tooltip=\"Prepend template with checkbox to the first view's content\"></div></div></div></div>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.CheckTreeExample',\r\n/** @extends {Lava.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'tree_example',\r\n\r\n\t_properties: {\r\n\t\trecords: null\r\n\t},\r\n\r\n\t_role_handlers: {\r\n\t\t_checkbox: '_handleCheckbox'\r\n\t},\r\n\r\n\t_checkboxes: {},\r\n\r\n\t_handleCheckbox: function(view, template_arguments) {\r\n\r\n\t\t// important: in this example we do not need to listen for views destruction,\r\n\t\t// but in real application - you will probably want to.\r\n\t\tview.on('checked_changed', this._onCheckedChanged, this);\r\n\r\n\t},\r\n\r\n\t_toggleTree: function(node, is_checked) {\r\n\r\n\t\tvar children = node.get('children'),\r\n\t\t\ti = 0,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild;\r\n\r\n\t\tfor (; i < count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tchild.set('is_checked', is_checked);\r\n\t\t\tchild.set('is_indeterminate', false);\r\n\t\t\tif (child.get('type') == 'folder') {\r\n\t\t\t\tthis._toggleTree(child, is_checked);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_fixState: function(node) {\r\n\r\n\t\tvar children = node.get('children'),\r\n\t\t\ti = 0,\r\n\t\t\tcount = children.getCount(),\r\n\t\t\tchild,\r\n\t\t\tcount_checked = 0,\r\n\t\t\tcount_indeterminate = 0;\r\n\r\n\t\tfor (; i < count; i++) {\r\n\t\t\tchild = children.getValueAt(i);\r\n\t\t\tif (child.get('is_checked')) {\r\n\t\t\t\tcount_checked++;\r\n\t\t\t}\r\n\t\t\tif (child.get('is_checked')) {\r\n\t\t\t\tcount_indeterminate++;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (count_checked == count) {\r\n\t\t\tnode.set('is_checked', true);\r\n\t\t\tnode.set('is_indeterminate', false);\r\n\t\t} else if (count_checked == 0 && count_indeterminate == 0) {\r\n\t\t\tnode.set('is_checked', false);\r\n\t\t\tnode.set('is_indeterminate', false);\r\n\t\t} else {\r\n\t\t\tnode.set('is_indeterminate', true);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCheckedChanged: function(checkbox) {\r\n\r\n\t\tvar node = checkbox.locateViewWithProperty('node').get('node'),\r\n\t\t\tis_checked = checkbox.get('is_checked'),\r\n\t\t\tparent = node.get('parent');\r\n\r\n\t\tif (node.get('type') == 'folder') {\r\n\t\t\tthis._toggleTree(node, is_checked);\r\n\t\t}\r\n\t\tnode.set('is_checked', is_checked);\r\n\t\tnode.set('is_indeterminate', false);\r\n\r\n\t\twhile (parent) {\r\n\r\n\t\t\tthis._fixState(parent);\r\n\t\t\tparent = parent.get('parent');\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Tree with cascading checkboxes. Indeterminate state is also supported.</p>\r\n<p>Notes:</p>\r\n<ul>\r\n\t<li>checkbox is bound to a native record's field, \r\n\t\tso they restore their state when you switch to other examples and back</li>\r\n\t<li>checkbox's bindings are unidirectional</li>\r\n\t<li>the state of checkbox hierarchy is not validated in the data layer \r\n\t\t(such validation would be extremely hard to implement and maintain). \r\n\t\tInstead, the touched part of hierarchy is recalculated in controller.</li>\r\n</ul>",
		{
			template: [
				"\r\n\t\t<div style=\"position: relative;height: 320px;width: 350px;overflow: auto;border: 1px solid gray;\">\r\n\t\t\t",
				{
					"extends": "FolderTree",
					assigns: {
						records: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "tree_example",
								tail: ["records"]
							}]
						}
					},
					includes: {
						node_body: [
							"\r\n\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "div",
									static_classes: ["lava-tree-node"],
									static_properties: {unselectable: "on"},
									class_bindings: {
										"0": {
											evaluator: function() {
return ('level-' + this._binds[0].getValue());
},
											binds: [{property_name: "level"}]
										}
									}
								},
								template: [
									"\r\n\t\t\t\t\t\t\t\t",
									{
										type: "widget",
										"class": "Lava.WidgetConfigExtensionGateway",
										extender_type: "Standard",
										"extends": "CheckBox",
										assigns: {
											is_checked: {
												evaluator: function() {
return (this._binds[0].getValue());
},
												flags: {isScopeEval: true},
												binds: [{
													property_name: "node",
													tail: ["is_checked"]
												}]
											},
											is_indeterminate: {
												evaluator: function() {
return (this._binds[0].getValue());
},
												flags: {isScopeEval: true},
												binds: [{
													property_name: "node",
													tail: ["is_indeterminate"]
												}]
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
									"\r\n\t\t\t\t\t\t\t",
									"\r\n\t\t\t",
									{
										type: "view",
										"class": "Expression",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue());
},
											flags: {isScopeEval: true},
											binds: [{property_name: "pad"}]
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
												"0": {
													evaluator: function() {
return ('lava-tree' + ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? '-bottom' : '-middle') + (this._binds[2].getValue() ? (this._binds[3].getValue() ? '-expanded' : '-collapsed') : '-node'));
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
												}
											}
										}
									},
									"\r\n\t\t\t",
									{
										locator_type: "Name",
										locator: "tree",
										name: "icon",
										type: "include"
									},
									"\r\n\t\t\t",
									{
										locator_type: "Name",
										locator: "tree",
										name: "node_title",
										type: "include"
									},
									"\r\n\t\t"
								]
							},
							"\r\n\t"
						]
					},
					options: {use_meta_storage: true},
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Standard",
					type: "widget"
				},
				"\r\n\t\t</div>\r\n\t"
			],
			"extends": "Example",
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
			real_class: "CheckTreeExample",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Standard",
			type: "widget"
		}
	]
})