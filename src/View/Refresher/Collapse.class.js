
Lava.define(
'Lava.view.refresher.Collapse',
/**
 * Animation that expands and collapses elements in one direction
 * @lends Lava.view.refresher.Collapse#
 * @extends Lava.view.refresher.Animated
 */
{

	Extends: 'Lava.view.refresher.Animated',

	/**
	 * Animation class to use when expanding and collapsing templates
	 * @type {string}
	 * @readonly
	 */
	ANIMATION_NAME: 'Lava.animation.Collapse',

	_createAnimation: function(template, index) {

		var element = this._getAnimationTarget(template),
			constructor,
			animation;

		constructor = Lava.ClassManager.getConstructor(this.ANIMATION_NAME, 'Lava.animation');
		animation = new constructor({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}

});