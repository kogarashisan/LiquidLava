
Lava.ObjectParser.yy = {

	/**
	 * Additional globals may be added to the white list
	 */
	valid_globals: ['document'],

	assertPathValid: function(path_segments) {

		if (Lava.schema.VALIDATE_OBJECT_PATHS) {

			var count = path_segments.length;
			if (count == 1) {

				if (!Lava.parsers.Common.isLiteral(path_segments[0])) Lava.t("ObjectParser: all external paths must start with 'window.*'. Text: " + path_segments.join('.'));

			} else { // > 1

				if (path_segments[0] != 'window' && path_segments[0] != 'global') Lava.t("ObjectParser: all external paths must start with 'window.' or 'global.'. Text: " + path_segments.join('.'));
				if (count == 2) {
					if (this.valid_globals.indexOf(path_segments[1]) !== -1)
						Lava.t("ObjectParser: objects should not contain global variables. Exceptions may be manually added to valid_globals property");
				}
				// else count > 2

			}

		}

	}

};