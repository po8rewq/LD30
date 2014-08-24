(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Enums = function() { };
Enums.__name__ = true;
Enums.getGravity = function(pGravity) {
	switch(pGravity[1]) {
	case 0:
		return 1;
	case 1:
		return -1;
	}
};
var Gravity = { __ename__ : true, __constructs__ : ["NORMAL","INVERTED"] };
Gravity.NORMAL = ["NORMAL",0];
Gravity.NORMAL.__enum__ = Gravity;
Gravity.INVERTED = ["INVERTED",1];
Gravity.INVERTED.__enum__ = Gravity;
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var LevelData = function() { };
LevelData.__name__ = true;
LevelData.init = function() {
	LevelData.levels = new Array();
	LevelData.levels.push({ file : "map1", text : "You're controlling two connected lovers. Collect all the hearts to open the portal."});
	LevelData.levels.push({ file : "map2", text : "You can jump by pressing [UP]"});
	LevelData.levels.push({ file : "map3", text : "Be careful not to fall into the traps!"});
	LevelData.levels.push({ file : "map5", text : "Love is so powerful that the lovers are connected even worlds apart."});
	LevelData.levels.push({ file : "map4", text : "This switch seems to open/close the gate in the other world"});
	LevelData.levels.push({ file : "map6", text : "Their love is more powerful than their fear..."});
	LevelData.levels.push({ file : "map7", text : "She must be here to help him overcome all obstacles."});
	LevelData.levels.push({ file : "map8", text : "Don't choose the easy path by drinking a potion"});
	LevelData.levels.push({ file : "endmap", text : "But they found that worlds are finally connected"});
};
LevelData.get = function(pLevel) {
	return LevelData.levels[pLevel - 1];
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var age = {};
age.core = {};
age.core.Engine = function(pWidth,pHeight,pFirstState,pKeepRatio,pFps,pBgColor,pDivContainer) {
	if(pDivContainer == null) pDivContainer = "";
	if(pBgColor == null) pBgColor = "";
	if(pFps == null) pFps = 30;
	if(pKeepRatio == null) pKeepRatio = true;
	age.core.Global.engine = this;
	this._backgroundColor = pBgColor;
	this.stageWidth = pWidth;
	this.stageHeight = pHeight;
	this._fps = pFps;
	this._last = haxe.Timer.stamp() * 1000;
	this._delta = 0;
	this._stepRate = 1000 / this._fps;
	var doc = window.document;
	var container = null;
	this._canvas = doc.createElement("Canvas");
	this._context = this._canvas.getContext("2d");
	if(pDivContainer != "") container = doc.getElementById(pDivContainer); else container = doc.body;
	container.appendChild(this._canvas);
	this._offScreenCanvas = doc.createElement("Canvas");
	this._offScreenContext = this._offScreenCanvas.getContext("2d");
	this._canvas.width = this._offScreenCanvas.width = pWidth;
	this._canvas.height = this._offScreenCanvas.height = pHeight;
	if(pKeepRatio) this._canvas.style.imageRendering = "-webkit-optimize-contrast";
	new age.core.Input(this._canvas);
	this.switchState(pFirstState);
	var requestAnimFrame = age.utils.HtmlUtils.loadExtension("requestAnimationFrame");
	if(requestAnimFrame != null) {
		this._animFunction = requestAnimFrame.value;
		this.mainLoop();
	} else {
		console.log("No requestAnimationFrame support, falling back to setInterval");
		var frequency = this._stepRate | 0;
		this._globalTimer = new haxe.Timer(frequency);
		this._globalTimer.run = $bind(this,this.mainLoop);
	}
	this.mainLoop();
	window.onresize = $bind(this,this.onResizeEvent);
	this.onResizeEvent(null);
};
age.core.Engine.__name__ = true;
age.core.Engine.prototype = {
	onResizeEvent: function(pEvt) {
		var scaleX = 1;
		var scaleY = 1;
		var scale = Math.min(scaleX,scaleY);
		var stgWidth = this.stageWidth * scale;
		var stgHeight = this.stageHeight * scale;
		this._canvas.style.width = (stgWidth == null?"null":"" + stgWidth) + "px";
		this._canvas.style.height = (stgHeight == null?"null":"" + stgHeight) + "px";
		this.stageScaleX = 1;
		this.stageScaleY = 1;
	}
	,switchState: function(pState) {
		if(age.core.Global.currentState != null) age.core.Global.currentState.destroy();
		pState.create();
		age.core.Global.currentState = pState;
	}
	,mainLoop: function() {
		var state = age.core.Global.currentState;
		var now = haxe.Timer.stamp() * 1000;
		age.core.Global.elapsed = (now - this._last) / 1000;
		this._delta += now - this._last;
		this._last = now;
		if(this._delta >= this._stepRate) {
			if(this._delta > 50) this._delta = this._stepRate;
			while(this._delta >= this._stepRate) {
				this._delta -= this._stepRate;
				state.update();
				if(this._backgroundColor != "") {
					this._offScreenContext.fillStyle = this._backgroundColor;
					this._offScreenContext.fillRect(0,0,this.stageWidth,this.stageHeight);
				} else this._offScreenContext.clearRect(0,0,this.stageWidth,this.stageHeight);
				age.core.Global.currentState.render(this._offScreenContext);
				this._context.clearRect(0,0,this.stageWidth,this.stageHeight);
				this._context.drawImage(this._offScreenCanvas,0,0);
			}
		}
		age.core.Input.update();
		if(this._animFunction != null) Reflect.callMethod(window,this._animFunction,[$bind(this,this.mainLoop)]);
	}
	,__class__: age.core.Engine
};
var Main = function() {
	age.core.Engine.call(this,800,320,new states.IntroState(),null,60,"#D0F4F7");
};
Main.__name__ = true;
Main.main = function() {
	age.Loader.addResource("img/animPlayer1.png",age.ResourceType.IMAGE,"player1");
	age.Loader.addResource("img/animPlayer2.png",age.ResourceType.IMAGE,"player2");
	age.Loader.addResource("img/animPlayer2inv.png",age.ResourceType.IMAGE,"player2inv");
	age.Loader.addResource("maps/map1.json",age.ResourceType.TEXT,"map1");
	age.Loader.addResource("maps/map2.json",age.ResourceType.TEXT,"map2");
	age.Loader.addResource("maps/map3.json",age.ResourceType.TEXT,"map3");
	age.Loader.addResource("maps/map4.json",age.ResourceType.TEXT,"map4");
	age.Loader.addResource("maps/map5.json",age.ResourceType.TEXT,"map5");
	age.Loader.addResource("maps/map6.json",age.ResourceType.TEXT,"map6");
	age.Loader.addResource("maps/map7.json",age.ResourceType.TEXT,"map7");
	age.Loader.addResource("maps/map8.json",age.ResourceType.TEXT,"map8");
	age.Loader.addResource("maps/endmap.json",age.ResourceType.TEXT,"endmap");
	age.Loader.addResource("img/item.png",age.ResourceType.IMAGE,"item");
	age.Loader.addResource("img/itemInverted.png",age.ResourceType.IMAGE,"itemInverted");
	age.Loader.addResource("img/pic.png",age.ResourceType.IMAGE,"pic");
	age.Loader.addResource("img/picInverted.png",age.ResourceType.IMAGE,"picInverted");
	age.Loader.addResource("img/door.png",age.ResourceType.IMAGE,"door");
	age.Loader.addResource("img/potion1.png",age.ResourceType.IMAGE,"potion1");
	age.Loader.addResource("img/potion1inverted.png",age.ResourceType.IMAGE,"potion1inverted");
	age.Loader.addResource("img/gate.png",age.ResourceType.IMAGE,"gate");
	age.Loader.addResource("img/gateinverted.png",age.ResourceType.IMAGE,"gateinverted");
	age.Loader.addResource("img/switch.png",age.ResourceType.IMAGE,"switch");
	age.Loader.addResource("img/switchinverted.png",age.ResourceType.IMAGE,"switchinverted");
	age.Loader.addResource("img/tile_topblue.png",age.ResourceType.IMAGE,"topblue");
	age.Loader.addResource("img/tile_blue.png",age.ResourceType.IMAGE,"blue");
	age.Loader.addResource("img/tile_invertedblue.png",age.ResourceType.IMAGE,"invertedblue");
	age.Loader.addResource("img/tile_topgreen.png",age.ResourceType.IMAGE,"topgreen");
	age.Loader.addResource("img/tile_green.png",age.ResourceType.IMAGE,"green");
	age.Loader.addResource("img/tile_invertedgreen.png",age.ResourceType.IMAGE,"invertedgreen");
	age.Loader.start(function() {
		new Main();
	});
};
Main.__super__ = age.core.Engine;
Main.prototype = $extend(age.core.Engine.prototype,{
	__class__: Main
});
var IMap = function() { };
IMap.__name__ = true;
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
age.core.IEntity = function() { };
age.core.IEntity.__name__ = true;
age.core.IEntity.prototype = {
	__class__: age.core.IEntity
};
age.display = {};
age.display.EntityContainer = function() {
	this._entities = new Array();
	this.visible = true;
	this.x = this.y = this.width = this.height = this.depth = 0;
};
age.display.EntityContainer.__name__ = true;
age.display.EntityContainer.__interfaces__ = [age.core.IEntity];
age.display.EntityContainer.prototype = {
	update: function() {
		var _g = 0;
		var _g1 = this._entities;
		while(_g < _g1.length) {
			var en = _g1[_g];
			++_g;
			en.update();
		}
	}
	,add: function(pEntity) {
		this._entities.push(pEntity);
	}
	,remove: function(pEntity) {
		if(pEntity != null) {
			HxOverrides.remove(this._entities,pEntity);
			pEntity.destroy();
		}
	}
	,render: function(pContext) {
		var _g = 0;
		var _g1 = this._entities;
		while(_g < _g1.length) {
			var en = _g1[_g];
			++_g;
			if(en.visible) en.render(pContext);
		}
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this._entities;
		while(_g < _g1.length) {
			var en = _g1[_g];
			++_g;
			en.destroy();
		}
		this._entities = new Array();
	}
	,numChildren: function() {
		return this._entities.length;
	}
	,__class__: age.display.EntityContainer
};
var TiledMap = function(pFile,pCellSize) {
	if(pCellSize == null) pCellSize = 0;
	age.display.EntityContainer.call(this);
	var json = JSON.parse(age.Assets.getText(pFile));
	this._mapWidth = Reflect.field(json,"width");
	this._mapHeight = Reflect.field(json,"height");
	if(pCellSize > 0) this.tileSize = pCellSize; else this.tileSize = Reflect.field(json,"tilewidth");
	this._mapData = Reflect.field(json,"layers")[0].data;
	var _g1 = 0;
	var _g = this._mapHeight;
	while(_g1 < _g) {
		var y = _g1++;
		var _g3 = 0;
		var _g2 = this._mapWidth;
		while(_g3 < _g2) {
			var x = _g3++;
			var cell = this._mapData[x + y * this._mapWidth];
			if(cell > 0) this.add(new entities.Tile(x,y,this.tileSize,cell));
		}
	}
	this.boxesSpots = new Array();
	this.picsSpots = new Array();
	this.potions = new Array();
	this.switchs = new Array();
	this.gates = new Array();
	var spawnData = Reflect.field(json,"layers")[1].objects;
	var _g4 = 0;
	while(_g4 < spawnData.length) {
		var spawn = spawnData[_g4];
		++_g4;
		if(spawn.name == "item") this.boxesSpots.push({ x : Math.round(spawn.x), y : Math.round(spawn.y), inverted : spawn.type == "inverted"}); else if(spawn.name == "pic") this.picsSpots.push({ x : Math.round(spawn.x), y : Math.round(spawn.y), position : spawn.properties.position, inverted : spawn.type == "inverted"}); else if(spawn.name == "P1") this.player1 = { x : Math.round(spawn.x), y : Math.round(spawn.y), inverted : spawn.type == "inverted"}; else if(spawn.name == "P2") this.player2 = { x : Math.round(spawn.x), y : Math.round(spawn.y), inverted : spawn.type == "inverted"}; else if(spawn.name == "door") this.door = { x : Math.round(spawn.x), y : Math.round(spawn.y)}; else if(spawn.name == "gate") this.gates.push({ x : Math.round(spawn.x), y : Math.round(spawn.y), id : spawn.properties.id, inverted : spawn.type == "inverted", visible : spawn.properties.visible == null || spawn.properties.visible == "true"}); else if(spawn.name == "switch") this.switchs.push({ x : Math.round(spawn.x), y : Math.round(spawn.y), inverted : spawn.type == "inverted", id : spawn.properties.id}); else if(spawn.name == "potion") this.potions.push({ x : Math.round(spawn.x), y : Math.round(spawn.y), inverted : spawn.type == "inverted"});
	}
};
TiledMap.__name__ = true;
TiledMap.__super__ = age.display.EntityContainer;
TiledMap.prototype = $extend(age.display.EntityContainer.prototype,{
	registerCollisions: function(pEntity) {
		pEntity.addBehavior("collisions",new behaviors.MapCollisions(pEntity,this._mapData,this._mapWidth,this.tileSize,pEntity.gravity));
	}
	,getData: function() {
		return this._mapData;
	}
	,addFakeTileAt: function(pX,pY) {
		this._mapData[pY * this._mapWidth + pX] = 1;
	}
	,removeTileAt: function(pX,pY) {
		var tile;
		var _g = 0;
		var _g1 = this._entities;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			tile = js.Boot.__cast(i , entities.Tile);
			if(tile.col == pX && tile.lin == pY) {
				this.remove(i);
				break;
			}
		}
		this._mapData[pY * this._mapWidth + pX] = 0;
	}
	,__class__: TiledMap
});
age.Assets = function() { };
age.Assets.__name__ = true;
age.Assets.getImage = function(pName) {
	var image;
	if(age.Assets._cacheImg.exists(pName)) image = age.Assets._cacheImg.get(pName); else {
		image = new Image();
		image.style.position = "absolute";
		image.src = pName;
		age.Assets._cacheImg.set(pName,image);
	}
	return image;
};
age.Assets.setImage = function(pName,pImage) {
	age.Assets._cacheImg.set(pName,pImage);
};
age.Assets.getSound = function(pName) {
	if(age.Assets._cacheSounds.exists(pName)) return age.Assets._cacheSounds.get(pName);
	throw "Error sound not loaded";
};
age.Assets.setSound = function(pName,pAudio) {
	age.Assets._cacheSounds.set(pName,pAudio);
};
age.Assets.getText = function(pName) {
	if(age.Assets._cacheText.exists(pName)) return age.Assets._cacheText.get(pName);
	throw "Error text not loaded";
};
age.Assets.setText = function(pName,pText) {
	age.Assets._cacheText.set(pName,pText);
};
age.Loader = function() { };
age.Loader.__name__ = true;
age.Loader.addResource = function(pSrc,pType,pName) {
	if(pName == null) pName = "";
	switch(pType[1]) {
	case 0:
		age.Loader._dataToLoad.add({ type : age.ResourceType.IMAGE, src : pSrc, name : pName != ""?pName:pSrc});
		break;
	case 1:
		age.Loader._dataToLoad.add({ type : age.ResourceType.TEXT, src : pSrc, name : pName != ""?pName:pSrc});
		break;
	case 2:
		age.Loader._dataToLoad.add({ type : age.ResourceType.SOUND, src : pSrc, name : pName != ""?pName:pSrc});
		break;
	}
};
age.Loader.removeResource = function(pName) {
	var $it0 = age.Loader._dataToLoad.iterator();
	while( $it0.hasNext() ) {
		var r = $it0.next();
		if(r.name == pName) {
			age.Loader._dataToLoad.remove(r);
			return;
		}
	}
};
age.Loader.onResourceError = function(pName) {
	age.Loader.removeResource(pName);
	age.Loader.ERROR++;
	age.Loader.allComplete();
};
age.Loader.onResourceLoaded = function(pName) {
	age.Loader.LOADED++;
	age.Loader.removeResource(pName);
	age.Loader.allComplete();
};
age.Loader.start = function(pCallback) {
	if(age.Loader._dataToLoad.length == 0) pCallback(); else {
		age.Loader._endCallback = pCallback;
		age.Loader._totalToLoad = age.Loader._dataToLoad.length;
		var $it0 = age.Loader._dataToLoad.iterator();
		while( $it0.hasNext() ) {
			var data = $it0.next();
			var _g = data.type;
			switch(_g[1]) {
			case 0:
				age.Loader.loadImage(data.name,data.src);
				break;
			case 1:
				age.Loader.loadText(data.name,data.src);
				break;
			case 2:
				age.Loader.loadSound(data.name,data.src);
				break;
			}
		}
	}
};
age.Loader.loadImage = function(pName,pSrc) {
	var image = new Image();
	image.style.position = "absolute";
	image.onload = function(pEvt) {
		age.Assets.setImage(pName,pEvt.currentTarget);
		age.Loader.onResourceLoaded(pName);
	};
	image.onerror = function(pEvt1) {
		console.log("Error: " + Std.string(pEvt1.currentTarget));
		age.Loader.onResourceError(pName);
	};
	image.src = pSrc;
};
age.Loader.loadText = function(pName,pSrc) {
	var r = new XMLHttpRequest();
	r.open("GET",pSrc,true);
	r.onerror = function(pEvt) {
		console.log("Error while loading " + pName);
		age.Loader.onResourceError(pName);
	};
	r.onload = function(pEvt1) {
		age.Assets.setText(pName,r.responseText);
		age.Loader.onResourceLoaded(pName);
	};
	r.send();
};
age.Loader.loadSound = function(pName,pSrc) {
	var r = new XMLHttpRequest();
	r.open("GET",pSrc,true);
	r.responseType = "arraybuffer";
	r.onerror = function(pEvt) {
		console.log("Error while loading " + pName);
		age.Loader.onResourceError(pName);
	};
	r.onload = function(pEvt1) {
		age.Assets.setSound(pName,r.response);
		age.Loader.onResourceLoaded(pName);
	};
	r.send();
};
age.Loader.allComplete = function() {
	if(age.Loader._totalToLoad <= age.Loader.LOADED + age.Loader.ERROR) age.Loader._endCallback();
};
age.ResourceType = { __ename__ : true, __constructs__ : ["IMAGE","TEXT","SOUND"] };
age.ResourceType.IMAGE = ["IMAGE",0];
age.ResourceType.IMAGE.__enum__ = age.ResourceType;
age.ResourceType.TEXT = ["TEXT",1];
age.ResourceType.TEXT.__enum__ = age.ResourceType;
age.ResourceType.SOUND = ["SOUND",2];
age.ResourceType.SOUND.__enum__ = age.ResourceType;
age.core.Global = function() { };
age.core.Global.__name__ = true;
age.core.Global.collide = function(pEntity,pX,pY) {
	if(pX >= pEntity.x && pX <= pEntity.x + pEntity.width && pY >= pEntity.y && pY <= pEntity.y + pEntity.height) return true;
	return false;
};
age.core.IBehavior = function() { };
age.core.IBehavior.__name__ = true;
age.core.IBehavior.prototype = {
	__class__: age.core.IBehavior
};
age.core.Input = function(pRoot) {
	age.core.Input._root = pRoot;
	var b = window.document;
	b.addEventListener("keydown",age.core.Input.onKeyDown);
	b.addEventListener("keyup",age.core.Input.onKeyUp);
	age.core.Input._root.addEventListener("mousemove",age.core.Input.onMouseMove);
	age.utils.GamepadSupport.init();
};
age.core.Input.__name__ = true;
age.core.Input.onMouseMove = function(pEvt) {
	var bounds = age.core.Input.getCanvasBounds();
	age.core.Input.mousePosition.x = Math.round(pEvt.clientX - bounds.left);
	age.core.Input.mousePosition.y = Math.round(pEvt.clientY - bounds.top);
	age.core.Input.mousePosition.x = Math.round(age.core.Input.mousePosition.x * age.core.Global.engine.stageScaleX);
	age.core.Input.mousePosition.y = Math.round(age.core.Input.mousePosition.y * age.core.Global.engine.stageScaleY);
};
age.core.Input.registerGlobalClickHandler = function(pCallback) {
	age.core.Input._root.addEventListener("click",pCallback);
};
age.core.Input.removeGlobalClickHandler = function(pCallback) {
	age.core.Input._root.removeEventListener("click",pCallback);
};
age.core.Input.getCanvasBounds = function() {
	return age.core.Input._root.getBoundingClientRect();
};
age.core.Input.onKeyDown = function(pEvt) {
	var code = pEvt.keyCode;
	if(!age.core.Input._key[code]) {
		age.core.Input._key[code] = true;
		age.core.Input._keyNum++;
		age.core.Input._press[age.core.Input._pressNum++] = code;
	}
};
age.core.Input.onKeyUp = function(pEvt) {
	var code = pEvt.keyCode;
	if(age.core.Input._key[code]) {
		age.core.Input._key[code] = false;
		age.core.Input._keyNum--;
		age.core.Input._release[age.core.Input._releaseNum++] = code;
	}
};
age.core.Input.indexOf = function(a,v) {
	var i = 0;
	var _g = 0;
	while(_g < a.length) {
		var v2 = a[_g];
		++_g;
		if(v == v2) return i;
		i++;
	}
	return -1;
};
age.core.Input.update = function() {
	while(age.core.Input._pressNum-- > -1) age.core.Input._press[age.core.Input._pressNum] = -1;
	age.core.Input._pressNum = 0;
	while(age.core.Input._releaseNum-- > -1) age.core.Input._release[age.core.Input._releaseNum] = -1;
	age.core.Input._releaseNum = 0;
	age.utils.GamepadSupport.update();
};
age.core.Input.check = function(input) {
	if(typeof(input) == "string") {
		var v;
		var key = input;
		v = age.core.Input._control.get(key);
		var i = v.length;
		while(i-- > 0) if(v[i] < 0 && age.core.Input._keyNum > 0) return true; else if(age.core.Input._key[v[i]] == true) return true;
		return false;
	}
	if(input < 0) return age.core.Input._keyNum > 0; else return age.core.Input._key[input];
};
age.core.Input.pressed = function(input) {
	if(typeof(input) == "string") {
		var v;
		var key = input;
		v = age.core.Input._control.get(key);
		var i = v.length;
		while(i-- > 0) if(v[i] < 0?age.core.Input._pressNum != 0:age.core.Input.indexOf(age.core.Input._press,v[i]) >= 0) return true;
		return false;
	}
	if(input < 0) return age.core.Input._pressNum != 0; else return age.core.Input.indexOf(age.core.Input._press,input) >= 0;
};
age.core.Input.released = function(input) {
	if(typeof(input) == "string") {
		var v;
		var key = input;
		v = age.core.Input._control.get(key);
		var i = v.length;
		while(i-- > 0) if(v[i] < 0?age.core.Input._releaseNum != 0:age.core.Input.indexOf(age.core.Input._release,v[i]) >= 0) return true;
		return false;
	}
	if(input < 0) return age.core.Input._releaseNum != 0; else return age.core.Input.indexOf(age.core.Input._release,input) >= 0;
};
age.core.Input.prototype = {
	__class__: age.core.Input
};
age.display.Entity = function(pWidth,pHeight,pImgSrc) {
	if(pImgSrc == null) pImgSrc = "";
	if(pHeight == null) pHeight = 0;
	if(pWidth == null) pWidth = 0;
	this.visible = true;
	this.x = this.y = 0;
	this.rotation = 0;
	this.depth = 0;
	this.alpha = 1;
	this.mirror = false;
	this.dead = false;
	this.width = pWidth;
	this.height = pHeight;
	this.hitbox = { x : 0, y : 0, width : pWidth, height : pHeight};
	this._images = new haxe.ds.StringMap();
	this._behaviors = new haxe.ds.StringMap();
	if(pImgSrc != "") this.addImage("default",pImgSrc,true);
};
age.display.Entity.__name__ = true;
age.display.Entity.__interfaces__ = [age.core.IEntity];
age.display.Entity.prototype = {
	addImage: function(pName,pSrc,pDefault) {
		if(pDefault == null) pDefault = false;
		var value = age.Assets.getImage(pSrc);
		this._images.set(pName,value);
		if(pDefault) this.play(pName);
	}
	,play: function(pName) {
		this._image = this._images.get(pName);
	}
	,addBehavior: function(pName,pBehavior) {
		this._behaviors.set(pName,pBehavior);
	}
	,removeBehavior: function(pName) {
		if(this._behaviors.exists(pName)) this._behaviors.remove(pName);
	}
	,getBehavior: function(pName) {
		return this._behaviors.get(pName);
	}
	,update: function() {
		if(!this.dead) {
			var $it0 = this._behaviors.iterator();
			while( $it0.hasNext() ) {
				var b = $it0.next();
				if(b.activated) b.update();
			}
		}
	}
	,render: function(pContext) {
		if(this._image == null || !this.visible || this.dead) return;
		pContext.save();
		if(this.mirror) {
			var decX = this.x + this.width * .5 | 0;
			var decY = this.y + this.height * .5 | 0;
			pContext.translate(decX,decY);
			pContext.scale(-1,1);
			pContext.translate(-decX,-decY);
		}
		if(this.rotation != 0) {
			var decX1 = this.x + this.width * .5 | 0;
			var decY1 = this.y + this.height * .5 | 0;
			pContext.translate(decX1,decY1);
			pContext.rotate(this.rotation * Math.PI / 180);
			pContext.translate(-decX1,-decY1);
		}
		var globalAlpha = pContext.globalAlpha;
		if(this.alpha < 1 && this.alpha >= 0) pContext.globalAlpha = this.alpha;
		if(this.width != 0 && this.height != 0) pContext.drawImage(this._image,this.x,this.y,this.width,this.height); else pContext.drawImage(this._image,this.x,this.y);
		pContext.globalAlpha = globalAlpha;
		pContext.restore();
	}
	,destroy: function() {
		var $it0 = this._behaviors.iterator();
		while( $it0.hasNext() ) {
			var b = $it0.next();
			b.destroy();
		}
		this._behaviors = new haxe.ds.StringMap();
	}
	,collideRect: function(pX,pY,pWidth,pHeight) {
		if(pX >= this.x + this.hitbox.x && pX <= this.x + this.hitbox.x + this.hitbox.width && pY >= this.y + this.hitbox.y && pY <= this.y + this.hitbox.y + this.hitbox.height) return true;
		if(pX + pWidth >= this.x + this.hitbox.x && pX + pWidth <= this.x + this.hitbox.x + this.hitbox.width && pY >= this.y + this.hitbox.y && pY <= this.y + this.hitbox.y + this.hitbox.height) return true;
		if(pX >= this.x + this.hitbox.x && pX <= this.x + this.hitbox.x + this.hitbox.width && pY + pHeight >= this.y + this.hitbox.y && pY + pHeight <= this.y + this.hitbox.y + this.hitbox.height) return true;
		if(pX + pWidth >= this.x + this.hitbox.x && pX + pWidth <= this.x + this.hitbox.x + this.hitbox.width && pY + pHeight >= this.y + this.hitbox.y && pY + pHeight <= this.y + this.hitbox.y + this.hitbox.height) return true;
		return false;
	}
	,collideEntity: function(pEntity) {
		return this.collideRect(pEntity.x + pEntity.hitbox.x,pEntity.y + pEntity.hitbox.y,pEntity.hitbox.width,pEntity.hitbox.height);
	}
	,collidePoint: function(pX,pY) {
		return this.collideRect(pX,pY,0,0);
	}
	,__class__: age.display.Entity
};
age.display.AnimatedEntity = function(pWidth,pHeight,pSrc,pTotalFrames,pFrameRate) {
	age.display.Entity.call(this,pWidth,pHeight);
	this.addImage("default",pSrc,true);
	this._frames = pTotalFrames;
	this._currentFrame = 0;
	this._pauseAnim = false;
	this._frameRate = pFrameRate;
	this._timer = 0;
	this._loop = true;
	this._complete = false;
};
age.display.AnimatedEntity.__name__ = true;
age.display.AnimatedEntity.__super__ = age.display.Entity;
age.display.AnimatedEntity.prototype = $extend(age.display.Entity.prototype,{
	onAnimationComplete: function() {
	}
	,update: function() {
		if(this._complete) return;
		var oldIndex = this._currentFrame;
		this._timer += this._frameRate * age.core.Global.elapsed;
		if(this._timer >= 1 && !this._pauseAnim) while(this._timer >= 1) {
			this._timer--;
			this._currentFrame++;
			if(this._currentFrame >= this._frames) {
				if(this._loop) this._currentFrame = 0; else {
					this._currentFrame = this._frames - 1;
					this._complete = true;
					this.onAnimationComplete();
					break;
				}
			}
		}
		age.display.Entity.prototype.update.call(this);
	}
	,render: function(pContext) {
		pContext.save();
		if(this.mirror) {
			var decX = this.x + this.width * .5 | 0;
			var decY = this.y + this.height * .5 | 0;
			pContext.translate(decX,decY);
			pContext.scale(-1,1);
			pContext.translate(-decX,-decY);
		}
		if(this.rotation != 0) {
			var decX1 = this.x + this.width * .5 | 0;
			var decY1 = this.y + this.height * .5 | 0;
			pContext.translate(decX1,decY1);
			pContext.rotate(this.rotation * Math.PI / 180);
			pContext.translate(-decX1,-decY1);
		}
		var globalAlpha = pContext.globalAlpha;
		if(this.alpha < 1 && this.alpha >= 0) pContext.globalAlpha = this.alpha;
		pContext.drawImage(this._image,this._currentFrame * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
		pContext.globalAlpha = globalAlpha;
		pContext.restore();
	}
	,__class__: age.display.AnimatedEntity
});
age.display.State = function() {
	age.display.EntityContainer.call(this);
};
age.display.State.__name__ = true;
age.display.State.__super__ = age.display.EntityContainer;
age.display.State.prototype = $extend(age.display.EntityContainer.prototype,{
	create: function() {
	}
	,__class__: age.display.State
});
age.display.text = {};
age.display.text.BasicText = function(pText,pX,pY,pMaxWidth) {
	if(pMaxWidth == null) pMaxWidth = -1;
	if(pY == null) pY = 0;
	if(pX == null) pX = 0;
	this.text = pText;
	this._maxWidth = pMaxWidth;
	this.visible = true;
	this.font = "sans-serif";
	this.size = 12;
	this.bold = false;
	this.color = "#000";
	this.textAlign = age.display.text.TextAlign.LEFT;
	this.textBaseline = age.display.text.TextBaseline.TOP;
	this.x = pX;
	this.y = pY;
	this.width = 0;
	this.height = 0;
	this.depth = 0;
};
age.display.text.BasicText.__name__ = true;
age.display.text.BasicText.__interfaces__ = [age.core.IEntity];
age.display.text.BasicText.prototype = {
	setStyle: function(pFont,pSize,pColor,pBold,pTextAlign) {
		if(pBold == null) pBold = false;
		if(pColor == null) pColor = "";
		if(pSize == null) pSize = 0;
		if(pFont == null) pFont = "";
		if(pFont != "") this.font = pFont;
		if(pSize > 0) this.size = pSize;
		if(pColor != "") this.color = pColor;
		this.bold = pBold;
		if(pTextAlign != null) this.textAlign = pTextAlign;
	}
	,update: function() {
	}
	,render: function(pContext) {
		pContext.fillStyle = this.color;
		pContext.font = (this.bold?"bold ":"") + this.size + "px " + this.font;
		pContext.textAlign = age.display.text.TextAlignEnum.toStyle(this.textAlign);
		pContext.textBaseline = age.display.text.TextBaselineEnum.toStyle(this.textBaseline);
		if(this._maxWidth > 0) pContext.fillText(this.text,this.x,this.y,this._maxWidth); else pContext.fillText(this.text,this.x,this.y);
	}
	,destroy: function() {
	}
	,__class__: age.display.text.BasicText
};
age.display.text.TextAlign = { __ename__ : true, __constructs__ : ["LEFT","CENTER","RIGHT","JUSTIFY"] };
age.display.text.TextAlign.LEFT = ["LEFT",0];
age.display.text.TextAlign.LEFT.__enum__ = age.display.text.TextAlign;
age.display.text.TextAlign.CENTER = ["CENTER",1];
age.display.text.TextAlign.CENTER.__enum__ = age.display.text.TextAlign;
age.display.text.TextAlign.RIGHT = ["RIGHT",2];
age.display.text.TextAlign.RIGHT.__enum__ = age.display.text.TextAlign;
age.display.text.TextAlign.JUSTIFY = ["JUSTIFY",3];
age.display.text.TextAlign.JUSTIFY.__enum__ = age.display.text.TextAlign;
age.display.text.TextAlignEnum = function() { };
age.display.text.TextAlignEnum.__name__ = true;
age.display.text.TextAlignEnum.toStyle = function(pType) {
	switch(pType[1]) {
	case 0:
		return "left";
	case 2:
		return "right";
	case 1:
		return "center";
	case 3:
		return "justify";
	}
};
age.display.text.TextBaseline = { __ename__ : true, __constructs__ : ["TOP","BOTTOM","MIDDLE","ALPHABETIC","HANGING"] };
age.display.text.TextBaseline.TOP = ["TOP",0];
age.display.text.TextBaseline.TOP.__enum__ = age.display.text.TextBaseline;
age.display.text.TextBaseline.BOTTOM = ["BOTTOM",1];
age.display.text.TextBaseline.BOTTOM.__enum__ = age.display.text.TextBaseline;
age.display.text.TextBaseline.MIDDLE = ["MIDDLE",2];
age.display.text.TextBaseline.MIDDLE.__enum__ = age.display.text.TextBaseline;
age.display.text.TextBaseline.ALPHABETIC = ["ALPHABETIC",3];
age.display.text.TextBaseline.ALPHABETIC.__enum__ = age.display.text.TextBaseline;
age.display.text.TextBaseline.HANGING = ["HANGING",4];
age.display.text.TextBaseline.HANGING.__enum__ = age.display.text.TextBaseline;
age.display.text.TextBaselineEnum = function() { };
age.display.text.TextBaselineEnum.__name__ = true;
age.display.text.TextBaselineEnum.toStyle = function(pType) {
	switch(pType[1]) {
	case 0:
		return "top";
	case 1:
		return "bottom";
	case 2:
		return "middle";
	case 3:
		return "alphabetic";
	case 4:
		return "hanging";
	}
};
age.display.ui = {};
age.display.ui.Rect = function(pX,pY,pWidth,pHeight,pColor,pAlpha) {
	if(pAlpha == null) pAlpha = 1;
	this.visible = true;
	this.x = pX;
	this.y = pY;
	this.depth = 0;
	this.alpha = pAlpha;
	this._backgroundColor = pColor;
	this.width = pWidth;
	this.height = pHeight;
};
age.display.ui.Rect.__name__ = true;
age.display.ui.Rect.__interfaces__ = [age.core.IEntity];
age.display.ui.Rect.prototype = {
	update: function() {
	}
	,render: function(pContext) {
		if(this._backgroundColor != "") {
			pContext.save();
			var globalAlpha = pContext.globalAlpha;
			if(this.alpha < 1 && this.alpha >= 0) pContext.globalAlpha = this.alpha;
			pContext.beginPath();
			pContext.rect(this.x,this.y,this.width,this.height);
			if(this._backgroundColor != "") {
				pContext.fillStyle = this._backgroundColor;
				pContext.fill();
			}
			pContext.globalAlpha = globalAlpha;
			pContext.restore();
		}
	}
	,destroy: function() {
	}
	,__class__: age.display.ui.Rect
};
age.managers = {};
age.managers.SoundManager = function() {
	this._globalVolume = 0.8;
	var AudioContext = age.utils.HtmlUtils.loadExtension("AudioContext").value;
	if(AudioContext != null) this._context = new AudioContext(); else console.log("No audio context found");
};
age.managers.SoundManager.__name__ = true;
age.managers.SoundManager.getInstance = function() {
	if(age.managers.SoundManager._instance == null) age.managers.SoundManager._instance = new age.managers.SoundManager();
	return age.managers.SoundManager._instance;
};
age.managers.SoundManager.prototype = {
	setGlobalVolume: function(pVal) {
		this._globalVolume = pVal;
	}
	,getSource: function(pAudioData) {
		if(this._context == null) return null;
		var soundSource = this._context.createBufferSource();
		var soundBuffer = this._context.createBuffer(pAudioData,true);
		soundSource.buffer = soundBuffer;
		soundSource.connect(this._context.destination,0,0);
		return soundSource;
	}
	,play: function(pName,pPos,pLoop) {
		if(pLoop == null) pLoop = false;
		if(pPos == null) pPos = 0;
		if(this._context == null) return;
		var s = this.getSource(age.Assets.getSound(pName));
		if(pLoop) s.loop = pLoop;
		if(Reflect.field(s,"start")) s.start(pPos); else s.noteOn(pPos);
	}
	,stop: function(pName) {
		if(this._context == null) return;
	}
	,__class__: age.managers.SoundManager
};
age.utils = {};
age.utils.GamepadSupport = function() { };
age.utils.GamepadSupport.__name__ = true;
age.utils.GamepadSupport.init = function() {
	age.utils.GamepadSupport._buttons = new haxe.ds.IntMap();
	age.utils.GamepadSupport._axes = new haxe.ds.IntMap();
	age.utils.GamepadSupport._pads = new haxe.ds.IntMap();
	age.utils.GamepadSupport.NB_PAD = 0;
	age.utils.GamepadSupport.enabled = age.utils.HtmlUtils.loadExtension("GetGamepads",window.navigator).value != null;
	console.log("GamePad support : " + Std.string(age.utils.GamepadSupport.enabled));
};
age.utils.GamepadSupport.update = function() {
	if(!age.utils.GamepadSupport.enabled || age.utils.GamepadSupport._buttons == null) return;
	age.utils.GamepadSupport.NB_PAD = 0;
	var t = window.navigator;
	var gamepads = t.webkitGetGamepads();
	if(gamepads != null) {
		var pad;
		var _g1 = 0;
		var _g = gamepads.length;
		while(_g1 < _g) {
			var i = _g1++;
			age.utils.GamepadSupport.NB_PAD++;
			pad = gamepads.item(i);
			if(pad != null) {
				if(!age.utils.GamepadSupport._pads.exists(i)) age.utils.GamepadSupport._pads.set(i,pad.id);
				var currentPadButtons;
				if(age.utils.GamepadSupport._buttons.exists(i)) currentPadButtons = age.utils.GamepadSupport._buttons.get(i); else {
					currentPadButtons = new haxe.ds.IntMap();
					age.utils.GamepadSupport._buttons.set(i,currentPadButtons);
				}
				var btnIndex = 0;
				var _g2 = 0;
				var _g3 = pad.buttons;
				while(_g2 < _g3.length) {
					var b = _g3[_g2];
					++_g2;
					if(currentPadButtons.exists(btnIndex) && b == 1) {
						var state = currentPadButtons.get(btnIndex);
						if(state == age.utils.GamePadState.OFF) currentPadButtons.set(btnIndex,age.utils.GamePadState.PRESSED);
					} else currentPadButtons.set(btnIndex,b == 1?age.utils.GamePadState.PRESSED:age.utils.GamePadState.OFF);
					btnIndex++;
				}
				var currentPadAxes;
				if(age.utils.GamepadSupport._axes.exists(i)) currentPadAxes = age.utils.GamepadSupport._axes.get(i); else {
					currentPadAxes = { leftStick_right : false, leftStick_left : false, leftStick_up : false, leftStick_down : false, rightStick_right : false, rightStick_left : false, rightStick_up : false, rightStick_down : false};
					age.utils.GamepadSupport._axes.set(i,currentPadAxes);
				}
				currentPadAxes.leftStick_right = pad.axes[0] > age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.leftStick_left = pad.axes[0] < -age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.leftStick_up = pad.axes[1] > age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.leftStick_down = pad.axes[1] < -age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.rightStick_right = pad.axes[2] > age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.rightStick_left = pad.axes[2] < -age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.rightStick_up = pad.axes[3] > age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
				currentPadAxes.rightStick_down = pad.axes[3] < -age.utils.GamepadSupport.GAMEPAD_SENSITIVITY;
			}
		}
	}
};
age.utils.GamepadSupport.pressed = function(pPadId,pBtn) {
	if(age.utils.GamepadSupport._buttons != null && age.utils.GamepadSupport._buttons.exists(pPadId)) {
		var state;
		var this1 = age.utils.GamepadSupport._buttons.get(pPadId);
		state = this1.get(pBtn);
		if(state == age.utils.GamePadState.PRESSED) {
			var this2 = age.utils.GamepadSupport._buttons.get(pPadId);
			this2.set(pBtn,age.utils.GamePadState.ON);
			return true;
		}
	}
	return false;
};
age.utils.GamepadSupport.check = function(pPadId,pBtn) {
	if(age.utils.GamepadSupport._buttons != null && age.utils.GamepadSupport._buttons.exists(pPadId)) return (function($this) {
		var $r;
		var this1 = age.utils.GamepadSupport._buttons.get(pPadId);
		$r = this1.get(pBtn);
		return $r;
	}(this)) != age.utils.GamePadState.OFF;
	return false;
};
age.utils.GamepadSupport.direction = function(pPadId,pDirection,pStick) {
	if(pStick == null) pStick = 0;
	if(age.utils.GamepadSupport._axes != null && age.utils.GamepadSupport._axes.exists(pPadId)) {
		var padAxes = age.utils.GamepadSupport._axes.get(pPadId);
		switch(pDirection[1]) {
		case 0:
			if(pStick == 0) return padAxes.leftStick_left; else return padAxes.rightStick_left;
			break;
		case 1:
			if(pStick == 0) return padAxes.leftStick_right; else return padAxes.rightStick_right;
			break;
		case 2:
			if(pStick == 0) return padAxes.leftStick_up; else return padAxes.rightStick_up;
			break;
		case 3:
			if(pStick == 0) return padAxes.leftStick_down; else return padAxes.rightStick_down;
			break;
		}
	}
	return false;
};
age.utils.GamePadAxes = { __ename__ : true, __constructs__ : ["LEFT","RIGHT","UP","DOWN"] };
age.utils.GamePadAxes.LEFT = ["LEFT",0];
age.utils.GamePadAxes.LEFT.__enum__ = age.utils.GamePadAxes;
age.utils.GamePadAxes.RIGHT = ["RIGHT",1];
age.utils.GamePadAxes.RIGHT.__enum__ = age.utils.GamePadAxes;
age.utils.GamePadAxes.UP = ["UP",2];
age.utils.GamePadAxes.UP.__enum__ = age.utils.GamePadAxes;
age.utils.GamePadAxes.DOWN = ["DOWN",3];
age.utils.GamePadAxes.DOWN.__enum__ = age.utils.GamePadAxes;
age.utils.GamePadState = { __ename__ : true, __constructs__ : ["PRESSED","ON","OFF"] };
age.utils.GamePadState.PRESSED = ["PRESSED",0];
age.utils.GamePadState.PRESSED.__enum__ = age.utils.GamePadState;
age.utils.GamePadState.ON = ["ON",1];
age.utils.GamePadState.ON.__enum__ = age.utils.GamePadState;
age.utils.GamePadState.OFF = ["OFF",2];
age.utils.GamePadState.OFF.__enum__ = age.utils.GamePadState;
age.utils.HtmlUtils = function() { };
age.utils.HtmlUtils.__name__ = true;
age.utils.HtmlUtils.loadExtension = function(pName,obj) {
	if(obj == null) obj = window;
	var extension = Reflect.field(obj,pName);
	if(extension != null) return { prefix : "", field : pName, value : extension};
	var capitalized = pName.charAt(0).toUpperCase() + HxOverrides.substr(pName,1,null);
	var _g = 0;
	var _g1 = age.utils.HtmlUtils.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		var field = prefix + capitalized;
		var extension1 = Reflect.field(obj,field);
		if(extension1 != null) return { prefix : prefix, field : field, value : extension1};
	}
	return { prefix : null, field : null, value : null};
};
age.utils.Key = function() { };
age.utils.Key.__name__ = true;
age.utils.Key.nameOfKey = function($char) {
	if($char >= 97 && $char <= 122) return String.fromCharCode($char);
	if($char >= 112 && $char <= 126) return "F" + Std.string($char - 111);
	if($char >= 96 && $char <= 105) return "NUMPAD " + Std.string($char - 96);
	switch($char) {
	case 37:
		return "LEFT";
	case 38:
		return "UP";
	case 39:
		return "RIGHT";
	case 40:
		return "DOWN";
	case 13:
		return "ENTER";
	case 17:
		return "CONTROL";
	case 32:
		return "SPACE";
	case 16:
		return "SHIFT";
	case 8:
		return "BACKSPACE";
	case 20:
		return "CAPS LOCK";
	case 46:
		return "DELETE";
	case 35:
		return "END";
	case 27:
		return "ESCAPE";
	case 36:
		return "HOME";
	case 45:
		return "INSERT";
	case 9:
		return "TAB";
	case 34:
		return "PAGE DOWN";
	case 33:
		return "PAGE UP";
	case 107:
		return "NUMPAD ADD";
	case 110:
		return "NUMPAD DECIMAL";
	case 111:
		return "NUMPAD DIVIDE";
	case 108:
		return "NUMPAD ENTER";
	case 106:
		return "NUMPAD MULTIPLY";
	case 109:
		return "NUMPAD SUBTRACT";
	}
	return String.fromCharCode($char);
};
var behaviors = {};
behaviors.BasicMovements = function(pEntity) {
	this.activated = true;
	this.entity = pEntity;
	this.velocityX = 0;
	this.velocityY = 0;
	this.canJump = true;
};
behaviors.BasicMovements.__name__ = true;
behaviors.BasicMovements.__interfaces__ = [age.core.IBehavior];
behaviors.BasicMovements.prototype = {
	update: function() {
		this.entity.y = Math.round(this.entity.y + this.velocityY);
		this.entity.x = Math.round(this.entity.x + this.velocityX);
	}
	,onMapCollisions: function(pSide) {
	}
	,destroy: function() {
		this.entity = null;
	}
	,__class__: behaviors.BasicMovements
};
behaviors.KeyboardMovements = function(pEntity,pGravity,pControlInverted) {
	if(pControlInverted == null) pControlInverted = false;
	if(pGravity == null) pGravity = 1;
	behaviors.BasicMovements.call(this,pEntity);
	this._controlInverted = pControlInverted;
	this._gravity = 0.8 * pGravity;
	this._walkSpeed = 1;
	this._jumpSpeed = 7 * pGravity;
	this._maxSpeed = 3;
	this._frictionX = 0.8;
	this._frictionY = 0.99;
	this._hero = pEntity;
};
behaviors.KeyboardMovements.__name__ = true;
behaviors.KeyboardMovements.__super__ = behaviors.BasicMovements;
behaviors.KeyboardMovements.prototype = $extend(behaviors.BasicMovements.prototype,{
	switchControls: function() {
		this._controlInverted = !this._controlInverted;
	}
	,update: function() {
		var directionX = 0;
		if(this._hero.isMovingLeft()) directionX = -1 * (this._controlInverted?-1:1); else if(this._hero.isMovingRight()) if(this._controlInverted) directionX = -1; else directionX = 1;
		this._dir = directionX;
		if(this.canJump && this._hero.isJumping()) {
			this.velocityY -= this._jumpSpeed;
			this.canJump = false;
		}
		if(directionX != 0) this.velocityX += this._walkSpeed * directionX;
		if(Math.abs(this.velocityX) > this._maxSpeed) this.velocityX = this._maxSpeed * directionX;
		if(Math.abs(this.velocityY) > Math.abs(this._jumpSpeed)) this.velocityY = this._jumpSpeed * this._gravity;
		this.velocityX *= this._frictionX;
		this.velocityY += this._gravity;
		behaviors.BasicMovements.prototype.update.call(this);
	}
	,getDirection: function() {
		return this._dir;
	}
	,isMoving: function() {
		return Math.round(this.velocityX) != 0;
	}
	,onMapCollisions: function(pSide) {
	}
	,__class__: behaviors.KeyboardMovements
});
behaviors.MapCollisions = function(pEntity,pData,pMapWidth,pTileSize,pGravity) {
	this.activated = true;
	this.entity = pEntity;
	this.gravity = pGravity;
	this._map = pData;
	this._mapWidth = pMapWidth;
	this._tileSize = pTileSize;
	this.mvt = this.entity.getBehavior("movements");
	this.collisions = new haxe.ds.StringMap();
};
behaviors.MapCollisions.__name__ = true;
behaviors.MapCollisions.__interfaces__ = [age.core.IBehavior];
behaviors.MapCollisions.prototype = {
	setInitPos: function(pX,pY) {
		this.previousX = pX;
		this.previousY = pY;
	}
	,update: function() {
		this.collisions.set("left",false);
		this.collisions.set("right",false);
		this.collisions.set("top",false);
		this.collisions.set("bottom",false);
		this.forecast_x = this.entity.x;
		this.forecast_y = this.entity.y;
		if(this.forecast_x == this.previousX && this.forecast_y == this.previousY) return;
		this.get_corners(this.forecast_x,this.forecast_y);
		if(this.downleft > 0) {
			this.get_corners(this.previousX,this.forecast_y);
			this.downC = this.downleft > 0;
			this.get_corners(this.forecast_x,this.previousY);
			this.leftC = this.downleft > 0;
			if(this.leftC && this.downC) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.forecast_y = (this.downy + 1) * this._tileSize - this.entity.height - 1;
				this.mvt.velocityY = 0;
				this.collisions.set("left",true);
				this.collisions.set("bottom",true);
			} else if(this.leftC) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.collisions.set("left",true);
			} else if(this.downC) {
				this.forecast_y = (this.downy + 1) * this._tileSize - this.entity.height - 1;
				this.mvt.velocityY = 0;
				this.collisions.set("bottom",true);
			} else if(this.previousX > this.forecast_x && this.previousY < this.forecast_y) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.mvt.velocityX = 0;
				this.collisions.set("left",true);
			}
		}
		this.get_corners(this.forecast_x,this.forecast_y);
		if(this.downright > 0) {
			this.get_corners(this.previousX,this.forecast_y);
			this.downC = this.downright > 0;
			this.get_corners(this.forecast_x,this.previousY);
			this.rightC = this.downright > 0;
			if(this.rightC && this.downC) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.forecast_y = (this.downy + 1) * this._tileSize - this.entity.height - 1;
				this.mvt.velocityY = 0;
				this.collisions.set("right",true);
				this.collisions.set("bottom",true);
			} else if(this.rightC) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.collisions.set("right",true);
			} else if(this.downC) {
				this.forecast_y = (this.downy + 1) * this._tileSize - this.entity.height - 1;
				this.mvt.velocityY = 0;
				this.collisions.set("bottom",true);
			} else if(this.previousX < this.forecast_x && this.previousY < this.forecast_y) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.mvt.velocityX = 0;
				this.collisions.set("right",true);
			}
		}
		this.get_corners(this.forecast_x,this.forecast_y);
		if(this.upleft > 0) {
			this.get_corners(this.previousX,this.forecast_y);
			this.upC = this.upleft > 0;
			this.get_corners(this.forecast_x,this.previousY);
			this.leftC = this.upleft > 0;
			if(this.leftC && this.upC) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.forecast_y = this.upy * this._tileSize;
				this.mvt.velocityY = 0;
				this.collisions.set("top",true);
				this.collisions.set("left",true);
			} else if(this.leftC) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.collisions.set("left",true);
			} else if(this.upC) {
				this.forecast_y = this.upy * this._tileSize;
				this.mvt.velocityY = 0;
				this.collisions.set("top",true);
			} else if(this.previousX > this.forecast_x && this.previousY > this.forecast_y) {
				this.forecast_x = (this.leftx + 1) * this._tileSize;
				this.mvt.velocityX = 0;
				this.collisions.set("left",true);
			}
		}
		this.get_corners(this.forecast_x,this.forecast_y);
		if(this.upright > 0) {
			this.get_corners(this.previousX,this.forecast_y);
			this.upC = this.upright > 0;
			this.get_corners(this.forecast_x,this.previousY);
			this.rightC = this.upright > 0;
			if(this.rightC && this.upC) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.forecast_y = this.upy * this._tileSize;
				this.mvt.velocityY = 0;
				this.collisions.set("right",true);
				this.collisions.set("top",true);
			} else if(this.rightC) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.collisions.set("right",true);
			} else if(this.upC) {
				this.forecast_y = this.upy * this._tileSize;
				this.mvt.velocityY = 0;
				this.collisions.set("top",true);
			} else if(this.previousX < this.forecast_x && this.previousY > this.forecast_y) {
				this.forecast_x = this.rightx * this._tileSize - this.entity.width - 1;
				this.mvt.velocityX = 0;
				this.collisions.set("right",true);
			}
		}
		this.entity.x = this.forecast_x;
		this.entity.y = this.forecast_y;
		if(this.gravity == Gravity.INVERTED) this.check_ground_invertedGravity(); else this.check_ground_normalGravity();
		if(this.collisions.get("left") || this.collisions.get("right") || this.collisions.get("top") || this.collisions.get("bottom")) this.mvt.onMapCollisions(this.collisions);
	}
	,get_corners: function(point_x,point_y) {
		this.downy = Math.round((point_y + this.entity.height - this._tileSize / 2) / this._tileSize);
		this.upy = Math.round((point_y - this._tileSize / 2) / this._tileSize);
		this.rightx = Math.round((point_x + this.entity.width - this._tileSize / 2) / this._tileSize);
		this.leftx = Math.round((point_x - this._tileSize / 2) / this._tileSize);
		this.downleft = this.getCell(this.leftx,this.downy);
		this.downright = this.getCell(this.rightx,this.downy);
		this.upright = this.getCell(this.rightx,this.upy);
		this.upleft = this.getCell(this.leftx,this.upy);
	}
	,getCell: function(pX,pY) {
		return this._map[pX + pY * this._mapWidth];
	}
	,check_ground_normalGravity: function() {
		this.downy = Math.round((this.entity.y + this.entity.height + 1 - this._tileSize / 2) / this._tileSize);
		this.rightx = Math.round((this.entity.x + this.entity.width - this._tileSize / 2) / this._tileSize);
		this.leftx = Math.round((this.entity.x - this._tileSize / 2) / this._tileSize);
		this.downleft = this.getCell(this.leftx,this.downy);
		this.downright = this.getCell(this.rightx,this.downy);
		if(this.downleft > 0 || this.downright > 0) {
			this.mvt.canJump = true;
			this.collisions.set("bottom",true);
		} else this.mvt.canJump = false;
	}
	,check_ground_invertedGravity: function() {
		this.upy = Math.round((this.entity.y - 1 - this._tileSize / 2) / this._tileSize);
		this.rightx = Math.round((this.entity.x + this.entity.width - this._tileSize / 2) / this._tileSize);
		this.leftx = Math.round((this.entity.x - this._tileSize / 2) / this._tileSize);
		this.upright = this.getCell(this.rightx,this.upy);
		this.upleft = this.getCell(this.leftx,this.upy);
		if(this.upright > 0 || this.upleft > 0) {
			this.mvt.canJump = true;
			this.collisions.set("top",true);
		} else this.mvt.canJump = false;
	}
	,destroy: function() {
		this.entity = null;
	}
	,__class__: behaviors.MapCollisions
};
behaviors.OpenGateBehavior = function(pEntity,pMap) {
	this.activated = true;
	this.entity = pEntity;
	this._map = pMap;
	this._gates = new Array();
};
behaviors.OpenGateBehavior.__name__ = true;
behaviors.OpenGateBehavior.__interfaces__ = [age.core.IBehavior];
behaviors.OpenGateBehavior.prototype = {
	addGate: function(pGate) {
		this._gates.push(pGate);
	}
	,active: function() {
		var _g = 0;
		var _g1 = this._gates;
		while(_g < _g1.length) {
			var gate = _g1[_g];
			++_g;
			if(gate.state == entities.GateState.CLOSED) {
				this._map.removeTileAt(gate.col,gate.line);
				this._map.removeTileAt(gate.col,gate.line + 1);
				gate.open();
			} else {
				this._map.addFakeTileAt(gate.col,gate.line);
				this._map.addFakeTileAt(gate.col,gate.line + 1);
				gate.close();
			}
		}
	}
	,update: function() {
	}
	,destroy: function() {
		this.entity = null;
		this._gates = new Array();
	}
	,__class__: behaviors.OpenGateBehavior
};
var entities = {};
entities.Door = function(pMap) {
	age.display.Entity.call(this,32,32);
	this.x = pMap.door.x;
	this.y = pMap.door.y;
	this._map = pMap;
	this.close();
	this.addImage("door","door",true);
};
entities.Door.__name__ = true;
entities.Door.__super__ = age.display.Entity;
entities.Door.prototype = $extend(age.display.Entity.prototype,{
	open: function() {
		if(this._state == entities.DoorState.OPENED) return;
		this._state = entities.DoorState.OPENED;
		this.visible = true;
		this._map.removeTileAt(Math.round(this._map.door.x / this._map.tileSize),Math.round(this._map.door.y / this._map.tileSize));
		this._map.removeTileAt(Math.round(this._map.door.x / this._map.tileSize) + 1,Math.round(this._map.door.y / this._map.tileSize));
		this._map.removeTileAt(Math.round(this._map.door.x / this._map.tileSize),Math.round(this._map.door.y / this._map.tileSize) + 1);
		this._map.removeTileAt(Math.round(this._map.door.x / this._map.tileSize) + 1,Math.round(this._map.door.y / this._map.tileSize) + 1);
	}
	,close: function() {
		this._state = entities.DoorState.CLOSED;
		this.visible = false;
	}
	,__class__: entities.Door
});
entities.DoorState = { __ename__ : true, __constructs__ : ["OPENED","CLOSED"] };
entities.DoorState.OPENED = ["OPENED",0];
entities.DoorState.OPENED.__enum__ = entities.DoorState;
entities.DoorState.CLOSED = ["CLOSED",1];
entities.DoorState.CLOSED.__enum__ = entities.DoorState;
entities.Gate = function(pX,pY,pId,pInverted,pDefaultState) {
	age.display.Entity.call(this,16,32);
	this.id = pId;
	this.x = pX;
	this.y = pY;
	if(pDefaultState == null || pDefaultState == entities.GateState.CLOSED) this.close(); else this.open();
	this.col = Math.round(pX / 16);
	this.line = Math.round(pY / 16);
	var img;
	if(pInverted) img = "gateinverted"; else img = "gate";
	this.addImage(img,img,true);
};
entities.Gate.__name__ = true;
entities.Gate.__super__ = age.display.Entity;
entities.Gate.prototype = $extend(age.display.Entity.prototype,{
	open: function() {
		this.state = entities.GateState.OPENED;
		this.visible = false;
	}
	,close: function() {
		this.state = entities.GateState.CLOSED;
		this.visible = true;
	}
	,__class__: entities.Gate
});
entities.GateState = { __ename__ : true, __constructs__ : ["OPENED","CLOSED"] };
entities.GateState.OPENED = ["OPENED",0];
entities.GateState.OPENED.__enum__ = entities.GateState;
entities.GateState.CLOSED = ["CLOSED",1];
entities.GateState.CLOSED.__enum__ = entities.GateState;
entities.Item = function(pX,pY,pInverted) {
	if(pInverted == null) pInverted = false;
	age.display.Entity.call(this,16,16);
	this.x = pX;
	this.y = pY;
	var img;
	if(pInverted) img = "itemInverted"; else img = "item";
	this.addImage(img,img,true);
};
entities.Item.__name__ = true;
entities.Item.__super__ = age.display.Entity;
entities.Item.prototype = $extend(age.display.Entity.prototype,{
	__class__: entities.Item
});
entities.Pic = function(pX,pY,pPosition,pInverted) {
	if(pInverted == null) pInverted = false;
	if(pPosition == null) pPosition = "bottom";
	age.display.Entity.call(this,16,16);
	this.x = pX;
	this.y = pY;
	if(pPosition == "top") this.position = entities.Position.TOP; else this.position = entities.Position.BOTTOM;
	this.inverted = pInverted;
	var img = "pic";
	if(this.position == entities.Position.BOTTOM) if(pInverted) img = "picInverted"; else img = "pic"; else if(pInverted) img = "pic"; else img = "picInverted";
	this.addImage(img,img,true);
};
entities.Pic.__name__ = true;
entities.Pic.__super__ = age.display.Entity;
entities.Pic.prototype = $extend(age.display.Entity.prototype,{
	__class__: entities.Pic
});
entities.Position = { __ename__ : true, __constructs__ : ["TOP","BOTTOM"] };
entities.Position.TOP = ["TOP",0];
entities.Position.TOP.__enum__ = entities.Position;
entities.Position.BOTTOM = ["BOTTOM",1];
entities.Position.BOTTOM.__enum__ = entities.Position;
entities.Player = function(pX,pY,pGravity,pAnim,pControlsInverted) {
	if(pControlsInverted == null) pControlsInverted = false;
	age.display.AnimatedEntity.call(this,22,22,pAnim,2,6);
	this.x = pX;
	this.y = pY;
	this.visible = false;
	this.idControls = -1;
	this.out = false;
	this._controlsInverted = pControlsInverted;
	this.gravity = pGravity;
	this._movements = new behaviors.KeyboardMovements(this,Enums.getGravity(this.gravity),pControlsInverted);
	this.addBehavior("movements",this._movements);
};
entities.Player.__name__ = true;
entities.Player.__super__ = age.display.AnimatedEntity;
entities.Player.prototype = $extend(age.display.AnimatedEntity.prototype,{
	update: function() {
		if(this.out) return;
		if(this._collisions == null) this._collisions = this.getBehavior("collisions");
		this._collisions.setInitPos(this.x,this.y);
		var currentDir = this._movements.getDirection();
		if(currentDir != 0) {
			this._direction = currentDir;
			this.mirror = this._direction == -1;
		}
		this._pauseAnim = !this._movements.isMoving();
		age.display.AnimatedEntity.prototype.update.call(this);
	}
	,changeDirection: function() {
		this._movements.switchControls();
	}
	,setPosition: function(pX,pY) {
		this.x = pX;
		this.y = pY;
	}
	,isMovingLeft: function() {
		if(this.idControls == -1) return age.core.Input.check(37);
		return age.utils.GamepadSupport.direction(this.idControls,age.utils.GamePadAxes.LEFT);
	}
	,isMovingRight: function() {
		if(this.idControls == -1) return age.core.Input.check(39);
		return age.utils.GamepadSupport.direction(this.idControls,age.utils.GamePadAxes.RIGHT);
	}
	,isJumping: function() {
		if(this.idControls == -1) return age.core.Input.check(38);
		return age.utils.GamepadSupport.pressed(this.idControls,0);
	}
	,__class__: entities.Player
});
entities.Potion = function(pX,pY,pInverted,pPlayerPU,pPlayerAff) {
	age.display.Entity.call(this,16,16);
	this.x = pX;
	this.y = pY;
	this._playerPU = pPlayerPU;
	this._playerAffected = pPlayerAff;
	var img;
	if(pInverted) img = "potion1inverted"; else img = "potion1";
	this.addImage(img,img,true);
};
entities.Potion.__name__ = true;
entities.Potion.__super__ = age.display.Entity;
entities.Potion.prototype = $extend(age.display.Entity.prototype,{
	update: function() {
		if(!this.dead && this.collidePoint(this._playerPU.x + 11,this._playerPU.y + 11)) {
			this._playerAffected.changeDirection();
			this.dead = true;
		}
		age.display.Entity.prototype.update.call(this);
	}
	,destroy: function() {
		this._playerPU = null;
		this._playerAffected = null;
		age.display.Entity.prototype.destroy.call(this);
	}
	,__class__: entities.Potion
});
entities.Switch = function(pX,pY,pInverted,pPlayer,pMap) {
	age.display.Entity.call(this,32,32);
	this._player = pPlayer;
	this._state = entities.SwitchState.ACTIVE;
	this.x = pX;
	this.y = pY;
	var img;
	if(pInverted) img = "switchinverted"; else img = "switch";
	this.addImage(img,img,true);
	this._opengate = new behaviors.OpenGateBehavior(this,pMap);
	this.addBehavior("opengate",this._opengate);
};
entities.Switch.__name__ = true;
entities.Switch.__super__ = age.display.Entity;
entities.Switch.prototype = $extend(age.display.Entity.prototype,{
	addGate: function(pGate) {
		this._opengate.addGate(pGate);
	}
	,update: function() {
		if(this._state == entities.SwitchState.ACTIVE) {
			if(this.collidePoint(this._player.x + 11,this._player.y + 11)) {
				this._state = entities.SwitchState.UNAVAILABLE;
				this._opengate.active();
			}
		} else if(this._state == entities.SwitchState.UNAVAILABLE) {
			if(!this.collidePoint(this._player.x + 11,this._player.y + 11)) this._state = entities.SwitchState.ACTIVE;
		}
		age.display.Entity.prototype.update.call(this);
	}
	,destroy: function() {
		this._player = null;
		age.display.Entity.prototype.destroy.call(this);
	}
	,__class__: entities.Switch
});
entities.SwitchState = { __ename__ : true, __constructs__ : ["ACTIVE","UNAVAILABLE"] };
entities.SwitchState.ACTIVE = ["ACTIVE",0];
entities.SwitchState.ACTIVE.__enum__ = entities.SwitchState;
entities.SwitchState.UNAVAILABLE = ["UNAVAILABLE",1];
entities.SwitchState.UNAVAILABLE.__enum__ = entities.SwitchState;
entities.Tile = function(pX,pY,pTileSize,pIdCell) {
	age.display.Entity.call(this,pTileSize,pTileSize);
	this.col = pX;
	this.lin = pY;
	this.x = pX * pTileSize;
	this.y = pY * pTileSize;
	var img;
	switch(pIdCell) {
	case 1:
		img = "blue";
		break;
	case 2:
		img = "topblue";
		break;
	case 3:
		img = "invertedblue";
		break;
	case 4:
		img = "green";
		break;
	case 5:
		img = "topgreen";
		break;
	case 6:
		img = "invertedgreen";
		break;
	default:
		img = "";
	}
	this.addImage(img,img,true);
};
entities.Tile.__name__ = true;
entities.Tile.__super__ = age.display.Entity;
entities.Tile.prototype = $extend(age.display.Entity.prototype,{
	__class__: entities.Tile
});
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
var managers = {};
managers.ItemsManager = function() {
};
managers.ItemsManager.__name__ = true;
managers.ItemsManager.getInstance = function() {
	if(managers.ItemsManager._instance == null) managers.ItemsManager._instance = new managers.ItemsManager();
	return managers.ItemsManager._instance;
};
managers.ItemsManager.prototype = {
	init: function(pContainer) {
		this.ctr = pContainer;
		this._items = new Array();
		this._pics = new Array();
		this._potions = new Array();
		this._gates = new Array();
		this._switchs = new Array();
	}
	,addItem: function(pItem) {
		this._items.push(pItem);
		this.ctr.add(pItem);
	}
	,getItemsCount: function() {
		if(this._items == null) return 0;
		return this._items.length;
	}
	,checkCollisionsWithItems: function(pPlayer1,pPlayer2) {
		var _g = 0;
		var _g1 = this._items;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(pPlayer1.collideEntity(item) || pPlayer2.collideEntity(item)) {
				this.ctr.remove(item);
				HxOverrides.remove(this._items,item);
			}
		}
	}
	,checkCollisionsWithPics: function(pPlayer1,pPlayer2) {
		var _g = 0;
		var _g1 = this._pics;
		while(_g < _g1.length) {
			var pic = _g1[_g];
			++_g;
			if(pic.inverted) {
				if(pic.position == entities.Position.BOTTOM && pPlayer2.x + 11 >= pic.x && pPlayer2.x + 11 <= pic.x + pic.width && pPlayer2.y <= pic.y) return true; else if(pic.position == entities.Position.TOP && pPlayer2.x + 11 >= pic.x && pPlayer2.x + 11 <= pic.x + pic.width && pPlayer2.y + pPlayer2.height >= pic.y + pic.height - 1) return true;
			} else if(pic.position == entities.Position.BOTTOM && pPlayer1.x + 11 >= pic.x && pPlayer1.x + 11 <= pic.x + pic.width && pPlayer1.y + pPlayer1.height >= pic.y + pic.height - 1) return true; else if(pic.position == entities.Position.TOP && pPlayer1.x + 11 >= pic.x && pPlayer1.x + 11 <= pic.x + pic.width && pPlayer1.y <= pic.y) return true;
		}
		return false;
	}
	,addPic: function(pPic) {
		this._pics.push(pPic);
		this.ctr.add(pPic);
	}
	,getPicsCount: function() {
		if(this._pics == null) return 0;
		return this._pics.length;
	}
	,addSwitchs: function(pMap,pPlayer1,pPlayer2) {
		var gate;
		var _g = 0;
		var _g1 = pMap.gates;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			gate = new entities.Gate(g.x,g.y,g.id,g.inverted,g.visible?entities.GateState.CLOSED:entities.GateState.OPENED);
			this._gates.push(gate);
			this.ctr.add(gate);
		}
		var swi;
		var _g2 = 0;
		var _g11 = pMap.switchs;
		while(_g2 < _g11.length) {
			var s = _g11[_g2];
			++_g2;
			swi = new entities.Switch(s.x,s.y,s.inverted,s.inverted?pPlayer2:pPlayer1,pMap);
			var _g21 = 0;
			var _g3 = this._gates;
			while(_g21 < _g3.length) {
				var g1 = _g3[_g21];
				++_g21;
				if(g1.id == s.id) swi.addGate(g1);
			}
			this._switchs.push(swi);
			this.ctr.add(swi);
		}
	}
	,addPotions: function(pPotions,pPlayer1,pPlayer2) {
		var _g = 0;
		while(_g < pPotions.length) {
			var p = pPotions[_g];
			++_g;
			this.ctr.add(new entities.Potion(p.x,p.y,p.inverted,p.inverted?pPlayer2:pPlayer1,!p.inverted?pPlayer2:pPlayer1));
		}
	}
	,reset: function() {
		this.ctr.destroy();
		this._items = new Array();
		this._pics = new Array();
		this._switchs = new Array();
		this._gates = new Array();
	}
	,__class__: managers.ItemsManager
};
managers.UiManager = function() {
	this.container = new age.display.EntityContainer();
	this._background = new age.display.ui.Rect(0,240,800,80,"#000",0.5);
	this.container.add(this._background);
	this._instructions = new age.display.text.BasicText("[SPACE] to continue",795,290);
	this._instructions.setStyle("pixelade",25,"#FFF",false,age.display.text.TextAlign.RIGHT);
	this.container.add(this._instructions);
	this._text = new age.display.text.BasicText(" ",400,this._background.y + 10,790);
	this._text.setStyle("pixelade",25,"#FFF",false,age.display.text.TextAlign.CENTER);
	this.container.add(this._text);
	this._isActive = false;
	this.container2 = new age.display.EntityContainer();
	this.container2.visible = false;
	this.container2.add(new age.display.ui.Rect(695,0,105,28,"#000",0.5));
	var txt = new age.display.text.BasicText("[ESC] to restart",795,5);
	txt.setStyle("pixelade",19,"#FFF",false,age.display.text.TextAlign.RIGHT);
	this.container2.add(txt);
};
managers.UiManager.__name__ = true;
managers.UiManager.getInstance = function() {
	if(managers.UiManager._instance == null) managers.UiManager._instance = new managers.UiManager();
	return managers.UiManager._instance;
};
managers.UiManager.prototype = {
	addText: function(pText,pCallback) {
		this._text.text = pText;
		this._cback = pCallback;
		this._isActive = true;
		this.container.visible = true;
		this.container2.visible = false;
		if(this._cback == null) this._instructions.text = "[F5] to restart";
	}
	,update: function() {
		if(!this._isActive || this._cback == null) return;
		if(age.core.Input.released(32)) {
			this._isActive = false;
			this.container.visible = false;
			this.container2.visible = true;
			this._cback();
		}
	}
	,__class__: managers.UiManager
};
var states = {};
states.GameState = function() {
	this._paused = true;
	age.display.State.call(this);
};
states.GameState.__name__ = true;
states.GameState.__super__ = age.display.State;
states.GameState.prototype = $extend(age.display.State.prototype,{
	create: function() {
		this._currentLevel = 0;
		LevelData.init();
		this._gameContainer = new age.display.EntityContainer();
		this.add(this._gameContainer);
		var itemsContainer = new age.display.EntityContainer();
		this._itemsManager = managers.ItemsManager.getInstance();
		this._itemsManager.init(itemsContainer);
		this.add(itemsContainer);
		this._uiManager = managers.UiManager.getInstance();
		this.add(this._uiManager.container);
		this.add(this._uiManager.container2);
		this.loadNextLevel();
	}
	,startLevel: function() {
		var item;
		var _g = 0;
		var _g1 = this._map.boxesSpots;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			item = new entities.Item(i.x,i.y,i.inverted);
			this._itemsManager.addItem(item);
		}
		this._player1.visible = true;
		this._player2.visible = true;
		this._door = new entities.Door(this._map);
		this._gameContainer.add(this._door);
		this._paused = false;
	}
	,loadNextLevel: function(pForceText) {
		if(pForceText == null) pForceText = "";
		this._currentLevel++;
		var level = LevelData.get(this._currentLevel);
		if(level == null) this._uiManager.addText(LevelData.endText,null); else {
			this._uiManager.addText(pForceText == ""?level.text:pForceText,$bind(this,this.startLevel));
			this._map = new TiledMap(level.file,16);
			this._gameContainer.add(this._map);
			this._player1 = new entities.Player(this._map.player1.x,this._map.player1.y,Gravity.NORMAL,"player1");
			this._map.registerCollisions(this._player1);
			this._gameContainer.add(this._player1);
			this._player2 = new entities.Player(this._map.player2.x,this._map.player2.y,this._map.player2.inverted?Gravity.NORMAL:Gravity.INVERTED,this._map.player2.inverted?"player2inv":"player2",this._map.player2.inverted);
			this._map.registerCollisions(this._player2);
			this._gameContainer.add(this._player2);
			var pic;
			var _g = 0;
			var _g1 = this._map.picsSpots;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				pic = new entities.Pic(p.x,p.y,p.position,p.inverted);
				this._itemsManager.addPic(pic);
			}
			this._itemsManager.addSwitchs(this._map,this._player1,this._player2);
			this._itemsManager.addPotions(this._map.potions,this._player1,this._player2);
		}
	}
	,update: function() {
		if(!this._paused) {
			if(age.core.Input.released(27)) {
				this.restartLevel();
				return;
			}
			if(this._player1.x <= -this._player1.width || this._player1.x + this._player1.width >= 800 + this._player1.width || this._player2.x <= -this._player2.width || this._player2.x + this._player2.width >= 800 + this._player2.width) {
				this.restartLevel("Don't try to escape this world!");
				return;
			}
			if(this._itemsManager.getItemsCount() > 0) this._itemsManager.checkCollisionsWithItems(this._player1,this._player2); else this._door.open();
			if(this._itemsManager.getPicsCount() > 0) {
				if(this._itemsManager.checkCollisionsWithPics(this._player1,this._player2)) this.restartLevel("You just killed one lover... Try again, but be careful this time.");
			}
			if(this._door.collidePoint(this._player1.x + 11,this._player1.y + 2)) {
				this._player1.out = true;
				this._player1.visible = false;
			}
			if(this._door.collidePoint(this._player2.x + 11,this._player2.y + 20)) {
				this._player2.out = true;
				this._player2.visible = false;
			}
			if(this._player1.out && this._player2.out) {
				this._paused = true;
				this.clearLevel();
				this.loadNextLevel();
			}
			age.display.State.prototype.update.call(this);
		}
		this._uiManager.update();
	}
	,restartLevel: function(pForceText) {
		if(pForceText == null) pForceText = "";
		this._paused = true;
		this._currentLevel--;
		this.clearLevel();
		this.loadNextLevel(pForceText);
	}
	,clearLevel: function() {
		this._itemsManager.reset();
		this._map.destroy();
		this._gameContainer.destroy();
	}
	,__class__: states.GameState
});
states.IntroState = function() {
	age.display.State.call(this);
};
states.IntroState.__name__ = true;
states.IntroState.__super__ = age.display.State;
states.IntroState.prototype = $extend(age.display.State.prototype,{
	create: function() {
		var title = new age.display.text.BasicText("2LOVERS",400,50);
		title.textBaseline = age.display.text.TextBaseline.MIDDLE;
		title.setStyle("pixelade",42,"#000",true,age.display.text.TextAlign.CENTER);
		this.add(title);
		var txt = new age.display.text.BasicText("Game created for the Ludum Dare #30 in 48 hours by RevoluGame",400,130);
		txt.setStyle("pixelade",25,"#000",false,age.display.text.TextAlign.CENTER);
		this.add(txt);
		var inst = new age.display.text.BasicText("Press [SPACE] when ready",400,190);
		inst.setStyle("pixelade",25,"#000",false,age.display.text.TextAlign.CENTER);
		this.add(inst);
	}
	,update: function() {
		if(age.core.Input.pressed(32)) age.core.Global.engine.switchState(new states.GameState());
		age.display.State.prototype.update.call(this);
	}
	,__class__: states.IntroState
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
LevelData.endText = "And in the end they lived happily ever after - GAME OVER";
Main.DEFAULT_FONT = "pixelade";
age.Assets._cacheImg = new haxe.ds.StringMap();
age.Assets._cacheText = new haxe.ds.StringMap();
age.Assets._cacheSounds = new haxe.ds.StringMap();
age.Loader.LOADED = 0;
age.Loader.ERROR = 0;
age.Loader._dataToLoad = new List();
age.Loader._totalToLoad = 0;
age.core.Input._key = new Array();
age.core.Input._keyNum = 0;
age.core.Input._press = new Array();
age.core.Input._pressNum = 0;
age.core.Input._release = new Array();
age.core.Input._releaseNum = 0;
age.core.Input._control = new haxe.ds.StringMap();
age.core.Input.mousePosition = { x : 0, y : 0};
age.utils.GamepadSupport.GAMEPAD_SENSITIVITY = 0.5;
age.utils.HtmlUtils.VENDOR_PREFIXES = ["webkit","moz","ms","o","khtml"];
age.utils.Key.ANY = -1;
age.utils.Key.LEFT = 37;
age.utils.Key.UP = 38;
age.utils.Key.RIGHT = 39;
age.utils.Key.DOWN = 40;
age.utils.Key.ENTER = 13;
age.utils.Key.COMMAND = 15;
age.utils.Key.CONTROL = 17;
age.utils.Key.SPACE = 32;
age.utils.Key.SHIFT = 16;
age.utils.Key.BACKSPACE = 8;
age.utils.Key.CAPS_LOCK = 20;
age.utils.Key.DELETE = 46;
age.utils.Key.END = 35;
age.utils.Key.ESCAPE = 27;
age.utils.Key.HOME = 36;
age.utils.Key.INSERT = 45;
age.utils.Key.TAB = 9;
age.utils.Key.PAGE_DOWN = 34;
age.utils.Key.PAGE_UP = 33;
age.utils.Key.LEFT_SQUARE_BRACKET = 219;
age.utils.Key.RIGHT_SQUARE_BRACKET = 221;
age.utils.Key.A = 97;
age.utils.Key.B = 98;
age.utils.Key.C = 99;
age.utils.Key.D = 100;
age.utils.Key.E = 101;
age.utils.Key.F = 102;
age.utils.Key.G = 103;
age.utils.Key.H = 104;
age.utils.Key.I = 105;
age.utils.Key.J = 106;
age.utils.Key.K = 107;
age.utils.Key.L = 108;
age.utils.Key.M = 109;
age.utils.Key.N = 78;
age.utils.Key.O = 111;
age.utils.Key.P = 112;
age.utils.Key.Q = 113;
age.utils.Key.R = 114;
age.utils.Key.S = 115;
age.utils.Key.T = 116;
age.utils.Key.U = 117;
age.utils.Key.V = 118;
age.utils.Key.W = 119;
age.utils.Key.X = 120;
age.utils.Key.Y = 121;
age.utils.Key.Z = 122;
age.utils.Key.F1 = 112;
age.utils.Key.F2 = 113;
age.utils.Key.F3 = 114;
age.utils.Key.F4 = 115;
age.utils.Key.F5 = 116;
age.utils.Key.F6 = 117;
age.utils.Key.F7 = 118;
age.utils.Key.F8 = 119;
age.utils.Key.F9 = 120;
age.utils.Key.F10 = 121;
age.utils.Key.F11 = 122;
age.utils.Key.F12 = 123;
age.utils.Key.F13 = 124;
age.utils.Key.F14 = 125;
age.utils.Key.F15 = 126;
age.utils.Key.DIGIT_0 = 48;
age.utils.Key.DIGIT_1 = 49;
age.utils.Key.DIGIT_2 = 50;
age.utils.Key.DIGIT_3 = 51;
age.utils.Key.DIGIT_4 = 52;
age.utils.Key.DIGIT_5 = 53;
age.utils.Key.DIGIT_6 = 54;
age.utils.Key.DIGIT_7 = 55;
age.utils.Key.DIGIT_8 = 56;
age.utils.Key.DIGIT_9 = 57;
age.utils.Key.NUMPAD_0 = 96;
age.utils.Key.NUMPAD_1 = 97;
age.utils.Key.NUMPAD_2 = 98;
age.utils.Key.NUMPAD_3 = 99;
age.utils.Key.NUMPAD_4 = 100;
age.utils.Key.NUMPAD_5 = 101;
age.utils.Key.NUMPAD_6 = 102;
age.utils.Key.NUMPAD_7 = 103;
age.utils.Key.NUMPAD_8 = 104;
age.utils.Key.NUMPAD_9 = 105;
age.utils.Key.NUMPAD_ADD = 107;
age.utils.Key.NUMPAD_DECIMAL = 110;
age.utils.Key.NUMPAD_DIVIDE = 111;
age.utils.Key.NUMPAD_ENTER = 108;
age.utils.Key.NUMPAD_MULTIPLY = 106;
age.utils.Key.NUMPAD_SUBTRACT = 109;
age.utils.Key.GAMEPAD_A = 0;
age.utils.Key.GAMEPAD_B = 1;
age.utils.Key.GAMEPAD_X = 2;
age.utils.Key.GAMEPAD_Y = 3;
age.utils.Key.GAMEPAD_LB = 4;
age.utils.Key.GAMEPAD_RB = 5;
age.utils.Key.GAMEPAD_LT = 6;
age.utils.Key.GAMEPAD_RT = 7;
age.utils.Key.GAMEPAD_BACK = 8;
age.utils.Key.GAMEPAD_START = 9;
age.utils.Key.GAMEPAD_LEFT_STICK_BTN = 10;
age.utils.Key.GAMEPAD_RIGHT_STICK_BTN = 11;
age.utils.Key.GAMEPAD_TOP_BTN = 12;
age.utils.Key.GAMEPAD_BOTTOM_BTN = 13;
age.utils.Key.GAMEPAD_LEFT_BTN = 14;
age.utils.Key.GAMEPAD_RIGHT_BTN = 15;
Main.main();
})();
