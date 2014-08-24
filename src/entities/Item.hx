package entities;

import age.display.Entity;

class Item extends Entity
{

	public function new(pX: Int, pY: Int, ?pInverted: Bool = false)
	{
		super(16, 16);

		x = pX;
		y = pY;

		var img = pInverted ? "itemInverted" : "item";

		addImage(img, img, true);
	}
}