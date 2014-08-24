package;

class LevelData
{
	static var levels : Array<Dynamic>;

	public static function init()
	{
		levels = new Array();
		levels.push({file:"map1", text:"You're controlling two connected lovers. Collect all hearts to open the gate to the next world."});
		levels.push({file:"map2", text:"You can jump by pressing [UP]"});
		levels.push({file:"map3", text:"Be careful not to fall into the traps"});
	}

	public static function get(pLevel: Int):Dynamic
	{
		return levels[pLevel-1];
	}
}