var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.DemoDraggable'</span>,\r\n<span class=\"hljs-comment\">/**\r\n * @extends {Lava.widget.Standard}\r\n */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'demo_draggable'</span>,\r\n\r\n\t_property_descriptors: {\r\n\t\tx: {type: <span class=\"hljs-string\">'Integer'</span>},\r\n\t\ty: {type: <span class=\"hljs-string\">'Integer'</span>}\r\n\t},\r\n\r\n\t_properties: {\r\n\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\ty: <span class=\"hljs-number\">0</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\tmouse_down: <span class=\"hljs-string\">'onMouseDown'</span>\r\n\t},\r\n\r\n\t_mousemove_listener: <span class=\"hljs-literal\">null</span>,\r\n\t_mouseup_listener: <span class=\"hljs-literal\">null</span>,\r\n\r\n\t_current_coordinates: {\r\n\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\ty: <span class=\"hljs-number\">0</span>\r\n\t},\r\n\r\n\t_start_coordinates: {\r\n\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\ty: <span class=\"hljs-number\">0</span>\r\n\t},\r\n\r\n\tonMouseDown: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (!<span class=\"hljs-keyword\">this</span>._mousemove_listener) {\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._mousemove_listener = Lava.Core.addGlobalHandler(<span class=\"hljs-string\">'mousemove'</span>, <span class=\"hljs-keyword\">this</span>.onMouseMove, <span class=\"hljs-keyword\">this</span>);\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._mouseup_listener = Lava.Core.addGlobalHandler(<span class=\"hljs-string\">'mouseup'</span>, <span class=\"hljs-keyword\">this</span>.onMouseUp, <span class=\"hljs-keyword\">this</span>);\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._start_coordinates = dom_event.page;\r\n\r\n\t\t}\r\n\r\n\t\tdom_event.preventDefault(); <span class=\"hljs-comment\">// to prevent text selection</span>\r\n\r\n\t},\r\n\r\n\tonMouseUp: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(event_name, event_object)</span> {</span>\r\n\r\n\t\tLava.Core.removeGlobalHandler(<span class=\"hljs-keyword\">this</span>._mousemove_listener);\r\n\t\tLava.Core.removeGlobalHandler(<span class=\"hljs-keyword\">this</span>._mouseup_listener);\r\n\t\t<span class=\"hljs-keyword\">this</span>._mousemove_listener = <span class=\"hljs-literal\">null</span>;\r\n\t\t<span class=\"hljs-keyword\">this</span>._mouseup_listener = <span class=\"hljs-literal\">null</span>;\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.x = <span class=\"hljs-keyword\">this</span>._properties.x;\r\n\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.y = <span class=\"hljs-keyword\">this</span>._properties.y;\r\n\r\n\t},\r\n\r\n\tonMouseMove: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(event_name, event_object)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'x'</span>, <span class=\"hljs-keyword\">this</span>._current_coordinates.x + event_object.page.x - <span class=\"hljs-keyword\">this</span>._start_coordinates.x);\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'y'</span>, <span class=\"hljs-keyword\">this</span>._current_coordinates.y + event_object.page.y - <span class=\"hljs-keyword\">this</span>._start_coordinates.y);\r\n\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"position:relative;height: 100px;\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"DemoDraggable\"</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"DemoDraggable\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">view</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:mousedown</span>=<span class=\"hljs-value\">\"$demo_draggable.mouse_down\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:left</span>=<span class=\"hljs-value\">\"$demo_draggable.x + 'px'\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:top</span>=<span class=\"hljs-value\">\"$demo_draggable.y + 'px'\"</span>\r\n          <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"lava-unselectable\"</span>\r\n          <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"width: 100px;height: 50px;border:1px solid black;position: absolute\"</span>&gt;</span>\r\n          {#&gt; \"x: \" + $demo_draggable.x + \", y: \" + $demo_draggable.y }\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">view</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['mousedown']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span></code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.DemoDraggable',\r\n/**\r\n * @extends {Lava.widget.Standard}\r\n */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'demo_draggable',\r\n\r\n\t_property_descriptors: {\r\n\t\tx: {type: 'Integer'},\r\n\t\ty: {type: 'Integer'}\r\n\t},\r\n\r\n\t_properties: {\r\n\t\tx: 0,\r\n\t\ty: 0\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\tmouse_down: 'onMouseDown'\r\n\t},\r\n\r\n\t_mousemove_listener: null,\r\n\t_mouseup_listener: null,\r\n\r\n\t_current_coordinates: {\r\n\t\tx: 0,\r\n\t\ty: 0\r\n\t},\r\n\r\n\t_start_coordinates: {\r\n\t\tx: 0,\r\n\t\ty: 0\r\n\t},\r\n\r\n\tonMouseDown: function(dom_event_name, dom_event) {\r\n\r\n\t\tif (!this._mousemove_listener) {\r\n\r\n\t\t\tthis._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this.onMouseMove, this);\r\n\t\t\tthis._mouseup_listener = Lava.Core.addGlobalHandler('mouseup', this.onMouseUp, this);\r\n\r\n\t\t\tthis._start_coordinates = dom_event.page;\r\n\r\n\t\t}\r\n\r\n\t\tdom_event.preventDefault(); // to prevent text selection\r\n\r\n\t},\r\n\r\n\tonMouseUp: function(event_name, event_object) {\r\n\r\n\t\tLava.Core.removeGlobalHandler(this._mousemove_listener);\r\n\t\tLava.Core.removeGlobalHandler(this._mouseup_listener);\r\n\t\tthis._mousemove_listener = null;\r\n\t\tthis._mouseup_listener = null;\r\n\r\n\t\tthis._current_coordinates.x = this._properties.x;\r\n\t\tthis._current_coordinates.y = this._properties.y;\r\n\r\n\t},\r\n\r\n\tonMouseMove: function(event_name, event_object) {\r\n\r\n\t\tthis.set('x', this._current_coordinates.x + event_object.page.x - this._start_coordinates.x);\r\n\t\tthis.set('y', this._current_coordinates.y + event_object.page.y - this._start_coordinates.y);\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>You can drag the rectangle around.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
			"extends": "Example",
			includes: {
				content: [
					"\r\n\t<div style=\"position:relative;height: 100px;\">\r\n\t\t",
					{
						type: "widget",
						"class": "Lava.WidgetConfigExtensionGateway",
						extender_type: "Default",
						template: [
							"\r\n\t\t\t\t\t",
							{
								type: "view",
								"class": "Expression",
								argument: {
									evaluator: function() {
return ("x: " + this._binds[0].getValue() + ", y: " + this._binds[1].getValue());
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
											locator_type: "Name",
											locator: "demo_draggable",
											tail: ["x"]
										},
										{
											locator_type: "Name",
											locator: "demo_draggable",
											tail: ["y"]
										}
									],
									modifiers: [],
									active_modifiers: []
								}
							},
							"\r\n\t\t\t\t"
						],
						container: {
							"class": "Element",
							tag_name: "div",
							static_classes: ["lava-unselectable"],
							static_styles: {
								width: "100px",
								height: "50px",
								border: "1px solid black",
								position: "absolute"
							},
							events: {
								mousedown: [{
									locator_type: "Name",
									locator: "demo_draggable",
									name: "mouse_down"
								}]
							},
							style_bindings: {
								left: {
									evaluator: function() {
return (this._binds[0].getValue() + 'px');
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
										locator_type: "Name",
										locator: "demo_draggable",
										tail: ["x"]
									}],
									modifiers: [],
									active_modifiers: []
								},
								top: {
									evaluator: function() {
return (this._binds[0].getValue() + 'px');
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
										locator_type: "Name",
										locator: "demo_draggable",
										tail: ["y"]
									}],
									modifiers: [],
									active_modifiers: []
								}
							}
						},
						real_class: "DemoDraggable"
					},
					"\r\n\t</div>\r\n"
				]
			}
		}
	]
}