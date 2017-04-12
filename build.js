/*
This is the default build script, but it's absolutely OK to write your own!
You can use this one as an example - it's really simple.
*/

// the default path to Firestorm repo on author's computer. You can set your own.
global.FIRESTORM_PATH = global.FIRESTORM_PATH || (__dirname + '/../Firestorm/');
var BuildHelper = require(global.FIRESTORM_PATH + "build/BuildHelper.js");
BuildHelper.ensureDirectoryExists('lib/export');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// read files from disk
var fs = require('fs'),
    groups = require('./build/files.js'),
    result = '';

for (var name in groups) {

    result += '\n' + BuildHelper.readFiles(groups[name], 'src/').join('\n');

}

// Embed version as an array
// var Lava = { version: [#,#,#], ...
var version_string = BuildHelper.readJSON('package.json').version;
if (!version_string.match(/\d+\.\d+\.\d+/)) throw new Error("Version format is unknown to build script");
result = result
    .replace(/\/\*\<\%=version_array\%\>\*\//, version_string.replace(/\./g, ','))
    .replace("<%=version_string%>", version_string);

// write everything to disk
fs.writeFileSync(
    'lib/export/lava.js',
    result
    + BuildHelper.readFile('locale/en.js') + '\n'
    + BuildHelper.readFile('locale/ru.js')
);

// now require it as a module (reading the source files from disk)
var Lava = require('./lib/node-module.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parse widget templates into separate file.

Lava.widgets = {};
Lava.sugar_map = {};

Lava.TemplateParser.parse(
    BuildHelper.readFile('./templates/system_widgets.html')
    + BuildHelper.readFile('./templates/standard_widgets.html')
);

fs.writeFileSync(
    'lib/export/widget-templates.js',
    'Lava.widgets = ' + Lava.serializer.serialize(Lava.widgets) + ';\n'
    + 'Lava.sugar_map = ' + Lava.serializer.serialize(Lava.sugar_map) + ';\n'
);

fs.writeFileSync(
    'lib/export/firestorm.js',
    BuildHelper.readFile(global.FIRESTORM_PATH + 'lib/firestorm.js')
);

process.exit();