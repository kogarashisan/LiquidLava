({
	tabs: [
		{
			title: "Template",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">example</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:widget</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"EditableTable\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"options\"</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"application/json\"</span>&gt;</span><span class=\"javascript\">\r\n      {\r\n        columns: [\r\n          {name: <span class=\"hljs-string\">'title'</span>, title: <span class=\"hljs-string\">'Title'</span>, type: <span class=\"hljs-string\">'String'</span>, is_editable: <span class=\"hljs-literal\">true</span>},\r\n          {name: <span class=\"hljs-string\">'type'</span>, title: <span class=\"hljs-string\">'Type'</span>, type: <span class=\"hljs-string\">'String'</span>},\r\n          {name: <span class=\"hljs-string\">'is_expanded'</span>, title: <span class=\"hljs-string\">'Expanded?'</span>, type: <span class=\"hljs-string\">'Boolean'</span>, is_editable: <span class=\"hljs-literal\">true</span>}\r\n        ]\r\n      }\r\n    </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">assign</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"records\"</span>&gt;</span>#ExamplesApp.all_tree_records<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">assign</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:widget</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">example</span>&gt;</span></pre></div></div>"
		},
		{
			title: "Defines",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n36\r\n37\r\n38\r\n39\r\n40\r\n41\r\n42\r\n</pre><pre class=\"lava-code-content hljs xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:define</span> <span class=\"hljs-attribute\">controller</span>=<span class=\"hljs-value\">\"EditableTableExample\"</span> <span class=\"hljs-attribute\">extends</span>=<span class=\"hljs-value\">\"Table\"</span> <span class=\"hljs-attribute\">title</span>=<span class=\"hljs-value\">\"EditableTable\"</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">include</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"tbody\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">tbody</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"container\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:resource_id</span>=<span class=\"hljs-value\">\"$table.TBODY_ELEMENT\"</span>&gt;</span>\r\n      {#foreach($table.records) as=row}\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:roles</span>&gt;</span>$table._tbody<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:roles</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">tr</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"container\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:event:click</span>=<span class=\"hljs-value\">\"$table.row_click(row)\"</span>&gt;</span>\r\n          {#foreach($table._columns) as=column}\r\n            <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">td</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:type</span>=<span class=\"hljs-value\">\"view\"</span>&gt;</span>\r\n              {#if(row == _edit_record)}\r\n                {&gt;$table.edit_cell(column)}\r\n              {else}\r\n                {&gt;$table.cell(column)}\r\n              {/if}\r\n            <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">td</span>&gt;</span>\r\n          {/foreach}\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">tr</span>&gt;</span>\r\n      {/foreach}\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">tbody</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">include</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">script</span> <span class=\"hljs-attribute\">type</span>=<span class=\"hljs-value\">\"application/json\"</span> <span class=\"lava-control-prefix\">x</span><span class=\"hljs-attribute\">:equiv</span>=<span class=\"hljs-value\">\"storage_schema\"</span>&gt;</span><span class=\"javascript\">\r\n    {\r\n      edit_cells: {type: <span class=\"hljs-string\">'template_hash'</span>, tag_name: <span class=\"hljs-string\">'cell'</span>}\r\n    }\r\n  </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">script</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">storage</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">edit_cells</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">cell</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"String\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">text_input</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:bind</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"value\"</span>&gt;</span>row[column.name]<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:bind</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">text_input</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">cell</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">cell</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"Boolean\"</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">checkbox</span>&gt;</span>\r\n          <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">x:bind</span> <span class=\"hljs-attribute\">name</span>=<span class=\"hljs-value\">\"is_checked\"</span>&gt;</span>row[column.name]<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:bind</span>&gt;</span>\r\n        <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">checkbox</span>&gt;</span>\r\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">cell</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">edit_cells</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">storage</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">resources</span> <span class=\"hljs-attribute\">locale</span>=<span class=\"hljs-value\">\"default\"</span>&gt;</span>\r\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">container</span> <span class=\"hljs-attribute\">path</span>=<span class=\"hljs-value\">\"TABLE_ELEMENT\"</span> <span class=\"hljs-attribute\">add_classes</span>=<span class=\"hljs-value\">\"demo-table\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">container</span>&gt;</span>\r\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">resources</span>&gt;</span>\r\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">x:define</span>&gt;</span></pre></div></div>"
		},
		{
			title: "Classes",
			content: "<div class=\"lava-code-container\"><div class=\"lava-code\"><pre class=\"lava-code-line-numbers\">&nbsp;&nbsp;1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n36\r\n37\r\n38\r\n39\r\n40\r\n41\r\n42\r\n43\r\n44\r\n45\r\n46\r\n47\r\n48\r\n49\r\n50\r\n51\r\n52\r\n53\r\n54\r\n55\r\n56\r\n57\r\n58\r\n59\r\n60\r\n61\r\n62\r\n63\r\n64\r\n65\r\n66\r\n67\r\n68\r\n69\r\n70\r\n71\r\n72\r\n73\r\n74\r\n75\r\n76\r\n77\r\n78\r\n79\r\n</pre><pre class=\"lava-code-content hljs javascript\">Lava.define(\r\n<span class=\"hljs-string\">'Lava.widget.EditableTableExample'</span>,\r\n{\r\n\tExtends: <span class=\"hljs-string\">'Lava.widget.Table'</span>,\r\n\r\n\t_properties: {\r\n\t\t_edit_record: <span class=\"hljs-literal\">null</span>\r\n\t},\r\n\r\n\t_event_handlers: {\r\n\t\trow_click: <span class=\"hljs-string\">'_onRowClick'</span>\r\n\t},\r\n\r\n\t_role_handlers: {\r\n\t\t_tbody: <span class=\"hljs-string\">'_handleTBodyRole'</span>\r\n\t},\r\n\r\n\t_click_stack_changed_listener: <span class=\"hljs-literal\">null</span>,\r\n\t_tbody_container: <span class=\"hljs-literal\">null</span>,\r\n\r\n\t_onRowClick: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(dom_event_name, dom_event, view, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> edit_row = template_arguments[<span class=\"hljs-number\">0</span>];\r\n\t\t<span class=\"hljs-keyword\">if</span> (<span class=\"hljs-keyword\">this</span>._properties._edit_record == <span class=\"hljs-literal\">null</span>) {\r\n\r\n\t\t\t<span class=\"hljs-keyword\">if</span> (Lava.schema.DEBUG &amp;&amp; <span class=\"hljs-keyword\">this</span>._click_stack_changed_listener) Lava.t();\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._click_stack_changed_listener = Lava.view_manager.on(\r\n\t\t\t\t<span class=\"hljs-string\">'click_stack_changed'</span>,\r\n\t\t\t\t<span class=\"hljs-keyword\">this</span>._onClickStackChanged,\r\n\t\t\t\t<span class=\"hljs-keyword\">this</span>\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'_edit_record'</span>, edit_row);\r\n\r\n\t},\r\n\r\n\t_onClickStackChanged: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(view_manager, stack)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> tbody_element = <span class=\"hljs-keyword\">this</span>._tbody_container.getDOMElement();\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (stack.indexOf(tbody_element) == -<span class=\"hljs-number\">1</span>) { <span class=\"hljs-comment\">// click outside of tbody element</span>\r\n\t\t\tLava.view_manager.removeListener(<span class=\"hljs-keyword\">this</span>._click_stack_changed_listener);\r\n\t\t\t<span class=\"hljs-keyword\">this</span>._click_stack_changed_listener = <span class=\"hljs-literal\">null</span>;\r\n\t\t\t<span class=\"hljs-keyword\">this</span>.set(<span class=\"hljs-string\">'_edit_record'</span>, <span class=\"hljs-literal\">null</span>);\r\n\t\t}\r\n\r\n\t},\r\n\r\n\tgetInclude: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(name, template_arguments)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">var</span> result = <span class=\"hljs-literal\">null</span>,\r\n\t\t\tcolumn;\r\n\r\n\t\t<span class=\"hljs-keyword\">if</span> (name == <span class=\"hljs-string\">'edit_cell'</span>) {\r\n\r\n\t\t\tcolumn = template_arguments[<span class=\"hljs-number\">0</span>];\r\n\t\t\tresult = column.is_editable\r\n\t\t\t\t? <span class=\"hljs-keyword\">this</span>._config.storage.edit_cells[column.type]\r\n\t\t\t\t: <span class=\"hljs-keyword\">this</span>._config.storage.cells[column.type];\r\n\r\n\t\t} <span class=\"hljs-keyword\">else</span> {\r\n\r\n\t\t\tresult = <span class=\"hljs-keyword\">this</span>.Table$getInclude(name, template_arguments);\r\n\r\n\t\t}\r\n\r\n\t\t<span class=\"hljs-keyword\">return</span> result;\r\n\r\n\t},\r\n\r\n\t_handleTBodyRole: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(view)</span> {</span>\r\n\r\n\t\t<span class=\"hljs-keyword\">this</span>._tbody_container = view.getContainer();\r\n\r\n\t}\r\n\r\n});</pre></div></div>"
		}
	],
	template: [
		"<p>Very basic sortable and editable table. Changes are saved to records immediately (as you type).</p>\r\n<p>Keep in mind: example data is global for all widgets, so you can see your changes in other examples.</p>",
		{
			type: "widget",
			"class": "Lava.WidgetConfigExtensionGateway",
			extender_type: "Standard",
			"extends": "Example",
			includes: {
				content: [
					"\r\n\t",
					{
						"extends": "EditableTable",
						options: {
							columns: [
								{
									name: "title",
									title: "Title",
									type: "String",
									is_editable: true
								},
								{
									name: "type",
									title: "Type",
									type: "String"
								},
								{
									name: "is_expanded",
									title: "Expanded?",
									type: "Boolean",
									is_editable: true
								}
							]
						},
						assigns: {
							records: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Id",
									locator: "ExamplesApp",
									tail: ["all_tree_records"]
								}]
							}
						},
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