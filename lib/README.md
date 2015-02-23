In browser you do not need `node-module.js` - instead you should include files directly.

Content of the `packages/` folder (files should be included in this order):
- `core.js` - all plain JS objects like `Lava.ClassManager` or `Lava.Core`, except parsers
- `parsers.js` - content of the `src/Parsers` folder
- `core-classes.js` - all classes, except widget controllers. `Lava.widget.Standard` is also included
- `widget-classes.js` - any other widget controllers except `Lava.widget.Standard`
- `widget-templates.js` - parsed widget templates from the `templates/` folder

Content of the `compiled/` folder:
- `all-classes.js` - exported versions of all classes from `core-classes.js` and `widget-classes.js`
- `skeletons.js` - skeletons of all classes

In browser you will need to include either `compiled/all-classes.js`, 
or both `packages/core-classes.js` and `packages/widget-classes.js`.