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
			testEl,
			requestAnimationFrame;

		// all, even old browsers, must be able to convert a function back to sources
		//this.SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

		// last check is for IE9 which only partially supports ranges
		this.SUPPORTS_RANGE = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;

		testEl = document.createElement('div');
		testEl.innerHTML = "<div></div>";
		testEl.firstChild.innerHTML = "<script></script>";
		this.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS = testEl.firstChild.innerHTML === '';

		testEl.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
		this.MOVES_WHITESPACE_BEFORE_SCRIPT = testEl.childNodes[0].nodeValue === 'Test:' && testEl.childNodes[2].nodeValue === ' Value';

		requestAnimationFrame =
			window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		this.requestAnimationFrame = function(fn) {
			requestAnimationFrame.call(window, fn);
		}

	}

};