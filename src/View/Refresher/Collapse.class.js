
Lava.define(
'Lava.view.refresher.Collapse',
/**
 * @lends Lava.view.refresher.Collapse#
 * @extends Lava.view.refresher.Animated
 */
{

	Extends: 'Lava.view.refresher.Animated',

	_createAnimation: function(template, index) {

		var element = this._getAnimationTarget(template),
			animation;

		animation = new Lava.animation.Collapse({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}

});