
Lava.define(
'Lava.view.container.Element',
/**
 * Container, that represents a DOM element
 * @lends Lava.view.container.Element#
 * @implements _iContainer
 */
{

	/**
	 * This instance belongs to Element container
	 * @type {boolean}
	 * @const
	 */
	isElementContainer: true,

	/**
	 * ID of DOM element that belongs to this container
	 * @type {string}
	 */
	_id: null,
	/**
	 * iew that owns the container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for this instance
	 * @type {_cElementContainer}
	 */
	_config: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Tag name of the DOM element
	 * @type {string}
	 */
	_tag_name: null,

	/**
	 * List of static CSS classes, that are not bound to expressions
	 * @type {Array.<string>}
	 */
	_static_classes: [],
	/**
	 * Arguments, that produce dynamic class names. Keys are sequential numbers
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_class_bindings: null,
	/**
	 * Value of each argument from `_class_bindings`, split into array of class names
	 * @type {Object.<string, Array.<string>>}
	 */
	_class_bindings_values: {},

	/**
	 * Styles, that are not bound to expressions
	 * @type {Object.<string, string>}
	 */
	_static_styles: {},
	/**
	 * Arguments, that produce style values dynamically. Keys are names of CSS styles
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_style_bindings: null,

	/**
	 * Properties, that are not bound to an argument
	 * @type {Object.<string, string>}
	 */
	_static_properties: {}, // name => value
	/**
	 * Arguments, that produce property values. Keys are names of properties
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_property_bindings: null,

	/**
	 * Targets for DOM events, routed by {@link Lava.system.ViewManager}
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	_events: {},

	/**
	 * Is container's html element in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Reference to the real DOM element, that belongs to this container
	 * @type {HTMLElement}
	 */
	_element: null,
	/**
	 * Is container's element void? (does not require closing tag)
	 * @type {boolean}
	 */
	_is_void: false,
	/**
	 * Element container can control an existing element on page. <kw>true</kw>, if container was rendered and inserted
	 * as new element, and <kw>false</kw>, if this instance was ordered to capture an existing DOM element on page
	 * @type {boolean}
	 */
	_is_element_owner: true,
	/**
	 * DEBUG-only flag, used to guarantee that Element's properties are not changed between rendered and inDOM states
	 * @type {boolean}
	 */
	_is_rendered: false,

	/**
	 * One-time static constructor, which modifies container's prototype and replaces itself with correct version
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		// About IOS bugfixes:
		// http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
		// http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html

		var needs_shim = Firestorm.Environment.platform == "ios";
		Lava.ClassManager.patch(this, "Element", "addEventTarget", needs_shim ? "addEventTarget_IOS" : "addEventTarget_Normal");
		Lava.ClassManager.patch(this, "Element", "informInDOM", needs_shim ? "informInDOM_IOS" : "informInDOM_Normal");

		this.init_Normal(view, config, widget);
		Lava.ClassManager.patch(this, "Element", "init", "init_Normal");

	},

	/**
	 * Real constructor
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_Normal: function(view, config, widget) {

		var name,
			resource_owner,
			container_resources,
			static_classes,
			static_properties,
			static_styles;

		this._id = Lava.ELEMENT_ID_PREFIX + view.guid;

		this._view = view;
		this._config = config;
		this._widget = widget;
		this._tag_name = config.tag_name;
		this._is_void = Lava.isVoidTag(this._tag_name);

		if (Lava.schema.RESOURCES_ENABLED && config.resource_id) {

			resource_owner = Lava.view_manager.locateTarget(widget, config.resource_id.locator_type, config.resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("[Element container] resource owner not found: " + config.resource_id.locator_type + "=" + config.resource_id.locator);
			container_resources = resource_owner.getResource(config.resource_id.name);

		}

		if (Lava.schema.RESOURCES_ENABLED && container_resources) {

			if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Element container: received resource type is not container: " + container_resources.type);
			static_classes = container_resources.value['static_classes'];
			static_properties = container_resources.value['static_properties'];
			static_styles = container_resources.value['static_styles'];

		} else {

			static_classes = config['static_classes'];
			static_properties = config['static_properties'];
			static_styles = config['static_styles'];

		}

		if (Lava.schema.DEBUG && static_properties && ('id' in static_properties))
			Lava.t("Element container: id must not be set via resources or be in config.static_properties");

		// Must clone everything, cause additional statics can be added to the element at run time
		if (static_classes) this._static_classes = static_classes.slice();

        Firestorm.extend(this._static_styles, static_styles);
		Firestorm.extend(this._static_properties, static_properties);

		for (name in config.events) {
			this._events[name] = Firestorm.clone(config.events[name]); // Object.<string, Array.<_cTarget>>
		}

		this._property_bindings = this._createArguments(config.property_bindings, view, this._onPropertyBindingChanged);
		this._style_bindings = this._createArguments(config.style_bindings, view, this._onStyleBindingChanged);
		// note: class_bindings is also an object. TemplateParser names properties numerically, starting from zero.
		this._class_bindings = this._createArguments(config.class_bindings, view, this._onClassBindingChanged);

		for (name in this._class_bindings) {

			this._class_bindings_values[name] = this._toClassNames(this._class_bindings[name].getValue() || '');

		}

	},

	/**
	 * Get target routes for dom event
	 * @param {string} event_name
	 * @returns {Array.<_cTarget>}
	 */
	getEventTargets: function(event_name) {

		return this._events[event_name];

	},

	/**
	 * Add a route for DOM event
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget: function(event_name, target) {

		Lava.t('Framework requires initialization');

	},

	/**
	 * Add a route for DOM event - IOS bugfix version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_IOS: function(event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Normal(event_name, target)

	},

	/**
	 * Add a route for DOM event - normal version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_Normal: function(event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},

	/**
	 * Add a property to `_static_properties` and synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	setProperty: function(name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},

	/**
	 * Set static property to the container, but do not synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG) {
			if (this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
			if (name == 'id') Lava.t(); // IDs belong to framework - you must not set them manually!
			if (name in this._property_bindings) Lava.t("Property is bound to an argument and cannot be set directly: " + name);
		}

		this._static_properties[name] = value;

	},

	/**
	 * Get static property
	 * @param {string} name Property name
	 * @returns {string}
	 */
	getProperty: function(name) {

		return this._static_properties[name];

	},

	/**
	 * Set locally stored property value into element
	 * @param {string} name
	 */
	syncProperty: function(name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},

	/**
	 * Add static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that class to DOM element, just to local `_static_classes` array
	 */
	addClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);
		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Remove a static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove the class from DOM element, just from local `_static_classes` array
	 */
	removeClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Add a list of static classes to the instance
	 * @param {Array.<string>} class_names
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that classes to DOM element, just to local `_static_classes` array
	 */
	addClasses: function(class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i], cancel_sync);

		}

	},

	/**
	 * Does this instance have the given static class
	 * @param class_name Name of CSS class to search for
	 * @returns {boolean} <kw>true</kw>, if class exists in `_static_classes`
	 */
	hasStaticClass: function(class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},

	/**
	 * Refresh CSS classes on DOM element, including bound classes
	 */
	syncClasses: function() {

		Firestorm.Element.setClass(this.getDOMElement(), this._renderClasses());

	},

	/**
	 * Set static style value
	 * @param {string} name CSS property name
	 * @param {string} value CSS property value
	 * @param cancel_sync If <kw>true</kw> - do not add that style to DOM element, just to local `_static_styles` object
	 */
	setStyle: function(name, value, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},

	/**
	 * Remove static CSS style
	 * @param {string} name CSS style name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove that style from DOM element, just from local `_static_styles` object
	 */
	removeStyle: function(name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, '');
		}

	},

	/**
	 * Get CSS style value
	 * @param {string} name
	 * @returns {string}
	 */
	getStyle: function(name) {

		return this._static_styles[name];

	},

	/**
	 * Refresh the "style" attribute on DOM element
	 */
	syncStyles: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},

	/**
	 * Helper method to create style, class and property bindings
	 * @param {?Object.<string, _cArgument>} configs
	 * @param {Lava.view.Abstract} view
	 * @param {!function} fn
	 * @returns {!Object.<string, Lava.scope.Argument>}
	 */
	_createArguments: function(configs, view, fn) {

		var result = {},
			argument;

		for (var name in configs) {

			argument = new Lava.scope.Argument(configs[name], view, this._widget);
			result[name] = argument;
			argument.on('changed', fn, this, {name: name})

		}

		return result;

	},

	/**
	 * Argument value for property binding has changed. If container's element is in DOM - update it's property value
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onPropertyBindingChanged: function(argument, event_args, listener_args) {

		if (this._is_inDOM) {

			var value = argument.getValue();
            if (listener_args.name.indexOf("data-") === 0) {

                if (value != null) {

                    Firestorm.Element.setAttribute(this.getDOMElement(), listener_args.name, value);

                } else {

                    Firestorm.Element.removeAttribute(this.getDOMElement(), listener_args.name);

                }

            } else if (value != null) { // filters out null and undefined

                Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

            } else if (Lava.schema.DEBUG) {

                Firestorm.Element.removeAttribute(this.getDOMElement(), listener_args.name);
                Lava.logError("[container.Element] result of binding is null or undefined. Property name: " + listener_args.name);

            }

		}

	},

	/**
	 * Argument value for style binding has changed. If container's element is in DOM - update it's style
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onStyleBindingChanged: function(argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},

	/**
	 * Split a string into array of class names
	 * @param {string} classes_string
	 * @returns {Array}
	 */
	_toClassNames: function(classes_string) {

		var classes = [];

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(classes_string);
		}

		if (classes_string != '') {

			classes = classes_string.split(/\s+/);

		}

		return classes;

	},

	/**
	 * Class binding argument has changed it's value. Refresh internal class values and element's classes
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onClassBindingChanged: function(argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},

	/**
	 * Assert, that style string does not contain any special characters, that can break HTML markup
	 * @param value
	 */
	assertStyleValid: function(value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},

	/**
	 * Assert, that class string does not contain any special characters
	 * @param value
	 */
	assertClassStringValid: function(value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},

	/**
	 * Render value of the "class" attribute, including bound classes
	 * @returns {string}
	 */
	_renderClasses: function() {

		var resultClasses = this._static_classes.slice(),
			name,
			value;

		for (name in this._class_bindings) {

			// do not need to check or convert, cause join() will convert everything to string, and nulls to empty string
			resultClasses.push(
				this._class_bindings[name].getValue()
			);

		}

		value = resultClasses.join(' ');

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(value);
		}

		return value;

	},

	/**
	 * Render content of the "style" attribute, including bound styles
	 * @returns {string}
	 */
	_renderStyles: function() {

		var result_styles = [],
			name,
			value;

		for (name in this._static_styles) {

			result_styles.push(name + ':' + this._static_styles[name]);

		}

		for (name in this._style_bindings) {

			value = this._style_bindings[name].getValue();
			if (value != null) {
				result_styles.push(name + ':' + value.toString().trim());
			}

		}

		value = result_styles.join(';');

		if (Lava.schema.view.VALIDATE_STYLES) {
			this.assertStyleValid(value);
		}

		return value;

	},

	/**
	 * Render one attribute
	 * @param {string} name
	 * @param {boolean|null|string} value
	 * @returns {string}
	 */
	_renderAttribute: function(name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},

	/**
	 * Render the opening HTML tag, including all attributes
	 * @returns {string}
	 */
	_renderOpeningTag: function() {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name;

		// see informInDOM_Normal
		// this._element = null;

		for (name in this._static_properties) {

			properties_string += this._renderAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._renderAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		return "<" + this._tag_name + " id=\"" + this._id + "\" "
			+ properties_string; //+ ">"

	},

	/**
	 * Render tag and wrap given HTML code inside it
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		if (Lava.schema.DEBUG && this._is_void) Lava.t('Trying to wrap content in void tag');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + ">" + html + "</" + this._tag_name + ">";

	},

	/**
	 * Render the tag as void tag
	 * @returns {string}
	 */
	renderVoid: function() {

		if (Lava.schema.DEBUG && !this._is_void) Lava.t('Trying to render non-void container as void');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + "/>";

	},

	/**
	 * Set innerHTML of container's element. Container must be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setHtml(this.getDOMElement(), html);

	},

	/**
	 * Insert given HTML markup at the bottom of container's DOM element
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},

	/**
	 * Insert given HTML markup at the top of container's DOM element
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup after container's DOM element
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup before container's DOM element
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getDOMElement(), html);

	},

	/**
	 * Call this method, when container has been rendered and inserted into DOM
	 * Note: does not need to be called after capture
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Version of informInDOM with IOS bugfixes
	 */
	informInDOM_IOS: function() {

		this.informInDOM_Normal();
		this.getDOMElement().onclick = Lava.noop;

	},

	/**
	 * Normal version of informInDOM
	 */
	informInDOM_Normal: function() {

		this._is_inDOM = true;
		if (Lava.schema.DEBUG) this._is_rendered = false;
		// if <input> which is already in DOM is re-rendered and inserted back
		// - then "changed" event will fire in Chrome.
		// During the event - the DOM element may be retrieved by widget,
		// so at the moment, when informInDOM is called - it's already set.
		// if (Lava.schema.DEBUG && this._element) Lava.t();
		this._element = null;

	},

	/**
	 * Call this method before removing container's element from DOM
	 */
	informRemove: function() {

		this._is_inDOM = false;
		this._element = null;

	},

	/**
	 * Get current container's element from DOM
	 * @returns {HTMLElement}
	 */
	getDOMElement: function() {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		return this.getDOMElement();

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		return this.getDOMElement();

	},

	/**
	 * Get `_id`
	 * @returns {string}
	 */
	getId: function() { return this._id; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_is_void`
	 * @returns {boolean}
	 */
	isVoid: function() { return this._is_void; },

	/**
	 * Clear internal reference to container's DOM element
	 */
	release: function() {

		this._element = null;

	},

	/**
	 * Call a method of all binding arguments
	 * @param {string} callback_name Method to call
	 * @param {*} callback_argument Argument for the method
	 */
	_withArguments: function(callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},

	/**
	 * Bind container to existing DOM element. Apply new styles, classes and properties
	 * @param {HTMLElement} element
	 */
	captureExistingElement: function(element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		// there must not be ID attribute
		if (Element.getAttribute(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getTagName(element) != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		Element.getAttribute(element, 'id', this._id);

		this._is_inDOM = true;
		this._element = element;

		for (name in this._static_properties) {

			// note: escaping must be handled by framework
			Element.setProperty(element, name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			Element.setProperty(element, name, this._property_bindings[name].getValue());

		}

		this.syncClasses();
		this.syncStyles();
		this._is_element_owner = false;

	},

	/**
	 * Release an element after call to `captureExistingElement`. Does not clear any attributes, except ID
	 */
	releaseElement: function() {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeAttribute(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},

	/**
	 * Get `_is_element_owner`
	 * @returns {boolean}
	 */
	isElementOwner: function() {

		return this._is_element_owner;

	},

	/**
	 * Perform escaping of an attribute value while rendering
	 * @param {string} string
	 * @returns {string}
	 */
	escapeAttributeValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},

	/**
	 * Remove container's element from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._property_bindings) {

			this._property_bindings[name].destroy();

		}

		for (name in this._style_bindings) {

			this._style_bindings[name].destroy();

		}

		for (name in this._class_bindings) {

			this._class_bindings[name].destroy();

		}

	}

});