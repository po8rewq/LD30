package behaviors;

import age.core.IBehavior;
import age.display.Entity;

import entities.Gate;

class OpenGateBehavior implements IBehavior
{
	public var activated : Bool;
	public var entity : Entity;

	var _gates : Array<Gate>;
	var _map : TiledMap;

	public function new(pEntity: Entity, pMap: TiledMap)
	{
		activated = true;
		entity = pEntity;
		_map = pMap;
		_gates = new Array();
	}

	public function addGate(pGate: Gate)
	{
		_gates.push(pGate);
	}

	public function active()
	{
		for(gate in _gates)
		{
			if(gate.state == GateState.CLOSED)
			{
				_map.removeTileAt(gate.col, gate.line);
				_map.removeTileAt(gate.col, gate.line + 1);
				gate.open();
			}
			else
			{
				_map.addFakeTileAt(gate.col, gate.line);
				_map.addFakeTileAt(gate.col, gate.line + 1);
				gate.close();
			}
		}
	}

	public function update()
	{

	}

	public function destroy()
	{
		entity = null;
		_gates = new Array();
	}
}