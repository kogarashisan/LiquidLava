({
	tabs: [
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n</pre><pre class=\"lava-code-content hljs javascript\">Lava.ClassManager.define(\r\n<span class=\"hljs-string\">'Lava.widget.PanelExample1'</span>,\r\n<span class=\"hljs-comment\">/** @extends {Lava.widget.Standard} */</span>\r\n{\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\tname: <span class=\"hljs-string\">'example_panel'</span>,\r\n\r\n\t_properties: {\r\n\t\tis_expanded: <span class=\"hljs-literal\">true</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\ttoggle_click: <span class=\"hljs-string\">'_onToggleClick'</span>\r\n\t},\r\n\r\n\t_onToggleClick: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'is_expanded'</span>, !<span class=\"hljs-keyword\">this</span>.get(<span class=\"hljs-string\">'is_expanded'</span>));\r\n\r\n\t}\r\n\r\n});</pre><div class=\"lava-code-overlay\"><div style=\"margin-top: 342px\" class=\"lava-code-overlay-line\"></div></div><div class=\"lava-code-tooltips\"><div style=\"margin-top: 342px\" data-tooltip=\"The only significant line of code\"></div></div></div></div>"
		},
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"PanelExample1\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n          <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$example_panel.toggle_click\"</span>\r\n          <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"background: lightyellow; padding: 1em; border: 1px solid gray;\"</span>&gt;</span>\r\n        Click me!\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n        <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:style:display</span>=<span class=\"hljs-value\">\"is_expanded ? 'block' : 'none'\"</span>\r\n        <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"border: 1px solid black\"</span>&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span></pre></div></div>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.PanelExample1',\r\n/** @extends {Lava.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'example_panel',\r\n\r\n\t_properties: {\r\n\t\tis_expanded: true\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\ttoggle_click: '_onToggleClick'\r\n\t},\r\n\r\n\t_onToggleClick: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tthis.set('is_expanded', !this.get('is_expanded'));/*H:The only significant line of code*/\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>A very simple databinding demo. The click listener changes the <i>is_expanded</i> widget property,\r\n\twhich is bound to the style of the panel.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Standard",
			"extends": "Example",
			includes: {
				content: [
					"\r\n\t",
					{
						template: [
							"\r\n\t\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "div",
									static_styles: {
										background: "lightyellow",
										padding: "1em",
										border: "1px solid gray"
									},
									events: {
										click: [{
											locator_type: "Name",
											locator: "example_panel",
											name: "toggle_click"
										}]
									}
								},
								template: ["\r\n\t\t\t\tClick me!\r\n\t\t\t"]
							},
							"\r\n\t\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "div",
									static_styles: {border: "1px solid black"},
									style_bindings: {
										display: {
											evaluator: function() {
return (this._binds[0].getValue() ? 'block' : 'none');
},
											binds: [{property_name: "is_expanded"}]
										}
									}
								},
								template: ["\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t"]
							},
							"\r\n\t\t"
						],
						real_class: "PanelExample1",
						"class": "Lava.WidgetConfigExtensionGateway",
						extender_type: "Standard",
						type: "widget"
					},
					"\r\n"
				]
			}
		}
	]
})