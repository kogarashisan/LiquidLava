
// Parse widget templates into separate file.
// Depends on module, exported by previous task.

module.exports = function(grunt) {

	grunt.registerTask('buildWidgetTemplates', global.bug1135(function() {

		// see buildLibrary task for explanation
		if (global.buildLibrary_run) throw new Error('You must run buildLibrary task as separate command');

		var Lava = require('./../../lib/node-module.js');

		Lava.TemplateParser.parse(
			grunt.file.read('./templates/system_widgets.html')
			+ grunt.file.read('./templates/standard_widgets.html')
		);

		// check that all events, required by widgets, are in the schema.
		for (var name in Lava.widgets) {
			if (Lava.widgets[name].default_events) {
				Lava.widgets[name].default_events.forEach(function(event_name){
					if (Lava.schema.system.DEFAULT_EVENTS.indexOf(event_name) == -1) {
						throw new Error('Event ' + event_name + ' is used by widget ' + name + ' and not in schema');
					}
				})
			}
		}

		grunt.file.write(
			'lib/packages/widget-templates.js',
			'Lava.widgets = ' + Lava.serializer.serialize(Lava.widgets) + ';\n'
			+ 'Lava.sugar_map = ' + Lava.serializer.serialize(Lava.sugar_map) + ';\n'
		);

	}));

};