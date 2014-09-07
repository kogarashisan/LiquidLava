
Lava.transitions = {

	linear: function(x) {
		return x;
	},

	inSine: function (x) {
		return 1 - Math.cos(x * Math.PI / 2);
	},

	outSine: function (x) {
		return Math.sin(x * Math.PI / 2);
	},

	inOutSine: function(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	},

	inQuad: function (x) {
		return x * x;
	},

	outQuad: function (x) {
		return x * (2 - x);
	},

	inOutQuad: function (x) {
		return (x < .5) ? (2 * x * x) : (1 - 2 * (x -= 1) * x);
	},

	inCubic: function (x) {
		return x * x * x;
	},

	outCubic: function (x) {
		return (x -= 1) * x * x + 1;
	},

	inOutCubic: function (x) {
		return (x < .5) ? (4 * x * x * x) : (4 * (x -= 1) * x * x + 1);
	}

};
