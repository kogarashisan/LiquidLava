
module.exports = function(grunt) {

	grunt.initConfig({

		js_files: grunt.file.readJSON('build/js_files.json'),
		www_files: grunt.file.readJSON('build/www_files.json'),

		concat: {
			options: {
				banner: "\n/*\nThis file was generated via build script. See Gruntfile.js\n*/\n\n"
			},
			css: {
				files: [
					{
						src: [
							"./build/css/bootstrap/bootstrap.min.css",
							"./build/css/bootstrap/bootstrap-theme.min.css",
							"./build/css/bootstrap/partial-docs.css",
							"./build/css/site.css",
							"./dist/lava-widgets.css",
							"./build/css/highlightjs/magula.css"
						],
						dest: './www/css/site.css'
					}
				]
			},
			site_js: {
				files: [
					{
						src: [
							"./build/src/site.js",
							"./build/src/sample_data.js",
							"./build/src/EditableTableExample.class.js",
							"./build/src/ChangelogPage.class.js",
							"./build/src/ExamplesPage.class.js",
							"./build/src/WidgetsPage.class.js",
							"./build/src/MainPageTree.class.js",
							"./build/temp/example_box_widget.js",
							"./build/temp/editable_table_widget.js",
							"./build/temp/main_page_widgets_template.js"
						],
						dest: './www/js/site.js'
					}
				]
			}
		}

	});

	grunt.option('stack', true);
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadTasks('build/tasks/');

	// Note: all tasks depend on previous tasks
	grunt.registerTask('default', ['buildLava', 'buildIncludes', 'buildExamples', 'buildWeb', 'buildTasksPage', 'concat']);

};