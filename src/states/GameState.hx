package states;

import age.display.State;
import age.core.Global;
import age.display.EntityContainer;

import entities.Player;
import entities.Item;
import entities.Door;
import entities.Pic;
import managers.ItemsManager;
import managers.UiManager;

class GameState extends State
{
	// jeu en pause
	var _paused : Bool;

	var _player1 : Player;
	var _player2 : Player;

	var _level : Array<Int>;
	var _map : TiledMap;

	var _door : Door;

	var _itemsManager : ItemsManager;
	var _uiManager : UiManager;

	var _gameContainer : EntityContainer;
	var _uiContainer : EntityContainer;

	var _currentLevel : Int;

    public function new()
    {
        _paused = true;

        super();
    }

    public override function create()
    {
    	_currentLevel = 0;
    	LevelData.init();

    	_gameContainer = new EntityContainer();
    	add(_gameContainer);

    	// initialisation du container
    	var itemsContainer = new EntityContainer();
		_itemsManager = ItemsManager.getInstance();
		_itemsManager.init(itemsContainer);
		add(itemsContainer);

    	_uiManager = UiManager.getInstance();
    	add(_uiManager.container);

    	// _uiManager.addText("You're controlling two connected lovers. Collect all hearts to open the gate to the next world.", loadNextLevel);
    	loadNextLevel();
    }

    function startLevel()
    {
		// -- items creation
		var item : Item;
		for(i in _map.boxesSpots)
		{
			item = new Item(i.x, i.y, i.inverted);
			_itemsManager.addItem(item);
		}
		// -- end items creation

    	_player1 = new Player(_map.player1.x, _map.player1.y, Enums.Gravity.NORMAL, "player1");
        _map.registerCollisions(_player1);
		_gameContainer.add(_player1);

		_player2 = new Player(_map.player2.x, _map.player2.y, Enums.Gravity.INVERTED, "player2");
        _map.registerCollisions(_player2);
		_gameContainer.add(_player2);

		_door = new Door(_map);
		_gameContainer.add(_door);

    	_paused = false;
    }

    private function loadNextLevel(?pForceText: String = "")
    {
    	_currentLevel++;
    	var level : Dynamic = LevelData.get(_currentLevel);

    	if(level == null)
    	{
    		_uiManager.addText("Good Job !! You've finished the game !", null);
    	}
    	else
    	{
	    	_uiManager.addText(pForceText == "" ? level.text : pForceText, startLevel);

	    	_map = new TiledMap(level.file, 16);
			_gameContainer.add(_map);

			// -- pics
			var pic : Pic;
			for(p in _map.picsSpots)
			{
				pic = new Pic(p.x, p.y, p.inverted);
				_itemsManager.addPic(pic);
			}
			// -- end pics
		}
    }

    public override function update()
    {
    	if(!_paused)
    	{
    		if( _player1.x <= - _player1.width || _player1.x + _player1.width >= 800 + _player1.width 
    			|| _player2.x <= - _player2.width || _player2.x + _player2.width >= 800 + _player2.width)
    			restartLevel("Don't try to escape this world !");

	    	// check items to open the door
	    	if(_itemsManager.getItemsCount()>0)
	    		_itemsManager.checkCollisionsWithItems(_player1, _player2);
	    	else 
	    		_door.open();

	    	if(_itemsManager.getPicsCount() > 0)
	    		if( _itemsManager.checkCollisionsWithPics(_player1, _player2) )
	    			restartLevel("You just killed one lover ... try again, but be careful this time ;)");

	    	// check end level
	    	if(_door.collidePoint(_player1.x + 11, _player1.y + 2) ) 
	    	{
	    		// remove(_player1);
	    		_player1.out = true;
	    		_player1.visible = false;
	    	}
	    	if(_door.collidePoint(_player2.x + 11, _player2.y + 20) ) 
	    	{
	    		// remove(_player2);
	    		_player2.out = true;
	    		_player2.visible = false;
	    	}

	    	if(_player1.out && _player2.out)
	    	{
	    		_paused = true;
	    		clearLevel();

	    		loadNextLevel();
	    	}
	    	super.update();
	    }

    	_uiManager.update();
    }

    function restartLevel(pForceText: String)
    {
    	_paused = true;
    	_currentLevel--;
    	clearLevel();
    	loadNextLevel(pForceText);
    }

    function clearLevel()
    {
    	_itemsManager.reset();

    	_map.destroy();
    	
    	_gameContainer.destroy();
    }

}