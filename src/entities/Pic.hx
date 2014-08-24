package entities;

import age.display.Entity;

class Pic extends Entity
{
	public var inverted(default, null):Bool;
	public var position(default, null):Position;

	public function new(pX: Int, pY: Int, ?pPosition: String = "bottom",?pInverted: Bool = false)
	{
		super(16, 16);

		x = pX;
		y = pY;

		position = pPosition == "top" ? Position.TOP : Position.BOTTOM;

		inverted = pInverted;

		var img = "pic"; // = pInverted ? "picInverted" : "pic";
		if(position == Position.BOTTOM)
			img = pInverted ? "picInverted" : "pic";
		else
			img = pInverted ? "pic" : "picInverted";

		addImage(img, img, true);
	}
}

enum Position {
	TOP;
	BOTTOM;
}