#pragma strict

class GlobalVars extends MonoBehaviour{

	
	static private var globalVarsPath : String = "data/globalVars.dat";
	static private var field : Field;
	static private var startTime : float;

	static function BeforeNetworkLoadedLevel () {
		if (!Network.isServer) return;
		field = Field.newField(FileIO.ReadFile(globalVarsPath));
		
		Debug.Log(field.atField("time").getValue());
		startTime = field.atField("time").getFloat();
		//Debug.Log(startTime);
	}
	
	public static function getShipCounter() : int{
		if (!field.getField("ShipCounter")){
			field.addField("ShipCounter").setInt(0);
		}
		return field.getField("ShipCounter").getInt();
	}
	public static function getUniqueShipId() : int{
		getShipCounter();
		field.getField("ShipCounter").setInt(field.getField("ShipCounter").getInt() + 1);
		return getShipCounter();
	}
	
	public static function getLuaShipPresetPath() : String{
		if (!field.getField("LuaShipPresetPath")){
			field.addField("LuaShipPresetPath").setString("data/luaShipPreset.lua");
		}
		return field.getField("LuaShipPresetPath").getString();
	}
	
	public static function getTime() : float{
		return startTime + Time.time;
	}
	
	function Unload(){
		if(! Network.isServer) return;
		field.getField("time").setFloat(getTime());
		
		FileIO.WriteFile(globalVarsPath, field.getContent());
		Debug.Log("Saved global variables");
	}
	
}