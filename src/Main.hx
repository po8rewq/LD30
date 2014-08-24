package;

import states.IntroState;

import age.core.Engine;
import age.Loader;

class Main extends Engine
{
	public static inline var DEFAULT_FONT : String = "pixelade";

	public function new()
	{
		super(800, 320, new IntroState(), 60, "#D0F4F7");
	}
	
	public static function main()
	{
		Loader.addResource('img/animPlayer1.png', ResourceType.IMAGE, 'player1');
		Loader.addResource('img/animPlayer2.png', ResourceType.IMAGE, 'player2');
		Loader.addResource('img/animPlayer2inv.png', ResourceType.IMAGE, 'player2inv');

		Loader.addResource('maps/map1.json', ResourceType.TEXT, 'map1');
		Loader.addResource('maps/map2.json', ResourceType.TEXT, 'map2');
		Loader.addResource('maps/map3.json', ResourceType.TEXT, 'map3');
		Loader.addResource('maps/map4.json', ResourceType.TEXT, 'map4');
		Loader.addResource('maps/map5.json', ResourceType.TEXT, 'map5');
		Loader.addResource('maps/map6.json', ResourceType.TEXT, 'map6');
		Loader.addResource('maps/map7.json', ResourceType.TEXT, 'map7');
		Loader.addResource('maps/map8.json', ResourceType.TEXT, 'map8');
		Loader.addResource('maps/endmap.json', ResourceType.TEXT, 'endmap');

		Loader.addResource('img/item.png', ResourceType.IMAGE, 'item');
		Loader.addResource('img/itemInverted.png', ResourceType.IMAGE, 'itemInverted');

		Loader.addResource('img/pic.png', ResourceType.IMAGE, 'pic');
		Loader.addResource('img/picInverted.png', ResourceType.IMAGE, 'picInverted');

		Loader.addResource('img/door.png', ResourceType.IMAGE, 'door');

		Loader.addResource('img/potion1.png', ResourceType.IMAGE, 'potion1');
		Loader.addResource('img/potion1inverted.png', ResourceType.IMAGE, 'potion1inverted');

		Loader.addResource('img/gate.png', ResourceType.IMAGE, 'gate');
		Loader.addResource('img/gateinverted.png', ResourceType.IMAGE, 'gateinverted');

		Loader.addResource('img/switch.png', ResourceType.IMAGE, 'switch');
		Loader.addResource('img/switchinverted.png', ResourceType.IMAGE, 'switchinverted');

		Loader.addResource('img/tile_topblue.png', ResourceType.IMAGE, 'topblue');
		Loader.addResource('img/tile_blue.png', ResourceType.IMAGE, 'blue');
		Loader.addResource('img/tile_invertedblue.png', ResourceType.IMAGE, 'invertedblue');
		Loader.addResource('img/tile_topgreen.png', ResourceType.IMAGE, 'topgreen');
		Loader.addResource('img/tile_green.png', ResourceType.IMAGE, 'green');
		Loader.addResource('img/tile_invertedgreen.png', ResourceType.IMAGE, 'invertedgreen');

		Loader.start( function() { new Main(); } );
	}
	
}