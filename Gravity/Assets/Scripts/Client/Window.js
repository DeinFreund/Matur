#pragma strict

class Window extends MonoBehaviour
	{
	private var winRect: Rect = Rect(50,50,200,200);
	private var btnMaximized : Rect = Rect(5,5,20,10);
	private var winMaximized: boolean = true;

	private var title : String;
	private var owner : GameObject;
	private var message : String;

	static function newWindow(title : String,owner : GameObject, message : String) : Window
	{
		var window : Window = GameObject.Find("_ScriptManager").AddComponent(Window);
		window.title = title;
		window.owner = owner;
		window.message = message;
		return window;
	}
	
	
	function OnGUI(){
		
		winRect = GUI.Window(networkView.GetInstanceID(),winRect,OnWindow,title);
	}

	function OnWindow(winId:int){
		
		if (GUI.Button(btnMaximized,"click")){
			winMaximized = !winMaximized;
			if (winMaximized){
			winRect.height = 200;
			}else
			{
			winRect.height = 50;
			}
		}
		
		owner.SendMessage(message,winId);	
		
		GUI.DragWindow ();
		
	}

}