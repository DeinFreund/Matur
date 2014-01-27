#pragma strict

class Engine extends MonoBehaviour implements Part
{
	private var accel : float = 1.0;//relative percentage of acceleration 0.0 - 1.0
	private var maxAccel : float = 15000.0; //maximal thrust
	
	private var sldSpeedRect: Rect = Rect(10,10,20,100);
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) Update_S();
		
	}
	
	
	//////////
	//SERVER//
	//////////
	
	private var client : NetworkPlayer;
	
	function OnUserConnected(user : MinimalUser){
		if (!transform.parent.GetComponent(Ship).getOwner().getUsername().ToUpper() == user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setOwner",user.client);
	}
	
	
	function getType() :int 
	{
		
		return 2;
	}
	
	function Update_S(){
		if (!transform.parent) return;
		transform.parent.rigidbody.AddForceAtPosition(transform.forward * 1 *  accel * maxAccel * Time.deltaTime,transform.localPosition + transform.parent.position);
	}

	//////////
	//CLIENT//
	//////////
	
	
	private var isOwner : boolean = false;
	private var window : Window;
	
	@RPC 
	function setOwner(){
	
		isOwner = true;
		window = Window.newWindow("Engine",gameObject,"OnWindow");
	}
	
	function OnGUI(){
		if (!isOwner) return;
		
	}

	function OnWindow(winId:int){
		
		accel = GUI.VerticalSlider(sldSpeedRect,accel,1,0);
	}
	
	function Update_C(){
	
	}
	
}