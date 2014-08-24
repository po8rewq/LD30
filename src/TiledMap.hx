package ;

import behaviors.MapCollisions;

import entities.Tile;
import entities.Player;

import age.display.EntityContainer;
import age.display.Entity;
import age.Assets;
import age.geom.Point2D;

import haxe.Json;

class TiledMap extends EntityContainer
{
    var _mapData : Array<Int>;
    var _mapWidth : Int;
    var _mapHeight : Int;
    public var tileSize : Int;

    public var boxesSpots(default, null) : Array<Dynamic>;
    public var picsSpots(default, null) : Array<Dynamic>;
    public var switchs(default, null) : Array<Dynamic>;
    public var gates(default, null) : Array<Dynamic>;
    public var potions(default, null) : Array<Dynamic>;

    public var player1 : Dynamic;
    public var player2 : Dynamic;

    public var door : Point2D;

    /**
     * @param pFile : the json file from Tiled
     * @param pCellSize : if we want to override the cell size, if null, take the size from tiled
     **/
    public function new(pFile: String, ?pCellSize : Int = 0)
    {
        super();

        var json = Json.parse(Assets.getText(pFile));
        _mapWidth = Reflect.field(json, "width");
        _mapHeight = Reflect.field(json, "height");

        if(pCellSize > 0)
            tileSize = pCellSize;
        else
            tileSize = Reflect.field(json, "tilewidth");

        // TODO: faire ça plus proprement
        _mapData = Reflect.field(json, "layers")[0].data; 

        // init Map
        for(y in 0..._mapHeight)
        {
            for(x in 0..._mapWidth)
            {
                var cell = _mapData[x + y * _mapWidth];
                if( cell > 0)
                {
                    add( new Tile(x, y, tileSize, cell) );
                }
            }
        }

        // Récupération des points de spawn
        boxesSpots = new Array();
        picsSpots = new Array();
        potions = new Array();
        switchs = new Array();
        gates = new Array();

        var spawnData : Array<Dynamic> = Reflect.field(json, "layers")[1].objects;
        for(spawn in spawnData)
        {
            if(spawn.name == "item")
            {
                boxesSpots.push({
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    inverted: spawn.type == "inverted"
                });
            }
            else if(spawn.name == "pic")
            {
                picsSpots.push({
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    position: spawn.properties.position,
                    inverted: spawn.type == "inverted"
                });
            }
            else if(spawn.name == "P1")
            {
                player1 = {
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    inverted: spawn.type == "inverted"
                };
            }
            else if(spawn.name == "P2")
            {
                player2 = {
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    inverted: spawn.type == "inverted"
                };
            }
            else if(spawn.name == "door")
            {
                door = {
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y)
                };
            }
            else if(spawn.name == "gate")
            {
                gates.push({
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    id: spawn.properties.id,
                    inverted: spawn.type == "inverted",
                    visible: spawn.properties.visible == null || spawn.properties.visible == "true"
                });
            }
            else if(spawn.name == "switch")
            {
                switchs.push({
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    inverted: spawn.type == "inverted",
                    id: spawn.properties.id
                });
            }
            else if(spawn.name == "potion")
            {
                potions.push({
                    x: Math.round(spawn.x), 
                    y: Math.round(spawn.y),
                    inverted: spawn.type == "inverted"
                });
            }
        }
    }

    public function registerCollisions(pEntity: Player)
    {
        pEntity.addBehavior( "collisions", new MapCollisions(pEntity, _mapData, _mapWidth, tileSize, pEntity.gravity ) );
    }

    public function getData(): Array<Int>
    {
        return _mapData;
    }

    public function addFakeTileAt(pX: Int, pY: Int)
    {
        _mapData[pY * _mapWidth + pX] = 1;
    }

    /**
     * remove a tile at a given coordinates
     */
    public function removeTileAt(pX: Int, pY: Int)
    {
        var tile : Tile;
        for(i in _entities)
        {
            tile = cast(i, Tile);
            if(tile.col == pX && tile.lin == pY)
            {
                remove(i);
                break;
            }
        }

        _mapData[pY * _mapWidth + pX] = 0;
    }

}