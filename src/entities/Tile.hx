package entities;

import age.display.Entity;

class Tile extends Entity
{
	public var col(default, null) : Int;
	public var lin(default, null) : Int;

	public function new(pX: Int, pY: Int, pTileSize: Int, pIdCell: Int)
	{
		super(pTileSize, pTileSize);

		col = pX;
		lin = pY;

		x = pX * pTileSize;
		y = pY * pTileSize;

		//
        var img : String = switch(pIdCell)
        {
            case 3 : "green";
            case 4 : "topgreen";
            case 1 : "blue";
            case 2 : "topblue";
            default : "";
        }

		addImage(img, img, true);
	}

}