package;

import states.GameState;

import age.core.Engine;
import age.Loader;

class Main extends Engine
{
	public static inline var DEFAULT_FONT : String = "pixelade";

	public function new()
	{
		super(800, 320, new GameState(), 60, "#D0F4F7");
	}
	
	public static function main()
	{
		Loader.addResource('img/animPlayer1.png', ResourceType.IMAGE, 'player1');
		Loader.addResource('img/animPlayer2.png', ResourceType.IMAGE, 'player2');

		Loader.addResource('maps/map1.json', ResourceType.TEXT, 'map1');
		Loader.addResource('maps/map2.json', ResourceType.TEXT, 'map2');
		Loader.addResource('maps/map3.json', ResourceType.TEXT, 'map3');

		Loader.addResource('img/item.png', ResourceType.IMAGE, 'item');
		Loader.addResource('img/itemInverted.png', ResourceType.IMAGE, 'itemInverted');

		Loader.addResource('img/pic.png', ResourceType.IMAGE, 'pic');
		Loader.addResource('img/picInverted.png', ResourceType.IMAGE, 'picInverted');

		Loader.addResource('img/door.png', ResourceType.IMAGE, 'door');

		Loader.addResource('img/tile_topblue.png', ResourceType.IMAGE, 'topblue');
		Loader.addResource('img/tile_blue.png', ResourceType.IMAGE, 'blue');
		Loader.addResource('img/tile_topgreen.png', ResourceType.IMAGE, 'topgreen');
		Loader.addResource('img/tile_green.png', ResourceType.IMAGE, 'green');

		Loader.start( function() { new Main(); } );
	}
	
}