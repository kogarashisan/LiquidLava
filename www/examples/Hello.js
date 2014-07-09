var package_content = {
	tabs: [
		{
			title: "Classes",
			content: "<pre><code class=\"hljs javascript\">\r\nLava.define(<span class=\"hljs-string\">'Lava.widget.HelloExample'</span>, {\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\t_properties: {\r\n\t\tyour_name: <span class=\"hljs-string\">''</span>\r\n\t}\r\n\r\n});</code></pre>"
		},
		{
			title: "Template",
			content: "<pre><code class=\"hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"HelloExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">template</span> <span class=\"hljs-attribute\">role</span>=<span class=\"hljs-value\">\"main\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">label</span>&gt;</span>Name:<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">label</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"TextInput\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">bind</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"value\"</span>&gt;</span>your_name<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">bind</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">h1</span>&gt;</span>Hello {$&gt;your_name}!<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">h1</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">template</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></code></pre>"
		}
	],
	classes: "\r\nLava.define('Lava.widget.HelloExample', {\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\t_properties: {\r\n\t\tyour_name: ''\r\n\t}\r\n\r\n});",
	template: [{
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t<label>Name:</label>\r\n\t\t",
			{
				bindings: {
					value: {
						property_name: "value",
						path_config: {property_name: "your_name"}
					}
				},
				"extends": "TextInput",
				"class": "Lava.WidgetConfigExtensionGateway",
				extender_type: "Default",
				type: "widget"
			},
			"\r\n\t\t<br/>\r\n\t\t<h1>Hello ",
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
					binds: [{property_name: "your_name"}],
					modifiers: [],
					active_modifiers: []
				},
				container: {"class": "Morph"}
			},
			"!</h1>\r\n\t"
		],
		real_class: "HelloExample",
		"extends": "Example"
	}]
}