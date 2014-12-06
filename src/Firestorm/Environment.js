/**
 * Checks for browser bugs and capabilities, provides common interfaces for browser-specific extensions
 */
Firestorm.Environment = {

	//SUPPORTS_FUNCTION_SERIALIZATION: false,
	/**
	 * Supports HTML Range API
	 */
	SUPPORTS_RANGE: false,
	/**
	 * Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
	 */
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: false,
	/**
	 * IE 8 (and likely earlier) likes to move whitespace preceding a script tag to appear after it.
	 * This means that we can accidentally remove whitespace when updating a morph
	 */
	MOVES_WHITESPACE_BEFORE_SCRIPT: false,
	/**
	 * IE8 and IE9 have bugs in "input" event, see
	 * http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	NEEDS_INPUT_EVENT_SHIM: false,
	/**
	 * Calls requestAnimationFrame, if browser supports it. Actual method name may have a vendor prefix in different browsers.
	 * If browser does not support requestAnimationFrame - this method will be <kw>null</kw>
	 * @param {function} callback
	 */
	requestAnimationFrame: function(callback) { Firestorm.t(1); },

	/**
	 * Perform the object initialization
	 */
	init: function() {

		var document = window.document,
			test_node,
			requestAnimationFrame;

		// all, even old browsers, must be able to convert a function back to sources
		//this.SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

		// last check is for IE9 which only partially supports ranges
		this.SUPPORTS_RANGE = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;

		test_node = document.createElement('div');
		test_node.innerHTML = "<div></div>";
		test_node.firstChild.innerHTML = "<script></script>";
		this.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS = test_node.firstChild.innerHTML === '';

		test_node.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
		this.MOVES_WHITESPACE_BEFORE_SCRIPT = test_node.childNodes[0].nodeValue === 'Test:' && test_node.childNodes[2].nodeValue === ' Value';

		requestAnimationFrame =
			window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		this.requestAnimationFrame = requestAnimationFrame ? function(fn) { requestAnimationFrame.call(window, fn); } : null;

		this.NEEDS_INPUT_EVENT_SHIM = ("documentMode" in document) && document.documentMode < 10;

	}

};