package entities;

import age.display.Entity;

class Potion extends Entity
{
	var _playerPU : Player; // celui qui ramasse
	var _playerAffected : Player; // celui qui se prend l'effet

	public function new(pX: Int, pY: Int, pInverted: Bool, pPlayerPU: Player, pPlayerAff: Player)
	{
		super(16, 16);

		x = pX;
		y = pY;

		_playerPU = pPlayerPU;
		_playerAffected = pPlayerAff;

		var img = pInverted ? "potion1inverted" : "potion1";
		addImage(img, img, true);
	}

	public override function update()
	{
		if(!dead && collidePoint(_playerPU.x + 11, _playerPU.y + 11))
		{
			_playerAffected.changeDirection();
			dead = true;
		}
		super.update();
	}

	public override function destroy()
	{
		_playerPU = null;
		_playerAffected = null;
		super.destroy();
	}
}