package managers;

import age.display.EntityContainer;
import age.display.ui.Rect;
import age.display.text.BasicText;
import age.display.text.TextAlignEnum.TextAlign;
import age.core.Input;

class UiManager 
{
	
	static var _instance : UiManager;

	public static function getInstance(): UiManager
    {
        if(_instance == null) _instance = new UiManager();
        return _instance;
    }

    public var container : EntityContainer;
    public var container2 : EntityContainer;

    var _background : Rect;
    var _text : BasicText;
    var _instructions : BasicText;

    var _isActive : Bool;
    var _cback : Void->Void;

    private function new()
    {
    	container = new EntityContainer();

    	_background = new Rect(0, 240, 800, 80, "#000", 0.5);
    	container.add( _background );

    	_instructions = new BasicText("[SPACE] to continue", 795, 290);
    	_instructions.setStyle(Main.DEFAULT_FONT, 25, "#FFF", false, TextAlign.RIGHT);
    	container.add(_instructions);

    	_text = new BasicText(" ", 400, _background.y + 10, 790);
    	_text.setStyle(Main.DEFAULT_FONT, 25, "#FFF", false, TextAlign.CENTER);
    	container.add(_text);

    	_isActive = false;

        // -- in game instructions --
        container2 = new EntityContainer(); container2.visible = false;
        container2.add( new Rect(695, 0, 105, 28, "#000", 0.5) );

        var txt = new BasicText("[ESC] to restart", 795, 5);
        txt.setStyle(Main.DEFAULT_FONT, 19, "#FFF", false, TextAlign.RIGHT);
        container2.add(txt);
    }

    public function addText(pText: String, pCallback: Void->Void)
    {
    	_text.text = pText;
    	_cback = pCallback;
    	_isActive = true;
    	container.visible = true;
        container2.visible = false;

    	if(_cback == null) // meaning that's the last level
    		_instructions.text = "[F5] to restart";
    }

    public function update()
    {
    	if( !_isActive || _cback == null ) return;

    	if(Input.released(age.utils.Key.SPACE))
    	{
    		_isActive = false;
    		container.visible = false;
            container2.visible = true;
    		_cback();
    	}
    }

}