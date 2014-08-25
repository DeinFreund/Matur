#pragma strict

class ReactionWheel extends Part
{
	private var accel : float = 0.0;//relative percentage of acceleration -1.0 - +1.0
	private var maxAccel : float = 2; //maximal thrust
	private var rotAxis : Vector3;
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) Update_S();
		
	}
	
	
	
	//////////
	//SERVER//
	//////////
	
	
	private var client : NetworkPlayer;
	private var data : Field;
	private var shipRigidbody : Rigidbody;
	//private var partname : String = "";
	private var clientOnline : boolean = false;
	
	function OnUserConnected(user : MinimalUser){
		if (!Ship.getShip(transform)) return;
		
		if (Ship.getShip(transform).getOwner().getUsername().ToUpper() != user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setOwner",user.client);
		clientOnline = true;
	}
	
	function OnPlayerDisconnected(player : NetworkPlayer){
		if (client != player) return;
		clientOnline = false;
	}
	
	function getType() :int 
	{
		
		return 4;
	}
	
	
	function getName() : String 
	{
		return partname;
	}
	function setName(name : String){
		Ship.getShip(transform).unregisterPart(this,partname);
		Ship.getShip(transform).registerPart(this,name);
		partname = name;
		
	}
	
	function Update_S(){
		if (!transform.parent) return;
		//Debug.Log(shipRigidbody);
		shipRigidbody.AddTorque(rotAxis * accel * maxAccel);
		//shipRigidbody.angularVelocity += rotAxis * accel * maxAccel / shipRigidbody.mass;
		//shipRigidbody.transform.Rotate(rotAxis * accel * maxAccel / shipRigidbody.mass);
		Debug.DrawLine(Ship.getShip(transform).getTransform().position,Ship.getShip(transform).getTransform().position + rotAxis * 20,Color.red,0.4f);
	}
	
	function LoadPart(field : Field){
		Debug.Log(field.getId());
		this.accel = field.atField("accel").getFloat();
		gameObject.SendMessage("setName",field.atField("Name").getString());
		this.data = field;
		shipRigidbody = Ship.getShip(transform).getGameObject().rigidbody;
	}
	
	function Unload(){
		data.getField("accel").setFloat(accel);
		data.getField("Name").setString(partname);
		
		networkView.RPC("UnloadClient",RPCMode.Others);
		Network.Destroy(networkView.viewID);
		
	}
	
	
	@RPC
	function setRotAxis(axis : Vector3){
		axis.Normalize();
		rotAxis = axis;
		//Debug.Log("set axis to " + axis);
	}
	
	@RPC
	function setRotAccel(accel : float){
		if (Mathf.Abs(accel) > 1){
			Debug.LogWarning("Invalid acceleration: " + accel);
			return;
		} 
		//Debug.Log("set accel to " + accel);
		this.accel = accel;
	}

	//////////
	//CLIENT//
	//////////
	
	
	
	private var sldSpeedRect: Rect = Rect(10,10,20,100);
	private var sldX: Rect = Rect(30,10,20,100);
	private var sldY: Rect = Rect(50,10,20,100);
	private var sldZ: Rect = Rect(70,10,20,100);
	
	private var isOwner : boolean = false;
	private var window : Window;
	private var oldAccel : float = -1;
	private var oldvec : Vector3 = Vector3.zero;
	private var x : float = -1;
	private var y : float = -1;
	private var z : float = -1;
	private var vec : Vector3;
	
	@RPC 
	function setOwner(){
	
		isOwner = true;
		window = Window.newWindow("Engine",gameObject,"OnWindow",200,200);
	}
	
	@RPC
	function UnloadClient(){
		window.Unload();
	}
	
	function OnGUI(){
		if (!isOwner) return;
		
	}

	function OnWindow(winId:int){
		accel = GUI.VerticalSlider(sldSpeedRect,accel,1,-1);
		x = GUI.VerticalSlider(sldX,x,1,0);
		y = GUI.VerticalSlider(sldY,y,1,0);
		z = GUI.VerticalSlider(sldZ,z,1,0);
	}
	
	function Update_C(){
		if (!isOwner) return;
		vec = new Vector3(x,y,z);
		if (accel != oldAccel) 
		{
			networkView.RPC("setRotAccel",RPCMode.Server,accel);
			GetComponentInChildren(EngineLight).accel = accel;
			oldAccel = accel;
		}
		if (vec != oldvec) 
		{
			Debug.DrawLine(transform.position,transform.position + 10*vec,Color.red,1f,true);
			Debug.Log(transform.position+ "|" + transform.position + 10*vec);
			networkView.RPC("setRotAxis",RPCMode.Server,vec);
			
			oldvec = vec;
		}
	}
	
}