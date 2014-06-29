

Firestorm.Environment = {

	//SUPPORTS_FUNCTION_SERIALIZATION: false,
	SUPPORTS_RANGE: false,
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: false,
	MOVES_WHITESPACE_BEFORE_SCRIPT: false,

	init: function() {

		var document = window.document,
			testEl;

		// all, even old browsers, must be able to convert a function back to sources
		//this.SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

		// last check is for IE9 which only partially supports ranges
		this.SUPPORTS_RANGE = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;

		// Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
		testEl = document.createElement('div');
		testEl.innerHTML = "<div></div>";
		testEl.firstChild.innerHTML = "<script></script>";
		this.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS = testEl.firstChild.innerHTML === '';

		// IE 8 (and likely earlier) likes to move whitespace preceeding
		// a script tag to appear after it. This means that we can
		// accidentally remove whitespace when updating a morph.
		testEl.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
		this.MOVES_WHITESPACE_BEFORE_SCRIPT = testEl.childNodes[0].nodeValue === 'Test:' && testEl.childNodes[2].nodeValue === ' Value';

	}

};