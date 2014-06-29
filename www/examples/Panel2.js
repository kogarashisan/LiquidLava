var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\"><span class=\"hljs-comment\">// the same code, as in Panel 1</span>\r\n</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"PanelExample1\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>\r\n        <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$example_panel.toggle_click\"</span>\r\n        <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"background: lightyellow; padding: 1em; border: 1px solid gray;\"</span>&gt;</span>\r\n        Click me!\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {$if(is_expanded)}\r\n        <div data-tooltip=\"Refresher removes the view from DOM\" class=\"lava-highlight\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:refresher</span>&gt;</span>{class: 'Default'}<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:refresher</span>&gt;</span></div>\r\n        <div data-tooltip=\"Container knows how to insert it back\" class=\"lava-highlight\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:container_config</span>&gt;</span>\r\n          {\r\n            class: \"Emulated\",\r\n            options: {\r\n              placement: \"after-previous\"\r\n            }\r\n          }\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:container_config</span>&gt;</span></div>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span> <span class=\"hljs-attribute\">style</span>=<span class=\"hljs-value\">\"border: 1px solid black\"</span>&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n          test<span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\r\n      {/if}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">default_events</span>&gt;</span>['click']<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">default_events</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span></code></pre>"
		}
	],
	classes: "Lava.ClassManager.define(\r\n'Lava.widget.PanelExample1',\r\n/** @extends {Lavadoc.widget.Standard} */\r\n{\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\tname: 'example_panel',\r\n\r\n\t_properties: {\r\n\t\tis_expanded: true\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\ttoggle_click: '_onToggleClick'\r\n\t},\r\n\r\n\t_onToggleClick: function(dom_event_name, dom_event, view, template_arguments) {\r\n\r\n\t\t/*H:The only significant line of code*/this.set('is_expanded', !this.get('is_expanded'));/*:H*/\r\n\r\n\t}\r\n\r\n});",
	template: [
		"<p>Unlike the previous panel, this one removes itself from DOM while in hidden state.</p>",
		{
			type: "widget",
			class: "Lava.WidgetConfigExtensionGateway",
			extender_type: "Default",
			extends: "Example",
			includes: {
				content: [
					"\r\n\t",
					{
						type: "widget",
						class: "Lava.WidgetConfigExtensionGateway",
						extender_type: "Default",
						template: [
							"\r\n\t\t\t",
							{
								type: "view",
								class: "View",
								container: {
									class: "Element",
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
								class: "If",
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
									binds: [{property_name: "is_expanded"}],
									modifiers: [],
									active_modifiers: []
								},
								container: {
									class: "Emulated",
									options: {placement: "after-previous"}
								},
								refresher: {class: "Default"},
								template: [
									"\r\n\t\t\t\t\r\n\t\t\t\t\r\n\t\t\t\t",
									{
										type: "view",
										class: "View",
										container: {
											class: "Element",
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
						real_class: "PanelExample1"
					},
					"\r\n"
				]
			}
		}
	]
}