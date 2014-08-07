
/*
Sorry for such an ugly source, but you will NOT need anything here. Definitely.
This script generates the tasks.html page.
*/

module.exports = function(grunt) {

	grunt.registerTask('buildTasksPage', function() {

		var fs = require('fs');

		function highlightTags(tags_string) {
			var tags = tags_string.split(/\s*,\s*/);
			var result = '';
			for (var i = 0, count = tags.length; i < count; i++) {
				result += '<span class="tag-' + tags[i] + '">' + tags[i] + '</span>';
			}
			return result;
		}

		function escapeText(text) {
			return text.trim().replace('\n', '<br/>'); // .replace(/\</g, '&lt;').replace(/\{/g, '{:L:}')
		}

		try { // workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135

			var Lava = global.Lava;

			var tasks_page_source = grunt.file.read('./build/tasks_page_source.txt');
			var lines = tasks_page_source.split(/\r?\n/g);

			var i = 0,
				count = lines.length,
				result_stack = [],
				fragment;

			while (i < count) {
				var line = lines[i];
				if (/^#/.test(line)) {
					result_stack.push({
						type: 'header',
						content: line.substr(1)
					})
				} else if (/^[a-zA-Z0-9]/.test(line)) {
					result_stack.push({
						type: 'category',
						content: line
					})
				} else if (/^\t\-/.test(line)) { // task start
					fragment = line.substr(2);
					var matches = fragment.match(/\s*\[([^\]]*)\]/);
					if (!matches) throw new Error("Unknown line format at line " + i);
					result_stack.push({
						type: 'task',
						tags: highlightTags(matches[1]),
						task_content: fragment.substr(matches[0].length),
						comment: ''
					})
				} else if (/^\t\t[^\/]/.test(line)) { // part of task's description
					result_stack[result_stack.length - 1].task_content += '\n' + line.substr(2);
				} else if (/^\t\t\/\//.test(line)) { // comment for task
					result_stack[result_stack.length - 1].comment += '\n' + line.substr(4);
				} else if (line != '') {
					throw new Error('unknown line format at line ' + i);
				}
				i++;
			}

			var result = '';
			i = 0;
			count = result_stack.length;
			var is_writing_tasks = false;
			while (i < count) {
				if (result_stack[i].type == 'header') {
					if (is_writing_tasks) {
						result += '</ul>\n';
						is_writing_tasks = false;
					}
					result += '<h2>' + escapeText(result_stack[i].content) + '</h2>\n';
				} else if (result_stack[i].type == 'category') {
					if (is_writing_tasks) {
						result += '</ul>\n';
						is_writing_tasks = false;
					}
					result += '<h3>' + escapeText(result_stack[i].content) + '</h3>\n';
				} else {
					if (!is_writing_tasks) {
						result += '<ul>\n';
						is_writing_tasks = true;
					}
					result += '<li>'
						+ result_stack[i].tags
						+ ' '
						+ escapeText(result_stack[i].task_content)
						+ (result_stack[i].comment ? '<span class="task-comment">' + escapeText(result_stack[i].comment) + '</span>' : '')
						+ '</li>\n';
				}
				i++;
			}
			if (is_writing_tasks) {
				result += '</ul>\n';
				is_writing_tasks = false;
			}

			var tasks_page_content = grunt.file.read('./www/tasks.html');
			var start_marker = '<!--LAVA_BUILD_TASKS_START-->';
			if (tasks_page_content.indexOf(start_marker) == -1) throw new Error("tasks page: start marker is missing");
			var marker_start_index = tasks_page_content.indexOf(start_marker) + (start_marker.length);
			var marker_end = tasks_page_content.indexOf('<!--LAVA_BUILD_TASKS_END-->');
			if (marker_end == -1) throw new Error('tasks page: end marker is missing');
			var current_tasks_text = tasks_page_content.substr(marker_start_index, marker_end - marker_start_index);
			if (current_tasks_text != result) {
				var new_page_content = tasks_page_content.substr(0, marker_start_index)
					+ result
					+ tasks_page_content.substr(marker_end);
				grunt.file.write('./www/tasks.html', new_page_content);
			}

		} catch (e) {

			if (typeof(e) == 'string' || typeof(e) == 'number') throw new Error(e);
			throw e;

		}

	});

};
