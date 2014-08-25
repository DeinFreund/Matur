#pragma strict

class HotKeyManager extends MonoBehaviour
{
	final private var btnSelectKey : Rect = new Rect(20,30,100,30);
	final private var lblCurrentKey : Rect = new Rect(140,30,200,30);
	final private var lblSelectKey : Rect = new Rect(Screen.width/2-50,Screen.height / 2 - 5,400,300);
	final private var boxSelectKey : Rect = new Rect(Screen.width/2-200,Screen.height / 2 - 150,400,300);
	final private var windowWidth : int = 360;
	final private var windowHeight : int = 75;

	static private var keyCodes : KeyCode[];
	
	private var currentKey : KeyCode = KeyCode.None;
	private var selectingKey : boolean = false;

	function Start () {
  		keyCodes = System.Enum.GetValues(typeof(KeyCode)) as KeyCode[];
  		Window.newWindow("Hotkey Info",gameObject,"OnHotKeyWindow",windowWidth,windowHeight);
	}
	
	
	
	function Update () {
		
		
	}
	
	function OnGUI(){
		if (selectingKey){
			
			GUI.Box(boxSelectKey,"");
			GUI.Label(lblSelectKey, "Press a key");
		}
	}
	
	function OnHotKeyWindow(){
		if (GUI.Button(btnSelectKey,"Select Key")){
			selectingKey = true;
			
		}
		if (selectingKey){
			var key : KeyCode = getKey();
			if (key != KeyCode.None){
				currentKey = key;
				selectingKey = false;
			}
		}
		
		GUI.Label(lblCurrentKey,"Current Key: " + currentKey.GetHashCode() + " (" +currentKey.ToString() + ")");
	}
	
	
	function getKey() : KeyCode
	{
		for(var i : int = 0; i < keyCodes.Length; i++)
		{
		
			if (Input.GetKey(keyCodes[i]))
			{
				return keyCodes[i];
			}
		}

		return KeyCode.None;
	}
}