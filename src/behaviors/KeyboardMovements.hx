package behaviors;

import age.core.Input;
import age.display.Entity;
import age.utils.Key;
import age.utils.GamepadSupport;

// caca
import entities.Player;

class KeyboardMovements extends BasicMovements
{	
	var _gravity : Float;

    var _frictionX : Float;
    var _frictionY : Float; // friction when colliding a wall

	var _maxSpeed : Int;
	var _walkSpeed : Int;
	var _jumpSpeed : Int;

	var _hero : Player;

	public function new(pEntity: Entity, ?pGravity: Int = 1)
	{
		super(pEntity);

		_gravity = 0.8 * pGravity;

		_walkSpeed = 1;
		_jumpSpeed = 7 * pGravity;
		_maxSpeed = 3;

        _frictionX = 0.8;
        _frictionY = 0.99; // pas utilisé

        _hero = cast pEntity;
	}
	
	public override function update():Void
	{
		// gestion des déplacements
		var directionX = 0;
		if( _hero.isMovingLeft() )
            directionX = -1;
		else if( _hero.isMovingRight() )
            directionX = 1;
        _dir = directionX;

        // gestion du saut
		if( canJump && _hero.isJumping() )
		{
			velocityY -= _jumpSpeed;
			canJump = false;
		}

        if(directionX != 0)
            velocityX += _walkSpeed * directionX;

        if( Math.abs(velocityX) > _maxSpeed )
            velocityX = _maxSpeed * directionX;

        if( Math.abs(velocityY) > Math.abs(_jumpSpeed) )
        	velocityY = _jumpSpeed * _gravity;

        velocityX *= _frictionX;
        velocityY += _gravity;

        // gestion des tirs

		super.update();
	}

    var _dir : Int;
    public function getDirection():Int
    {
        return _dir;
    }

    public function isMoving():Bool
    {
    	return Math.round(velocityX) != 0;
    }

    public override function onMapCollisions(pSide: Map<String, Bool>)
    {

    }

}