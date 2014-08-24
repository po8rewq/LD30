package entities;

import age.display.Entity;

class Gate extends Entity
{
	public var id(default, null): Int;

	public var col(default, null) : Int;
	public var line(default, null) : Int;

	public var state(default, null) : GateState;

	public function new(pX: Int, pY: Int, pId: Int, pInverted:Bool, ?pDefaultState:GateState = null)
	{
		super(16, 32);

		id = pId;

		x = pX;
		y = pY;

//		state = pDefaultState == null ? GateState.CLOSED : pDefaultState;
		if(pDefaultState == null || pDefaultState == GateState.CLOSED) close();
		else open();

		col = Math.round(pX / 16);
		line = Math.round(pY / 16);

		var img = pInverted ? "gateinverted" : "gate";
		addImage(img, img, true);
	}

	public function open()
	{
		state = GateState.OPENED;
		visible = false;
	}

	public function close()
	{
		state = GateState.CLOSED;
		visible = true;
	}

}

enum GateState {
	OPENED;
	CLOSED;
}