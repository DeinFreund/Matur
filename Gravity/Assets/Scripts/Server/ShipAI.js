#pragma strict

class ShipAI{

	private static final var luaLibPath : String = "data/lualib.lua";

	private var lua : Lua;
	private var path : String;
	private var ship : Ship;
	private var updateFunc : LuaFunction;
	
	//Script handler
	
	public function ShipAI(scriptpath : String, ship: Ship){
		//constructor
		path = scriptpath;
		this.ship = ship;
		restartLua();
	}
	var xx : float;
	var yy : float;
	var zz : float;
	var am : float = 0;
	
	public function setTorque(amt : float, x : float,y : float, z: float, name : String){
		var v : Vector3 = new Vector3(x,y,z);
		var target = Quaternion.AngleAxis(90f,Vector3(xx,yy,zz));
		target = Quaternion.AngleAxis(90f,Vector3(0f,1f,0f));
		var start = ship.getTransform().rotation;
		var sol = target * Quaternion.Inverse(start);
		var ta : Vector3; var st : Vector3;
		var a: float;
		target.ToAngleAxis(a,ta);
		start.ToAngleAxis(a,st);
		st = ship.getTransform().forward;
		//v = Vector3.Cross(ta,st);
		Debug.DrawLine(ship.getTransform().position,ship.getTransform().position + st * 20,Color.blue,0.4f);
		Debug.DrawLine(ship.getTransform().position,ship.getTransform().position + ta * 20,Color.green,0.4f);
		var so : Vector3;
		sol.ToAngleAxis(a,so);
		//ship.getTransform().rotation = target;
		//Debug.Log(st + " -> " + ta + ": " + v + " vs " + so);
		//v= Vector3(-0.6,0.6,-0.6);
		//amt = am;
		//var rot : Quaternion =  s Quaternion.Inverse(ship.getTransform().rotation);
		//rot.ToAngleAxis(a,v);
		//amt = a / 180f;
		//Debug.Log("calledSetTorque " + ship.getParts(name).Count);
		for (var p : Part in ship.getParts(name)){
			var rw: ReactionWheel =  p as ReactionWheel;
			if (rw){
				rw.setRotAccel(amt);
				rw.setRotAxis(v);
			}
		}
	}
	
	public function addAngleAxis(w1 : float,x1 : float,y1 : float,z1 : float, w2 : float, x2 : float,y2 : float,z2 : float){
		var q : Quaternion = Quaternion.AngleAxis(w1,Vector3(x1,y1,z1));
		q = q * Quaternion.AngleAxis(w2,Vector3(x2,y2,z2));
		var axis : Vector3; var angle : float;
		q.ToAngleAxis(angle,axis);
		lua["_addAngleAxisW"] = angle;
		lua["_addAngleAxisX"] = axis.x;
		lua["_addAngleAxisY"] = axis.y;
		lua["_addAngleAxisZ"] = axis.z;
	}
	
	public function restartLua(){
		lua = new Lua();
		//register functions
		
		lua.RegisterFunction("print",this,this.GetType().GetMethod("PrintToClient"));
		lua.RegisterFunction("_setSAS",this,this.GetType().GetMethod("setSAS"));
		lua.RegisterFunction("_getObjectDirection",this,this.GetType().GetMethod("getObjectDirection"));
		lua.RegisterFunction("_torque",this,this.GetType().GetMethod("setTorque"));
		lua.RegisterFunction("_addAngleAxis",this,this.GetType().GetMethod("addAngleAxis"));
		Debug.Log("Registered Funcs");
		//load file
		try{
			lua.DoFile(luaLibPath);
			lua.DoFile(path);
		}catch(ex){
			Debug.Log("LuaException: " + ex);
		}
		try{
			updateFunc = lua.GetFunction("update");
		}catch(ex){
			Debug.Log("LuaException while looking for funcs: " + ex);
		}
	}
	
	function RunScript(){
		try{
			lua.DoString("CallMe('hi')");
		}catch(ex){
			Debug.Log("LuaException: " + ex);
		}
		lua.DoString("CallMe(5)");
	}
	
	private function setVector3(name : String, vec : Vector3){
		lua.DoString(name + " = {" + vec.x + ", "+ vec.y + ", "+ vec.z + "}\n");
	}
	private function setQuaternion(name : String, q : Quaternion){
		lua.DoString(name + " = {" + q.x + ", "+ q.y + ", "+ q.z + ", " + q.w +  "}\n");
	}
	
	public function Update(){
	
		var axis : Vector3; var angle : float;
		ship.getTransform().rotation.ToAngleAxis(angle,axis);
		//angle = ship.getTransform().localEulerAngles.y;
		var x = ship.getTransform().rotation.x;
		var y = ship.getTransform().rotation.y;
		var z = ship.getTransform().rotation.z;
		var w = ship.getTransform().rotation.w;
		var roll  = Mathf.Atan2(2*y*w - 2*x*z, 1 - 2*y*y - 2*z*z) * 180 / Mathf.PI;
		var pitch = Mathf.Atan2(2*x*w - 2*y*z, 1 - 2*x*x - 2*z*z) * 180 / Mathf.PI;
		var yaw   =  Mathf.Asin(2*x*y + 2*z*w) * 180 / Mathf.PI;
		//Debug.Log("roll " + roll + "pitch " + pitch + "yaw " + yaw );
		axis = ship.getTransform().forward;
		try{
			lua["time"] = GlobalVars.getTime();
			setVector3("rotationAxis",axis);
			lua["rotationAngle"] = roll;
			setVector3("rotation",ship.getTransform().rotation.eulerAngles);
			if (updateFunc)	updateFunc.Call();
		}catch(ex){
			Debug.Log("LuaException during update: " + ex);
		}
	}
	
	function PrintToClient(str : String){
		Debug.Log("Lua printing " + str);
		ship.getGameObject().networkView.RPC("PrintToClient",RPCMode.Others,str);
	}
	
	function CallMe(i : int){
		Debug.Log("I was called!" + i);
	}
	
	function setSAS(x : float, y :float, z: float, w:float, on : boolean){
		ship.transform.GetComponent(SAS).setTargetRot(new Quaternion(x,y,z,w));
		ship.transform.GetComponent(SAS).enable(on);
	}
	function getObjectDirection(objectID : int){
		var q : Quaternion = Quaternion.LookRotation(ship.transform.position, RadarBlob.getBlob(objectID).transform.position);
		setQuaternion("_getObjectDirectionRet",q);
		//var vec : Vector3 = Vector3.RotateTowards(ship.transform.position,RadarBlob.getBlob(objectID).transform.position);
	}
	function objectEnteredRadar(objectID : int){
		lua.DoString("objectEnteredRadar(" + objectID +")");
	}
	
}