
Lava.ObjectParser.yy = {

	/**
	 * Additional globals may be added to the white list
	 */
	valid_globals: ['Lava'],

	/**
	 * Keep in mind: configs must be serializable
	 * @param {Array} path_segments
	 */
	assertPathValid: function(path_segments) {

		if (Lava.schema.VALIDATE_OBJECT_PATHS) {

			if (!(path_segments[0] in Lava.parsers.Common.LITERALS) && this.valid_globals.indexOf(path_segments[0]) == -1) {
				Lava.t("ObjectParser: invalid external path. Text: " + path_segments.join('.'));
			}

		}

	}

};