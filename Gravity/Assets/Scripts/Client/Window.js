#pragma strict

class Window extends MonoBehaviour
	{
	static private var winHeightMinimized : int = 20;
	static private var winWidthMinimized : int = 150;

	static private var btnMaximized : Rect = Rect(5,5,20,10);
	static private var windowCount = 0;
	private var winMaximized: boolean = true;

	private var title : String;
	private var owner : GameObject;
	private var message : String;
	private var id : int;
	
	private var winRect: Rect = Rect(200,50,200,200);
	private var winHeightMaximized: int = 200;
	private var winWidthMaximized: int = 200;
	

	static function newWindow(title : String,owner : GameObject, message : String, width : int, height : int) : Window
	{
		var window : Window = GameObject.Find("_ScriptManager").AddComponent(Window);
		window.title = title;
		window.owner = owner;
		window.message = message;
		window.winRect.width = width;
		window.winRect.height = height;
		window.winHeightMaximized = height;
		window.winWidthMaximized = width;
		window.id = getUniqueID();
		Debug.Log("New window instantiated (" + title + ", " + owner + ", " + message + ")");
		return window;
	}
	
	static function getUniqueID() : int
	{
		windowCount ++;
		return windowCount;
	}
	
	function OnGUI(){
		
		GUI.skin = Prefabs.getGUISkin();
		winRect = GUI.Window(id,winRect,OnWindow,title);
	}

	function OnWindow(winId:int){
		
		if (GUI.Button(btnMaximized,"-")){
			winMaximized = !winMaximized;
			if (winMaximized){
			winRect.height = winHeightMaximized;
			winRect.width = winWidthMaximized;
			}else
			{
			winRect.height = winHeightMinimized;
			winRect.width = winWidthMinimized;
			}
		}
		
		owner.SendMessage(message,winId);
		GUI.DragWindow ();
		
	}
	
	public function Unload(){
		Destroy(this);
	}

}