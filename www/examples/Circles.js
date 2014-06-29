var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.CirclesExample'</span>,\r\n{\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\tname: <span class=\"hljs-string\">'circles_example'</span>,\r\n\r\n\t_properties: {\r\n\t\tcircles: <span class=\"hljs-literal\">null</span>,\r\n\t\tselected_circle: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\tcircle_mouse_down: <span class=\"hljs-string\">'_onCircleMouseDown'</span>,\r\n\t\tadd: <span class=\"hljs-string\">'_addCircle'</span>,\r\n\t\t<span class=\"hljs-string\">'delete'</span>: <span class=\"hljs-string\">'_deleteCircle'</span>\r\n\t},\r\n\r\n\t_circles: <span class=\"hljs-literal\">null</span>,\r\n\r\n\tCIRCLE_SIZE: <span class=\"hljs-number\">40</span>,\r\n\tAREA_SIZE: <span class=\"hljs-number\">500</span>,\r\n\r\n\t_mousemove_listener: <span class=\"hljs-literal\">null</span>,\r\n\t_mouseup_listener: <span class=\"hljs-literal\">null</span>,\r\n\r\n\t_current_coordinates: {\r\n\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\ty: <span class=\"hljs-number\">0</span>\r\n\t},\r\n\r\n\t_start_coordinates: {\r\n\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\ty: <span class=\"hljs-number\">0</span>\r\n\t},\r\n\r\n\tinit: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(config, widget, parent_view, template, properties)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>.Standard$init(config, widget, parent_view, template, properties);\r\n\t\t<span class=\"hljs-keyword\">this</span>._properties.circles = Examples.makeLive(ExampleData.circles);\r\n\t\t<span class=\"hljs-keyword\">this</span>._circles = <span class=\"hljs-keyword\">this</span>._properties.circles;\r\n\r\n\t},\r\n\r\n\t_addCircle: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> circle = <span class=\"hljs-keyword\">new</span> Lava.mixin.Properties({\r\n\t\t\tx: <span class=\"hljs-number\">0</span>,\r\n\t\t\ty: <span class=\"hljs-number\">0</span>,\r\n\t\t\ttext: <span class=\"hljs-string\">''</span>\r\n\t\t});\r\n\t\t<span class=\"hljs-keyword\">this</span>._circles.push(circle);\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'selected_circle'</span>, circle);\r\n\r\n\t},\r\n\r\n\t_deleteCircle: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (<span class=\"hljs-keyword\">this</span>._properties.selected_circle) {\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._circles.remove(<span class=\"hljs-keyword\">this</span>._properties.selected_circle);\r\n\t\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'selected_circle'</span>, <span class=\"hljs-literal\">null</span>);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCircleMouseDown: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> circle = template_arguments[<span class=\"hljs-number\">0</span>];\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'selected_circle'</span>, circle);\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (!<span class=\"hljs-keyword\">this</span>._mousemove_listener) {\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._mousemove_listener = Lava.Core.addGlobalHandler(<span class=\"hljs-string\">'mousemove'</span>, <span class=\"hljs-keyword\">this</span>.onMouseMove, <span class=\"hljs-keyword\">this</span>);\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._mouseup_listener = Lava.Core.addGlobalHandler(<span class=\"hljs-string\">'mouseup'</span>, <span class=\"hljs-keyword\">this</span>.onMouseUp, <span class=\"hljs-keyword\">this</span>);\r\n\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._start_coordinates = dom_event.page;\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.x = circle.get(<span class=\"hljs-string\">'x'</span>);\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.y = circle.get(<span class=\"hljs-string\">'y'</span>);\r\n\r\n\t\t}\r\n\r\n\t\tdom_event.preventDefault(); <span class=\"hljs-comment\">// to prevent text selection</span>\r\n\r\n\t},\r\n\r\n\tonMouseUp: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(event_name, event_object)</span> {</span>\r\n\r\n\t\tLava.Core.removeGlobalHandler(<span class=\"hljs-keyword\">this</span>._mousemove_listener);\r\n\t\tLava.Core.removeGlobalHandler(<span class=\"hljs-keyword\">this</span>._mouseup_listener);\r\n\t\t<span class=\"hljs-keyword\">this</span>._mousemove_listener = <span class=\"hljs-literal\">null</span>;\r\n\t\t<span class=\"hljs-keyword\">this</span>._mouseup_listener = <span class=\"hljs-literal\">null</span>;\r\n\r\n\t},\r\n\r\n\t_constrain: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(coordinate)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> result = coordinate,\r\n\t\t\tlimit = <span class=\"hljs-keyword\">this</span>.AREA_SIZE - <span class=\"hljs-keyword\">this</span>.CIRCLE_SIZE;\r\n\t\t<span class=\"hljs-keyword\">if</span> (coordinate &lt; <span class=\"hljs-number\">0</span>) result = <span class=\"hljs-number\">0</span>;\r\n\t\t<span class=\"hljs-keyword\">if</span> (coordinate &gt; limit) result = limit;\r\n\t\t<span class=\"hljs-keyword\">return</span> result;\r\n\r\n\t},\r\n\r\n\tonMouseMove: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(event_name, event_object)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> circle = <span class=\"hljs-keyword\">this</span>._properties.selected_circle;\r\n\t\tcircle.set(<span class=\"hljs-string\">'x'</span>, <span class=\"hljs-keyword\">this</span>._constrain(\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.x + event_object.page.x - <span class=\"hljs-keyword\">this</span>._start_coordinates.x)\r\n\t\t);\r\n\t\tcircle.set(<span class=\"hljs-string\">'y'</span>, <span class=\"hljs-keyword\">this</span>._constrain(\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._current_coordinates.y + event_object.page.y - <span class=\"hljs-keyword\">this</span>._start_coordinates.y)\r\n\t\t);\r\n\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"CirclesExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"width:500px; height: 500px;border: 1px solid gray;position: relative;overflow: hidden;float:left\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">img</span> <span class=\"hljs-attribute\">src</span>=<span class=\"hljs-value\">\"img/goods.jpg\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"position: absolute\"</span>&gt;</span>\r\n      {$foreach($circles_example.circles) as=circle}\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"example-circle lava-unselectable\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:mousedown</span>=<span class=\"hljs-value\">\"$circles_example.circle_mouse_down(circle)\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:left</span>=<span class=\"hljs-value\">\"circle.x + 'px'\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:top</span>=<span class=\"hljs-value\">\"circle.y + 'px'\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:classes</span>=<span class=\"hljs-value\">\"(circle == selected_circle) ? 'example-circle-selected' : ''\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:bind:data-tooltip</span>=<span class=\"hljs-value\">\"circle.text\"</span>&gt;</span>i<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {/foreach}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"float:left;padding: 1em\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$circles_example.add\"</span>&gt;</span>Add circle<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">button</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"button\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"btn btn-primary\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"margin-top:0.5em\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$circles_example.delete\"</span>&gt;</span>Delete selected<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">button</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n      {$if(selected_circle)}\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"padding-top:0.5em\"</span>&gt;</span>\r\n        Selected circle:<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        x: {$&gt;selected_circle.x}<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        y: {$&gt;selected_circle.y}<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        Tooltip text:<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">text_input</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:bind</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"value\"</span>&gt;</span>selected_circle.text<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:bind</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">text_input</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {/if}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"clearfix\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click', 'mousedown']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.CirclesExample',\r\n{\r\n\tExtends: 'Lava.widget.Standard',\r\n\tname: 'circles_example',\r\n\r\n\t_properties: {\r\n\t\tcircles: null,\r\n\t\tselected_circle: null\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\tcircle_mouse_down: '_onCircleMouseDown',\r\n\t\tadd: '_addCircle',\r\n\t\t'delete': '_deleteCircle'\r\n\t},\r\n\r\n\t_circles: null,\r\n\r\n\tCIRCLE_SIZE: 40,\r\n\tAREA_SIZE: 500,\r\n\r\n\t_mousemove_listener: null,\r\n\t_mouseup_listener: null,\r\n\r\n\t_current_coordinates: {\r\n\t\tx: 0,\r\n\t\ty: 0\r\n\t},\r\n\r\n\t_start_coordinates: {\r\n\t\tx: 0,\r\n\t\ty: 0\r\n\t},\r\n\r\n\tinit: function(config, widget, parent_view, template, properties) {\r\n\r\n\t\tthis.Standard$init(config, widget, parent_view, template, properties);\r\n\t\tthis._properties.circles = Examples.makeLive(ExampleData.circles);\r\n\t\tthis._circles = this._properties.circles;\r\n\r\n\t},\r\n\r\n\t_addCircle: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tvar circle = new Lava.mixin.Properties({\r\n\t\t\tx: 0,\r\n\t\t\ty: 0,\r\n\t\t\ttext: ''\r\n\t\t});\r\n\t\tthis._circles.push(circle);\r\n\t\tthis.set('selected_circle', circle);\r\n\r\n\t},\r\n\r\n\t_deleteCircle: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tif (this._properties.selected_circle) {\r\n\t\t\tthis._circles.remove(this._properties.selected_circle);\r\n\t\t\tthis.set('selected_circle', null);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\t_onCircleMouseDown: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tvar circle = template_arguments[0];\r\n\t\tthis.set('selected_circle', circle);\r\n\r\n\t\tif (!this._mousemove_listener) {\r\n\r\n\t\t\tthis._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this.onMouseMove, this);\r\n\t\t\tthis._mouseup_listener = Lava.Core.addGlobalHandler('mouseup', this.onMouseUp, this);\r\n\r\n\t\t\tthis._start_coordinates = dom_event.page;\r\n\t\t\tthis._current_coordinates.x = circle.get('x');\r\n\t\t\tthis._current_coordinates.y = circle.get('y');\r\n\r\n\t\t}\r\n\r\n\t\tdom_event.preventDefault(); // to prevent text selection\r\n\r\n\t},\r\n\r\n\tonMouseUp: function(event_name, event_object) {\r\n\r\n\t\tLava.Core.removeGlobalHandler(this._mousemove_listener);\r\n\t\tLava.Core.removeGlobalHandler(this._mouseup_listener);\r\n\t\tthis._mousemove_listener = null;\r\n\t\tthis._mouseup_listener = null;\r\n\r\n\t},\r\n\r\n\t_constrain: function(coordinate) {\r\n\r\n\t\tvar result = coordinate,\r\n\t\t\tlimit = this.AREA_SIZE - this.CIRCLE_SIZE;\r\n\t\tif (coordinate < 0) result = 0;\r\n\t\tif (coordinate > limit) result = limit;\r\n\t\treturn result;\r\n\r\n\t},\r\n\r\n\tonMouseMove: function(event_name, event_object) {\r\n\r\n\t\tvar circle = this._properties.selected_circle;\r\n\t\tcircle.set('x', this._constrain(\r\n\t\t\tthis._current_coordinates.x + event_object.page.x - this._start_coordinates.x)\r\n\t\t);\r\n\t\tcircle.set('y', this._constrain(\r\n\t\t\tthis._current_coordinates.y + event_object.page.y - this._start_coordinates.y)\r\n\t\t);\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Widget like this is used in admin panel of a shop, which author maintained for some time.</p>\r\n<p>You can drag the circles around and edit their tooltips.</p>\r\n<p>Note: architecturally, it's wrong to load data in constructor, unless it's a global widget.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
			template: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "div",
						static_styles: {
							width: "500px",
							height: "500px",
							border: "1px solid gray",
							position: "relative",
							overflow: "hidden",
							"float": "left"
						}
					},
					template: [
						"\r\n\t\t\t<img src=\"img/goods.jpg\" style=\"position: absolute\"/>\r\n\t\t\t",
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
									locator: "circles_example",
									tail: ["circles"]
								}],
								modifiers: [],
								active_modifiers: []
							},
							container: {"class": "Morph"},
							as: "circle",
							template: [
								"\r\n\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										"class": "Element",
										tag_name: "div",
										static_classes: [
											"example-circle",
											"lava-unselectable"
										],
										events: {
											mousedown: [{
												locator_type: "Name",
												locator: "circles_example",
												name: "circle_mouse_down",
												arguments: [{
													type: 2,
													data: {property_name: "circle"}
												}]
											}]
										},
										property_bindings: {
											"data-tooltip": {
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
													property_name: "circle",
													tail: ["text"]
												}],
												modifiers: [],
												active_modifiers: []
											}
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
													property_name: "circle",
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
													property_name: "circle",
													tail: ["y"]
												}],
												modifiers: [],
												active_modifiers: []
											}
										},
										class_bindings: {
											0: {
												evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue()) ? 'example-circle-selected' : '');
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
													{property_name: "circle"},
													{property_name: "selected_circle"}
												],
												modifiers: [],
												active_modifiers: []
											}
										}
									},
									template: ["i"]
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t\t<div style=\"float:left;padding: 1em\">\r\n\t\t\t",
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
								locator: "circles_example",
								name: "add"
							}]
						}
					},
					template: ["Add circle"]
				},
				"<br/>\r\n\t\t\t",
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
						static_styles: {"margin-top": "0.5em"},
						static_properties: {type: "button"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "circles_example",
								name: "delete"
							}]
						}
					},
					template: ["Delete selected"]
				},
				"\r\n\t\t\t<br/>\r\n\t\t\t",
				{
					type: "view",
					"class": "If",
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
						binds: [{property_name: "selected_circle"}],
						modifiers: [],
						active_modifiers: []
					},
					container: {"class": "Morph"},
					template: [
						"\r\n\t\t\t<div style=\"padding-top:0.5em\">\r\n\t\t\t\tSelected circle:<br/>\r\n\t\t\t\tx: ",
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
									property_name: "selected_circle",
									tail: ["x"]
								}],
								modifiers: [],
								active_modifiers: []
							},
							container: {"class": "Morph"}
						},
						"<br/>\r\n\t\t\t\ty: ",
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
									property_name: "selected_circle",
									tail: ["y"]
								}],
								modifiers: [],
								active_modifiers: []
							},
							container: {"class": "Morph"}
						},
						"<br/>\r\n\t\t\t\tTooltip text:<br/>\r\n\t\t\t\t",
						{
							type: "widget",
							"class": "Lava.WidgetConfigExtensionGateway",
							extender_type: "Default",
							"extends": "TextInput",
							bindings: {
								value: {
									property_name: "value",
									path_config: {
										property_name: "selected_circle",
										tail: ["text"]
									}
								}
							}
						},
						"\r\n\t\t\t</div>\r\n\t\t\t"
					]
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"clearfix\"></div>\r\n\t"
			],
			real_class: "CirclesExample",
			"extends": "Example"
		}
	]
}