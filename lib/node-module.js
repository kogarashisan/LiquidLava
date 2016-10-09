/*
This file is a loader - it reads framework files from disk and evaluates them,
producing the Node.js module instance. Also calls Lava.init()

It will load Firestorm either from node_modules, or from global.FIRESTORM_PATH directory.
*/

var path = require("path"),
    fs = require("fs"),
    vm = require("vm"),
    util = require("util");

var context = vm.createContext({
	Firestorm: require(global.FIRESTORM_PATH || 'firestorm')
});

var FILE_GROUPS = eval("(" + fs.readFileSync(__dirname + '/../build/files.json', 'utf8') + ")");

function loadFiles(list, prefix) {

    for (var i = 0, count = list.length; i < count; i++) {
        var absolute_path = path.resolve(prefix + list[i]);
        try {
            var code = fs.readFileSync(absolute_path, "utf8");
            vm.runInContext(code, context, absolute_path);
        } catch(ex) {
            util.debug("ERROR in file: " + absolute_path + " / " + ex);
            process.exit(1);
        }
    }

}

for (var group_name in FILE_GROUPS) {
    loadFiles(FILE_GROUPS[group_name], __dirname + '/../src/');
}

loadFiles(['en.js', 'ru.js'], __dirname + "/../locale/");
loadFiles(['widget-templates.js'], __dirname + "/export/");

context.Lava.init();
module.exports = context.Lava;