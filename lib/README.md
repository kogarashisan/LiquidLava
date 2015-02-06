In browser you should directly include files from `packages/` and `locale/` folders
(you do not need `node-module.js`).

Content of the `packages/` folder (files should be included in this order):
- `core.js` - all plain JS objects like `Lava.ClassManager` or `Lava.Core`, except parsers
- `parsers.js` - content of the `src/Parsers` folder
- `core-classes.js` - all classes, except widget controllers. `Lava.widget.Standard` is also included
- `widget-classes.js` - any other widget controllers except `Lava.widget.Standard`
- `widget-templates.js` - parsed widget templates from the `templates/` folder
