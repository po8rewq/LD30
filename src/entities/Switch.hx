package entities;

import age.display.Entity;

import entities.Gate;
import behaviors.OpenGateBehavior;

class Switch extends Entity
{
	var _opengate : OpenGateBehavior;
	var _player : Player;
	var _state : SwitchState;

	public function new(pX: Int, pY: Int, pInverted: Bool, pPlayer: Player, pMap: TiledMap)
	{
		super(32, 32);

		_player = pPlayer;
		_state = SwitchState.ACTIVE;

		x = pX;
		y = pY;

		var img = pInverted ? "switchinverted" : "switch";
		addImage(img, img, true);

		_opengate = new OpenGateBehavior(this, pMap);
		addBehavior("opengate", _opengate);
	}

	public function addGate(pGate: Gate)
	{
		_opengate.addGate(pGate);
	}

	public override function update()
	{
		if(_state == SwitchState.ACTIVE)
		{
			if( collidePoint(_player.x + 11, _player.y + 11) )
			{
				_state = SwitchState.UNAVAILABLE;
				_opengate.active();
			}
		}
		else if(_state == SwitchState.UNAVAILABLE)
		{
			if( !collidePoint(_player.x + 11, _player.y + 11) )
			{
				_state = SwitchState.ACTIVE;
			}
		}

		super.update();
	}

	public override function destroy()
	{
		_player = null;
		super.destroy();
	}
}

enum SwitchState {
	ACTIVE;
	UNAVAILABLE;
}