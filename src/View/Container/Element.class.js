
Lava.define(
'Lava.view.container.Element',
/**
 * @lends Lava.view.container.Element#
 * @implements iContainer
 */
{

	isElementContainer: true,

	_id: null,
	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	/**
	 * @type {_cElementContainer}
	 */
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	_tag_name: null,

	_static_classes: [],
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_class_bindings: null,

	_class_bindings_values: {},

	_static_styles: {},
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_style_bindings: null,

	_static_properties: {}, // name => value
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_property_bindings: null,

	/**
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	_events: {},

	_is_inDOM: false,

	_element: null,

	_is_void: false,

	_is_element_owner: true,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

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
		for (name in static_styles) {
			this._static_styles[name] = static_styles[name];
		}
		for (name in static_properties) {
			this._static_properties[name] = static_properties[name];
		}

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
	 * @param {string} event_name
	 * @returns {Array.<_cTarget>}
	 */
	getEventTargets: function(event_name) {

		return this._events[event_name];

	},

	/**
	 * One-time gateway for IOS bugfixes
	 * http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
	 * http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html
	 */
	_fixIOS: function() {

		var prototype = this.Class.constructor.prototype;
		if (navigator.userAgent.match(/i(Phone|Pod|Pad)/)) {

			prototype.addEventTarget = this.addEventTarget_IOS;
			prototype.informInDOM = this.informInDOM_IOS;

		} else {

			prototype.addEventTarget = this.addEventTarget_Original;
			prototype.informInDOM = this.informInDOM_Original;

		}

	},

	addEventTarget: function(event_name, target) {

		this._fixIOS();
		this.addEventTarget(event_name, target);

	},

	addEventTarget_IOS: function(event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Original(event_name, target)

	},

	addEventTarget_Original: function(event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},

	/**
	 * Store property value in the javascript class, and optionally - set it on the DOM element.
	 * View can be rendered at any time, so property values must always be actual.
	 *
	 * @param {string} name
	 * @param value
	 */
	setProperty: function(name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},

	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG && name == 'id') Lava.t();
		if (Lava.schema.DEBUG && (name in this._property_bindings)) Lava.t("Property is bound to an argument and cannot be set directly: " + name);

		this._static_properties[name] = value;

	},

	getProperty: function(name) {

		return this._static_properties[name];

	},

	/**
	 * Push locally stored property value into element.
	 * @param name
	 */
	syncProperty: function(name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},

	addClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},

	removeClass: function(class_name, cancel_sync) {

		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},

	addClasses: function(class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i])

		}

	},

	hasStaticClass: function(class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},

	syncClasses: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'class', this._renderClasses());

	},

	setStyle: function(name, value, cancel_sync) {

		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},

	removeStyle: function(name, cancel_sync) {

		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, null);
		}

	},

	getStyle: function(name) {

		return this._static_styles[name];

	},

	syncStyles: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},

	/**
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

	_onPropertyBindingChanged: function(argument, event_args, listener_args) {

		if (this._is_inDOM) {

			// note: escape will be handled by framework
			var value = argument.getValue();

			if (value != null && value !== false) {

				if (value === true) {
					value = listener_args.name;
				}

				Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

			} else {

				Firestorm.Element.removeProperty(this.getDOMElement(), listener_args.name);

			}

		}

	},

	_onStyleBindingChanged: function(argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},

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

	_onClassBindingChanged: function(argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},

	assertStyleValid: function(value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},

	assertClassStringValid: function(value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},

	_renderClasses: function() {

		var resultClasses = this._static_classes.clone(),
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

	_serializeAttribute: function(name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},

	wrap: function(html) {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name,
			result;

		// view calls this function in render(), and before that it must wake up itself and it's container
		if (Lava.schema.DEBUG && this._is_sleeping) Lava.t();

		this._element = null;

		for (name in this._static_properties) {

			properties_string += this._serializeAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._serializeAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		result = "<" + this._tag_name + " id=\"" + this._id + "\" "
			// + this._writeEvents()
			+ properties_string; //+ ">"

		if (this._is_void) {

			if (Lava.schema.DEBUG && html) Lava.t('Trying to wrap content in void tag');

			result += "/>";

		} else {

			result += ">" + html + "</" + this._tag_name + ">";

		}

		return result;

	},

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setProperty(this.getDOMElement(), 'html', html);

	},

	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},

	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},

	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},

	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getDOMElement(), html);

	},

	/**
	 * Note: does not need to be called after capture.
	 */
	informInDOM: function() {

		this._fixIOS();
		this.informInDOM();

	},

	informInDOM_IOS: function() {

		this.informInDOM_Original();
		this.getDOMElement().onclick = Lava.noop;

	},

	informInDOM_Original: function() {

		this._is_inDOM = true;
		if (Lava.schema.DEBUG && this._element) Lava.t();

	},

	informRemove: function() {

		this._is_inDOM = false;
		this._element = null;

	},

	getDOMElement: function() {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},

	getId: function() { return this._id; },

	isInDOM: function() { return this._is_inDOM; },

	isVoid: function() { return this._is_void; },

	release: function() {

		this._element = null;

	},

	sleep: function() {

		this._withArguments('sleep');

	},

	wakeup: function() {

		this._withArguments('wakeup', true);

	},

	_withArguments: function(callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},

	setSignature: function(tag_name) {

		if (Lava.schema.DEBUG && tag_name != tag_name.toLowerCase()) Lava.t("Tag names must be lower case");
		if (this._is_inDOM) Lava.t("Can not change signature on elements that are in dom");
		this._tag_name = tag_name;
		this._is_void = Lava.isVoidTag(tag_name);

	},

	captureExistingElement: function(element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		if (Element.getProperty(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getProperty(element, 'tag').toLowerCase() != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		this.wakeup();

		Element.setProperty(element, 'id', this._id);

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

	releaseElement: function() {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeProperty(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},

	isElementOwner: function() {

		return this._is_element_owner;

	},

	escapeAttributeValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},

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