package behaviors;

import age.core.IBehavior;
import age.display.Entity;

/**
 * cf http://www.emanueleferonato.com/2008/06/22/step-by-step-as3-translation-of-creation-of-a-platform-game-with-flash-step-15/
 */
class MapCollisions implements IBehavior
{	
	public var activated : Bool;
	public var entity : Entity;

    // map data
	var _map : Array<Int>;
    var _tileSize : Int;
    var _mapWidth : Int;

	// positions avant déplacement
	var previousX : Int;
	var previousY : Int;

	var forecast_x : Int;
	var forecast_y : Int;

	// données autres
	var downy : Int;
	var upy : Int;
	var rightx : Int;
	var leftx : Int;

	var downleft : Int;
    var downright : Int;
    var upright : Int;
    var upleft : Int;

    var downC : Bool;
    var leftC : Bool;
    var upC : Bool;
    var rightC : Bool;

    var collisions : Map<String, Bool>;

    //
    var mvt : BasicMovements;

    //
    var gravity : Enums.Gravity;


	public function new(pEntity: Entity, pData: Array<Int>, pMapWidth: Int, pTileSize: Int, pGravity: Enums.Gravity)
	{
		activated = true;
		entity = pEntity;

        gravity = pGravity;

		_map = pData;
        _mapWidth = pMapWidth;
        _tileSize = pTileSize;

		mvt = cast entity.getBehavior("movements");

        // init collisions
        collisions = new Map();
	}

	public function setInitPos(pX: Int, pY: Int)
	{
		previousX = pX;
		previousY = pY;
	}

	public function update():Void
	{
        collisions.set("left", false);
        collisions.set("right", false);
        collisions.set("top", false);
        collisions.set("bottom",false);

		forecast_x = entity.x;
		forecast_y = entity.y;
		
		if(forecast_x == previousX && forecast_y == previousY) return;

		get_corners(forecast_x, forecast_y);
		if(downleft > 0)
		{
            get_corners(previousX, forecast_y);
            downC = downleft > 0;

            get_corners(forecast_x, previousY);            
            leftC = downleft > 0;
            
            if(leftC && downC)
            {
                forecast_x = (leftx+1) * _tileSize;
                forecast_y = (downy+1) * _tileSize - entity.height - 1;
           		mvt.velocityY = 0;

                collisions.set("left", true);
                collisions.set("bottom", true);
            }
            else if(leftC)
            {
            	forecast_x = (leftx+1) * _tileSize;

                collisions.set("left", true);
            }
            else if(downC)
            {
                forecast_y = (downy+1) * _tileSize - entity.height - 1;
            	mvt.velocityY = 0;

                collisions.set("bottom", true);
            }
            else if(previousX > forecast_x && previousY < forecast_y) // seulement si va vers bas gauche
            {
                forecast_x = (leftx+1) * _tileSize;
                mvt.velocityX = 0;

                collisions.set("left", true);
            }
        }

        get_corners(forecast_x,forecast_y);
        if(downright > 0)
        {
            get_corners(previousX, forecast_y);
            downC = downright > 0;

            get_corners(forecast_x, previousY);
            rightC = downright > 0;
            
            if(rightC && downC)
            {
            	forecast_x = rightx * _tileSize - entity.width - 1;
                forecast_y = (downy+1) * _tileSize - entity.height - 1;
                mvt.velocityY = 0;

                collisions.set("right", true);
                collisions.set("bottom", true);
            }
            else if(rightC)
            {
                forecast_x = rightx * _tileSize - entity.width - 1;

                collisions.set("right", true);
            }
            else if(downC)
            {
                forecast_y = (downy+1) * _tileSize - entity.height - 1;
                mvt.velocityY = 0;

                collisions.set("bottom", true);
            }
            else if(previousX < forecast_x && previousY < forecast_y) // seulement si va vers bas droite
            {
                forecast_x = rightx * _tileSize - entity.width - 1;
                mvt.velocityX = 0;

                collisions.set("right", true);
            }
        }

        get_corners(forecast_x, forecast_y);            
        if(upleft > 0)
        {
            get_corners(previousX, forecast_y);
            upC = upleft > 0;

            get_corners(forecast_x, previousY);
            leftC = upleft > 0;

            if(leftC && upC)
            {
                forecast_x = (leftx+1) * _tileSize;
                forecast_y = (upy) * _tileSize;
                mvt.velocityY = 0;

                collisions.set("top", true);
                collisions.set("left", true);
            }
            else if(leftC)
            {
                forecast_x = (leftx+1) * _tileSize;

                collisions.set("left", true);
            }
            else if(upC)
            {
                forecast_y = (upy) * _tileSize;
                mvt.velocityY  = 0;

                collisions.set("top", true);
            }
            else if(previousX > forecast_x && previousY > forecast_y) // seulement si haut gauche
            {
                forecast_x = (leftx+1) * _tileSize;
                mvt.velocityX = 0;

                collisions.set("left", true);
            }
        }
            
        get_corners(forecast_x, forecast_y);            
        if(upright > 0)
        {
            get_corners(previousX, forecast_y);
            upC = upright > 0;

            get_corners(forecast_x, previousY);
            rightC = upright > 0;

            if(rightC && upC)
            {
                forecast_x = rightx * _tileSize - entity.width - 1;
                forecast_y = (upy) * _tileSize;
                mvt.velocityY = 0;

                collisions.set("right", true);
                collisions.set("top", true);
            }
            else if(rightC)
            {
                forecast_x = rightx * _tileSize - entity.width - 1;

                collisions.set("right", true);
            }
            else if(upC)
            {
                forecast_y = (upy) * _tileSize;
                mvt.velocityY = 0;

                collisions.set("top", true);
            }
            else if(previousX < forecast_x && previousY > forecast_y) // seulement si haut droite
            {
                forecast_x = rightx * _tileSize - entity.width - 1;
                mvt.velocityX = 0;

                collisions.set("right", true);
            }
        }

        // TODO si perso plus grand que cellule

        entity.x = forecast_x;
        entity.y = forecast_y;

        if(gravity == Enums.Gravity.INVERTED) 
            check_ground_invertedGravity();
        else
            check_ground_normalGravity();
        
        if(collisions.get("left") ||
           collisions.get("right") ||
           collisions.get("top") ||
           collisions.get("bottom"))
            mvt.onMapCollisions(collisions);
	}

	private function get_corners(point_x, point_y)
	{
        //get the position of the four corners of the hero
        downy = Math.round( ( point_y + entity.height - _tileSize/2) / _tileSize);
        upy = Math.round((point_y - _tileSize/2) / _tileSize);
        rightx = Math.round( ( point_x + entity.width - _tileSize/2 ) / _tileSize );
        leftx = Math.round( ( point_x - _tileSize/2 ) / _tileSize );
            
        /*
            Looks in wich tiles these four point are.
            *Attention* TILES and not pixel!
            
            Will be used to get the position of the corners
            and to get the end position of the hero.
        */
            
        downleft = getCell(leftx, downy);
        downright = getCell(rightx, downy);
        upright = getCell(rightx, upy);
        upleft = getCell(leftx, upy);
            
        /*
            Gets the sort tile the position of the corners has.
            One means there can be collision, zero is air.            
        */
    }

    public function getCell(pX: Int, pY: Int): Int
    {
        return _map[pX + pY * _mapWidth];
    }

    /**
     * Check if the entity is on the ground on a normal gravity
     **/
    public function check_ground_normalGravity()
    {
        downy = Math.round((entity.y + entity.height + 1 - _tileSize/2) / _tileSize);
        rightx = Math.round((entity.x + entity.width - _tileSize/2) / _tileSize);
        leftx = Math.round((entity.x - _tileSize/2) / _tileSize);
        // Makes three points in tile-coordinates

        downleft = getCell(leftx, downy);
        downright = getCell(rightx, downy);
        //Checks the sort

        //if there is any collision by the hero's feet
        if(downleft > 0 || downright > 0)
        {   //than can jump
            mvt.canJump = true;
            collisions.set("bottom", true);
        }
        else
        {	//else not
            mvt.canJump = false;
        }
    }

    /**
     * Check ground if inverted gravity
     */
    public function check_ground_invertedGravity()
    {
        upy = Math.round((entity.y - 1 - _tileSize/2) / _tileSize);
        rightx = Math.round((entity.x + entity.width - _tileSize/2) / _tileSize);
        leftx = Math.round((entity.x - _tileSize/2) / _tileSize);
        // Makes three points in tile-coordinates

        upright = getCell(rightx, upy);
        upleft = getCell(leftx, upy);
        //Checks the sort

        //if there is any collision by the hero's feet
        if(upright > 0 || upleft > 0)
        {   //than can jump
            mvt.canJump = true;
            collisions.set("top", true);
        }
        else
        {   //trace(upright + " - " + upleft);
            mvt.canJump = false;
        }
    }

	public function destroy():Void
	{
		entity = null;
	}

}