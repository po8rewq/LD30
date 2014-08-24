package entities;

import age.utils.Key;
import age.display.AnimatedEntity;
import age.core.Input;
import age.core.Global;
import age.utils.GamepadSupport;

import behaviors.KeyboardMovements;
import behaviors.MapCollisions;

class Player extends AnimatedEntity
{
	var _movements : KeyboardMovements;
	var _collisions : MapCollisions;

	var _direction : Int;

	public var idControls : Int; // identifiant des controles ; -1 => clavier

	public var gravity(default, null): Enums.Gravity;

	public var out : Bool;

	/**
	 * pX - pY : positions
	 * pID : 1 : haut / 2 : bas
	 */
	public function new(pX: Int, pY: Int, pGravity: Enums.Gravity, pAnim: String)
	{
		super(22, 22, pAnim, 2, 6);

		x = pX;
		y = pY;

		idControls = -1; // TODO
		out = false;

		gravity = pGravity;

		_movements = new KeyboardMovements(this, Enums.getGravity(gravity) );
		addBehavior("movements", _movements);
	}

	public override function update()
	{
		if(out) return;

		if(_collisions == null) _collisions = cast getBehavior("collisions");
		_collisions.setInitPos(x, y);

		// direction
		var currentDir = _movements.getDirection();
		if(currentDir != 0)
		{
			_direction = currentDir;
			mirror = _direction == -1;
		}

		_pauseAnim = !_movements.isMoving();

		super.update();
	}

	public function isMovingLeft():Bool
    {
        if(idControls == -1) return Input.check(Key.LEFT);
        return GamepadSupport.direction(idControls, GamePadAxes.LEFT);
    }

    public function isMovingRight():Bool
    {
        if(idControls == -1) return Input.check(Key.RIGHT);
        return GamepadSupport.direction(idControls, GamePadAxes.RIGHT);
    }

    public function isJumping():Bool
    {
        if(idControls == -1) return Input.check(Key.UP);
        return GamepadSupport.pressed(idControls, Key.GAMEPAD_A);
    }

}