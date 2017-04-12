
Lava._is_initialized || Lava.init();

describe("Lava.parsers", function() {

	/*before(function(){
		fixture.setBase('test/fixtures')
	});*/

	it("Parses standard widgets", function() {

		Lava.TemplateParser.parse(window.__html__['templates/system_widgets.html']);
		Lava.TemplateParser.parse(window.__html__['templates/standard_widgets.html']);

	});

	it("Parses x:include correctly", function() {

		var template = window.__html__['test/fixtures/directives-x-include.html'];
		var result = Lava.TemplateParser.parse(template);
		expect(result[0].includes.title).to.deep.equal(['__TITLE__']);

	});

	it("Parses class_events widget tag correctly", function() {

		var template = window.__html__['test/fixtures/widget-tag-class_events.html'];
		var result = Lava.TemplateParser.parse(template);
		// @todo
		expect(result[0].class_events[0]).to.deep.equal({});

	});

});
