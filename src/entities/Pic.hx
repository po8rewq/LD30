package entities;

import age.display.Entity;

class Pic extends Entity
{
	public var inverted(default, null):Bool;

	public function new(pX: Int, pY: Int, ?pInverted: Bool = false)
	{
		super(16, 16);

		x = pX;
		y = pY;

		inverted = pInverted;

		var img = pInverted ? "picInverted" : "pic";

		addImage(img, img, true);
	}
}