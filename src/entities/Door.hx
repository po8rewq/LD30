package entities;

import age.display.Entity;

class Door extends Entity
{
	private var _state : DoorState;
	private var _map : TiledMap;

	public function new(pMap: TiledMap)
	{
		super(32, 32);

		x = pMap.door.x;
		y = pMap.door.y;

		_map = pMap;

		close();

		addImage("door", "door", true);
	}

	public function open()
	{
		if(_state == DoorState.OPENED) return;

		_state = DoorState.OPENED;
		visible = true;

		_map.removeTileAt( Math.round(_map.door.x / _map.tileSize), Math.round(_map.door.y / _map.tileSize ) );
		_map.removeTileAt( Math.round(_map.door.x / _map.tileSize) + 1, Math.round(_map.door.y / _map.tileSize ) );
		_map.removeTileAt( Math.round(_map.door.x / _map.tileSize), Math.round(_map.door.y / _map.tileSize ) + 1 );
		_map.removeTileAt( Math.round(_map.door.x / _map.tileSize) + 1, Math.round(_map.door.y / _map.tileSize ) + 1 );
	}

	public function close()
	{
		_state = DoorState.CLOSED;
		visible = false;
	}
}

enum DoorState {
	OPENED;
	CLOSED;
}