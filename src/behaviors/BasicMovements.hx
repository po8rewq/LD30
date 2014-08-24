package behaviors;

import age.core.IBehavior;
import age.display.Entity;

class BasicMovements implements IBehavior
{	
	public var velocityX : Float;
	public var velocityY : Float;

	public var canJump : Bool;

	public var activated : Bool;
	public var entity : Entity;

	public function new(pEntity: Entity)
	{
		activated = true;
		entity = pEntity;

		velocityX = 0;
		velocityY = 0;

		canJump = true;
	}

	public function update()
	{
		entity.y = Math.round(entity.y + velocityY);
		entity.x = Math.round(entity.x + velocityX);
	}

	/**
     * Called each frame
     * pSide : List of sides
     **/
    public function onMapCollisions(pSide: Map<String, Bool>)
    {

    }

	public function destroy()
	{
		entity = null;
	}

}