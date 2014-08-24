package managers;

import entities.Item;
import entities.Pic;

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

    var items : Array<Item>;
    var pics : Array<Pic>;
    var ctr : EntityContainer;

    private function new() {}

    public function init(pContainer: EntityContainer)
    {
    	ctr = pContainer;
    	items = new Array();
    	pics = new Array();
    }

    public function addItem(pItem: Item)
    {
    	items.push(pItem);
    	// add to container
    	ctr.add(pItem);
    }

    public function getItemsCount():Int
    {
    	if(items == null) return 0;
    	return items.length;
    }

    public function checkCollisionsWithItems(pPlayer1: Entity, pPlayer2: Entity)
    {
    	for(item in items)
    	{
    		if( pPlayer1.collideEntity(item) || pPlayer2.collideEntity(item) )
    		{
    			ctr.remove(item);
    			items.remove(item);
    		}
    	}
    }

    /**
     * Return true if collide with pics
     */
    public function checkCollisionsWithPics(pPlayer1: Entity, pPlayer2: Entity):Bool
    {
    	for(pic in pics)
    	{
    		if(pic.inverted) // alors player 2 only
    		{
    			if( pPlayer2.x + 11 >= pic.x && pPlayer2.x + 11 <= pic.x + pic.width && pPlayer2.y <= pic.y )
    				return true;
    		}
    		else
    		{
    			if( pPlayer1.x + 11 >= pic.x && pPlayer1.x + 11 <= pic.x + pic.width && pPlayer1.y + pPlayer1.height  >= pic.y + pic.height - 1)
    				return true;
    		}
    	}
    	return false;
    }

    public function addPic(pPic: Pic)
    {
    	pics.push(pPic);
    	ctr.add(pPic);
    }

    public function getPicsCount():Int
    {
    	if(pics == null) return 0;
    	return pics.length;
    }

    public function reset()
    {
    	ctr.destroy();
    	items = new Array();
    	pics = new Array();
    }

}