({
	tabs: [
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n</pre><pre class=\"lava-code-content hljs javascript\">Lava.define(<span class=\"hljs-string\">'Lava.widget.HelloExample'</span>, {\r\n\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Standard'</span>,\r\n\r\n\t_properties: {\r\n\t\tyour_name: <span class=\"hljs-string\">''</span>\r\n\t}\r\n\r\n});</pre></div></div>"
		},
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Example\"</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"HelloExample\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">label</span>&gt;</span>Name:<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">label</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"TextInput\"</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">bind</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"value\"</span>&gt;</span>your_name<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">bind</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">br</span>/&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">h1</span>&gt;</span>Hello {$&gt;your_name}!<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">h1</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">main_template</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span></pre></div></div>"
		}
	],
	classes: "\r\nLava.define('Lava.widget.HelloExample', {\r\n\r\n\tExtends: 'Lava.widget.Standard',\r\n\r\n\t_properties: {\r\n\t\tyour_name: ''\r\n\t}\r\n\r\n});",
	template: [{
		template: [
			"\r\n\t\t<label>Name:</label>\r\n\t\t",
			{
				"extends": "TextInput",
				bindings: {
					value: {
						property_name: "value",
						path_config: {property_name: "your_name"}
					}
				},
				"class": "Lava.WidgetConfigExtensionGateway",
				extender_type: "Standard",
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
					flags: {isScopeEval: true},
					binds: [{property_name: "your_name"}]
				},
				container: {"class": "Morph"}
			},
			"!</h1>\r\n\t"
		],
		"extends": "Example",
		real_class: "HelloExample",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		type: "widget"
	}]
})