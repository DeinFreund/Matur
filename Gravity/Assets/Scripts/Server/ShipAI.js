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
	
	function log(s : String){
		Debug.Log("(Ship " + ship.getShipId() + "): " + s);
	}
	
	/*public function setTorque(amt : float, x : float,y : float, z: float, name : String){
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
		//log(st + " -> " + ta + ": " + v + " vs " + so);
		//v= Vector3(-0.6,0.6,-0.6);
		//amt = am;
		//var rot : Quaternion =  s Quaternion.Inverse(ship.getTransform().rotation);
		//rot.ToAngleAxis(a,v);
		//amt = a / 180f;
		//log("calledSetTorque " + ship.getParts(name).Count);
		for (var p : Part in ship.getParts(name)){
			var rw: ReactionWheel =  p as ReactionWheel;
			if (rw){
				rw.setRotAccel(amt);
				rw.setRotAxis(v);
			}
		}
	}*/
	
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
		lua.RegisterFunction("setEngine",this,this.GetType().GetMethod("setEngine"));
		lua.RegisterFunction("setTarget",this,this.GetType().GetMethod("selectTarget"));
		lua.RegisterFunction("fire",this,this.GetType().GetMethod("fire"));
		lua.RegisterFunction("_getObjectDirection",this,this.GetType().GetMethod("getObjectDirection"));
		//lua.RegisterFunction("_torque",this,this.GetType().GetMethod("setTorque"));
		lua.RegisterFunction("_addTorque",this,this.GetType().GetMethod("addTorque"));
		lua.RegisterFunction("_setTorque",this,this.GetType().GetMethod("setTorque"));
		lua.RegisterFunction("_getUp",this,this.GetType().GetMethod("getUp"));
		lua.RegisterFunction("_getForward",this,this.GetType().GetMethod("getForward"));
		lua.RegisterFunction("_getRight",this,this.GetType().GetMethod("getRight"));
		lua.RegisterFunction("_addAngleAxis",this,this.GetType().GetMethod("addAngleAxis"));
		lua.RegisterFunction("_getObjectDistance",this,this.GetType().GetMethod("getObjectDistance"));
		lua.RegisterFunction("_getInverse",this,this.GetType().GetMethod("getInverse"));
		log("Registered Funcs");
		//load file
		try{
			lua.DoFile(luaLibPath);
			lua.DoFile(path);
		}catch(ex){
			log("LuaException: " + ex);
		}
		try{
			updateFunc = lua.GetFunction("update");
		}catch(ex){
			log("LuaException while looking for funcs: " + ex);
		}
	}
	
	function RunScript(){
		try{
			lua.DoString("CallMe('hi')");
		}catch(ex){
			log("LuaException: " + ex);
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
		//log("roll " + roll + "pitch " + pitch + "yaw " + yaw );
		axis = ship.getTransform().forward;
		try{
			if(!lua){
				log("lua is null, restarting Lua");
				restartLua();
			}
			lua["time"] = GlobalVars.getTime();
			setVector3("rotationAxis",axis);
			lua["rotationAngle"] = roll;
			setVector3("rotation",ship.getTransform().rotation.eulerAngles);
			if (updateFunc)	updateFunc.Call();
		}catch(ex){
			log("LuaException during update: " + ex);
		}
	}
	
	function PrintToClient(str : String){
		log("Lua printing " + str);
		ship.getGameObject().networkView.RPC("PrintToClient",RPCMode.Others,str);
	}
	
	function CallMe(i : int){
		log("I was called!" + i);
	}
	function setEngine(name : String, val : float){
		var ls = ship.getParts(name);
		
		if (name == "") ls = ship.getParts(2);
		//log(ls.Count + " parts with name " + name);
		for (var part : Part in ls){
			if (part.getType() == 2){
				(part as Engine).setAccel(val);
			}else{
				log("not an engine");
			}
		}
	}
	function setSAS(x : float, y :float, z: float, on : boolean){
		ship.transform.GetComponent(SAS).setTargetDir(new Vector3(x,y,z));
		ship.transform.GetComponent(SAS).enable(on);
	}
	function getInverse(x : float, y :float, z: float, w:float){
		setQuaternion("_getInverseRet",Quaternion.Inverse(new Quaternion(x,y,z,w)));
	}
	function getObjectDistance(objectID : int){
		var dist = Vector3.Distance(ship.transform.position, RadarBlob.getBlob(objectID).transform.position);
		lua["_getObjectDistanceRet"] = dist;
	}
	function getObjectDirection(objectID : int){
		log("setting object direction of id " + objectID);
		//var q : Quaternion = Quaternion.LookRotation(RadarBlob.getBlob(objectID).transform.position-ship.transform.position,Vector3.up);
		
		setVector3("_getObjectDirectionRet",(RadarBlob.getBlob(objectID).transform.position-ship.transform.position).normalized);
		//var vec : Vector3 = Vector3.RotateTowards(ship.transform.position,RadarBlob.getBlob(objectID).transform.position);
	}
	function selectTarget(id : int){
		log("selected Target " + id);
		for (var part : Part in ship.getParts(3)){
			var radar : Radar = part as Radar;
			radar.selectBlob(id);
		}
	}
	function fire(name : String){
		log('firing cannons with name "' + name + '"');
		var cannon : Cannon;
		if (name == "") { 
			for (var part : Part in ship.getParts(1)){
				cannon = part as Cannon;
				cannon.Fire();
			}
		}
		else{
			for (var part : Part in ship.getParts(name)){
				if (part.getType() == 1){
					cannon = part as Cannon;
					cannon.Fire();
				}
			}
		}
	}
	function objectEnteredRadar(objectID : int){
		try{
			lua.DoString("objectEnteredRadar(" + objectID +")");
		}catch(ex){
			log("LuaException during objectEnteredRadar: " + ex);
		}
		
	}
	function objectExitedRadar(objectID : int){
		try{
			lua.DoString("objectExitedRadar(" + objectID +")");
		}catch(ex){
			log("LuaException during objectExitedRadar: " + ex);
		}
	}
	function executeString(string : String){
		lua.DoString(string);
	}
	function addTorque(amt : float, x : float, y : float, z : float){
		(ship.getGameObject().GetComponent(SAS) as SAS).addTorque(amt, new Vector3(x,y,z));
	}
	function setTorque(x : float, y : float, z : float){
		(ship.getGameObject().GetComponent(SAS) as SAS).setPermanentTorque(new Vector3(x,y,z));
	}
	function getUp(){
		setVector3("_getUpRet",ship.getTransform().up);
	}
	function getForward(){
		setVector3("_getForwardRet",ship.getTransform().forward);
	}
	function getRight(){
		setVector3("_getRightRet",ship.getTransform().right);
	}
	
}