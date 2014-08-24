package managers;

import entities.Item;
import entities.Pic;
import entities.Switch;
import entities.Player;
import entities.Gate;
import entities.Potion;

import age.display.EntityContainer;
import age.display.Entity;

class ItemsManager
{
	static var _instance : ItemsManager;

	public static function getInstance(): ItemsManager
    {
        if(_instance == null) _instance = new ItemsManager();
        return _instance;
    }

    var _items : Array<Item>;
    var _pics : Array<Pic>;
    var _switchs : Array<Switch>;
    var _gates : Array<Gate>;
    var _potions : Array<Potion>;
    var ctr : EntityContainer;

    private function new() {}

    public function init(pContainer: EntityContainer)
    {
    	ctr = pContainer;

    	_items = new Array();
    	_pics = new Array();
    	_potions = new Array();
    	_gates = new Array();
    	_switchs = new Array();
    }

    public function addItem(pItem: Item)
    {
    	_items.push(pItem);
    	// add to container
    	ctr.add(pItem);
    }

    public function getItemsCount():Int
    {
    	if(_items == null) return 0;
    	return _items.length;
    }

    public function checkCollisionsWithItems(pPlayer1: Entity, pPlayer2: Entity)
    {
    	for(item in _items)
    	{
    		if( pPlayer1.collideEntity(item) || pPlayer2.collideEntity(item) )
    		{
    			ctr.remove(item);
    			_items.remove(item);
    		}
    	}
    }

    /**
     * Return true if collide with pics
     */
    public function checkCollisionsWithPics(pPlayer1: Entity, pPlayer2: Entity):Bool
    {
    	for(pic in _pics)
    	{
    		if(pic.inverted) // alors player 2 only
    		{
    			if(pic.position == Position.BOTTOM && pPlayer2.x + 11 >= pic.x && pPlayer2.x + 11 <= pic.x + pic.width && pPlayer2.y <= pic.y )
    				return true;
    			else if(pic.position == Position.TOP && pPlayer2.x + 11 >= pic.x && pPlayer2.x + 11 <= pic.x + pic.width && pPlayer2.y + pPlayer2.height  >= pic.y + pic.height - 1)
    				return true;
    		}
    		else
    		{
    			if(pic.position == Position.BOTTOM && pPlayer1.x + 11 >= pic.x && pPlayer1.x + 11 <= pic.x + pic.width && pPlayer1.y + pPlayer1.height  >= pic.y + pic.height - 1)
    				return true;
    			else if(pic.position == Position.TOP && pPlayer1.x + 11 >= pic.x && pPlayer1.x + 11 <= pic.x + pic.width && pPlayer1.y <= pic.y)
    				return true;
    		}
    	}
    	return false;
    }

    public function addPic(pPic: Pic)
    {
    	_pics.push(pPic);
    	ctr.add(pPic);
    }

    public function getPicsCount():Int
    {
    	if(_pics == null) return 0;
    	return _pics.length;
    }

    public function addSwitchs(pMap: TiledMap, pPlayer1: Player, pPlayer2: Player)
    {
    	// créa des gates
    	var gate:Gate;
    	for(g in pMap.gates)
    	{
    		gate = new Gate(g.x, g.y, g.id, g.inverted, g.visible ? GateState.CLOSED : GateState.OPENED);
    		_gates.push(gate);
    		ctr.add(gate);
    	}

    	var swi:Switch;
    	for(s in pMap.switchs)
    	{
    		// recuperation de la porte associée
    		swi = new Switch(s.x, s.y, s.inverted, s.inverted ? pPlayer2 : pPlayer1, pMap);
    		for(g in _gates)
    			if(g.id == s.id)
    				swi.addGate(g);
    		
    		_switchs.push(swi);
    		ctr.add(swi);
		}
    }

    public function addPotions(pPotions: Array<Dynamic>, pPlayer1: Player, pPlayer2: Player)
    {
    	for(p in pPotions)
    	{
    		ctr.add( new Potion(p.x, p.y, p.inverted, p.inverted ? pPlayer2 : pPlayer1, !p.inverted ? pPlayer2 : pPlayer1) ); // l'effet s'applique sur l'autre
    	}
    }

    public function reset()
    {
    	ctr.destroy();
    	_items = new Array();
    	_pics = new Array();
    	_switchs = new Array();
    	_gates = new Array();
    }

}