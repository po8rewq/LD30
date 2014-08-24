package;

class LevelData
{
	static var levels : Array<Dynamic>;
	public static var endText : String = "And in the end they lived happily ever after - GAME OVER";

	public static function init()
	{
		levels = new Array();
		levels.push({file:"map1", text:"You're controlling two connected lovers. Collect all the hearts to open the portal."});
		levels.push({file:"map2", text:"You can jump by pressing [UP]"});
		levels.push({file:"map3", text:"Be careful not to fall into the traps!"});
		levels.push({file:"map5", text:"Love is so powerful that the lovers are connected even worlds apart."});
		levels.push({file:"map4", text:"This switch seems to open/close the gate in the other world"});
		levels.push({file:"map6", text:"Their love is more powerful than their fear..."});
		levels.push({file:"map7", text:"She must be here to help him overcome all obstacles."});
		levels.push({file:"map8", text:"Don't choose the easy path by drinking a potion"});
		levels.push({file:"endmap", text:"But they found that worlds are finally connected"});
	}

	public static function get(pLevel: Int):Dynamic
	{
		return levels[pLevel-1];
	}
}