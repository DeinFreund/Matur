#pragma strict

class HotKeyManager extends MonoBehaviour
{

	

	//CLIENT
	
	final private var btnSelectKey : Rect = new Rect(20,30,100,30);
	final private var btnSave : Rect = new Rect(300,70,40,30);
	final private var btnSaveTxt : String = "Save";
	final private var lblCurrentKey : Rect = new Rect(140,30,200,30);
	final private var txtKeyAction : Rect = new Rect(20,70,270,30);
	final private var lblSelectKey : Rect = new Rect(Screen.width/2-50,Screen.height / 2 - 5,400,300);
	final private var boxSelectKey : Rect = new Rect(Screen.width/2-200,Screen.height / 2 - 150,400,300);
	final private var windowWidth : int = 360;
	final private var windowHeight : int = 120;

	static private var keyCodes : KeyCode[];
	
	private var currentKey : KeyCode = KeyCode.None;
	private var selectingKey : boolean = false;
	private var actions : Field;
	private var keyNames : Dictionary.<String,KeyCode > = new Dictionary.<String,KeyCode >();
	
	private var window : Window;

	function Start () {
  		keyCodes = System.Enum.GetValues(typeof(KeyCode)) as KeyCode[];
  		window = Window.newWindow("Hotkey Info",gameObject,"OnHotKeyWindow",windowWidth,windowHeight);
	}
	
	@RPC
	function setField(content : String){
		actions = Field.newField(content);
	}
	
	function getKeyCode(name : String){
		if (keyNames.ContainsKey(name)) return keyNames[name];
		for (var kc : KeyCode in keyCodes){
			if (kc.ToString() == name){
				keyNames[name] = kc;
				return keyNames[name];
			}
		}
	
	}
	
	function Update () {
		if (Input.anyKey && actions != null){
			for (var name : String in actions.getNames()){
				Debug.Log("looking whether " + name + " is pressed");
				if (Input.GetKey(getKeyCode(name))){
					Debug.Log(name + " is pressed");
					networkView.RPC("sendToPlayer",RPCMode.Server,Network.player,"luaCmd",actions.getField(name).serialize());
				}
			}
		}
		
	}
	
	function OnGUI(){
		if (selectingKey){
			
			GUI.Box(boxSelectKey,"");
			GUI.Label(lblSelectKey, "Press a key");
		}
	}
	
	function OnHotKeyWindow(){
		GUI.SetNextControlName("SelectButton");
		if (GUI.Button(btnSelectKey,"Select Key")){
			selectingKey = true;
			GUI.UnfocusWindow();
			GUI.FocusControl("SelectButton");
		}
		if (currentKey != KeyCode.None && actions != null){
			GUI.SetNextControlName("KeyAction");
			actions.atField(currentKey.ToString()).setString(
					GUI.TextField(txtKeyAction,actions.atField(currentKey.ToString()).getString()));
			if (GUI.Button(btnSave,btnSaveTxt)){
				networkView.RPC("sendToPlayer",RPCMode.Server,Network.player,"hotkeys",actions.serialize());
			}
		}
		if (selectingKey){
			var key : KeyCode = getKey();
			if (key != KeyCode.None){
				currentKey = key;
				selectingKey = false;
				GUI.FocusWindow(window.getWindowID());
			}
		}
		
		GUI.Label(lblCurrentKey,"Current Key: " + currentKey.GetHashCode().ToString() + " (" +currentKey.ToString() + ")");
	}
	
	
	function getKey() : KeyCode
	{
		if (Input.anyKey){
			for(var i : int = 0; i < keyCodes.Length; i++)
			{
			
				if (Input.GetKey(keyCodes[i]))
				{
					return keyCodes[i];
				}
			}
		}

		return KeyCode.None;
	}
}