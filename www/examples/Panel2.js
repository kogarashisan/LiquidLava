({
	tabs: [
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n</pre><pre class=\"lava-code-content hljs javascript\"><span class=\"hljs-comment\">// the same code, as in Panel 1</span></pre></div></div>"
		},
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"PanelExample1\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n        <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$example_panel.toggle_click\"</span>\r\n        <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"background: lightyellow; padding: 1em; border: 1px solid gray;\"</span>&gt;</span>\r\n        Click me!\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {$if(is_expanded)}\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:refresher</span>&gt;</span>{class: 'Standard'}<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:refresher</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:container_config</span>&gt;</span>\r\n          {\r\n            class: \"Emulated\",\r\n            options: {\r\n              appender: 'AfterPrevious'\r\n            }\r\n          }\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:container_config</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"border: 1px solid black\"</span>&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {/if}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span></pre><div class=\"lava-code-overlay\"><div style=\"margin-top: 162px\" class=\"lava-code-overlay-line\"></div><div class=\"lava-code-overlay-line\"></div></div><div class=\"lava-code-tooltips\"><div style=\"margin-top: 162px\" data-tooltip=\"Refresher removes the view from DOM\"></div><div data-tooltip=\"Container knows how to insert it back\"></div></div></div></div>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.PanelExample1',\r\n/** @extends {Lava.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'example_panel',\r\n\r\n\t_properties: {\r\n\t\tis_expanded: true\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\ttoggle_click: '_onToggleClick'\r\n\t},\r\n\r\n\t_onToggleClick: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\tthis.set('is_expanded', !this.get('is_expanded'));/*H:The only significant line of code*/\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Unlike the previous panel, this one removes itself from DOM while in hidden state.</p>",
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
								"class": "If",
								argument: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{property_name: "is_expanded"}]
								},
								container: {
									"class": "Emulated",
									options: {appender: "AfterPrevious"}
								},
								refresher: {"class": "Standard"},
								template: [
									"\r\n\t\t\t\t\r\n\t\t\t\t\r\n\t\t\t\t",
									{
										type: "view",
										"class": "View",
										container: {
											"class": "Element",
											tag_name: "div",
											static_styles: {border: "1px solid black"}
										},
										template: ["\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t\ttest<br/>\r\n\t\t\t\t"]
									},
									"\r\n\t\t\t"
								]
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