package;

class Enums {

	public static function getGravity(pGravity: Enums.Gravity): Int
	{
		return switch(pGravity)
		{
			case NORMAL: 1;
			case INVERTED: -1;
			default: 0;
		};
	}

}

enum Gravity {
    NORMAL;
    INVERTED;
}