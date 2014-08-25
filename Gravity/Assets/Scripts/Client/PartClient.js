#pragma strict


public class PartClient extends MonoBehaviour
{
	//enables RPC communication to any part on clientside
	
	//////////
	//CLIENT//
	//////////
	
	final private static var highlightTime : float = 0.1;
	final private static var clippingDistance : int = 100;
	var materialNormal : Material;
	var materialHighlighted : Material;
	private var lastHighlight : float = 0;
	private var highlighted : boolean = false;
	
	private var partname : String = "Loading...";
	private var partnameKnown : boolean = false;
	private var owner : boolean = false;
	
	private var buildingSlotPos : Vector3[];
	private var buildingSlotChildren : PartClient[];
	private var requestedBuildingSlots : boolean = false;
	
	
	function Start(){
		renderer.material = materialNormal;
	}
	
	function OnNetworkLoadedLevel(){
		if (Network.isClient){
			getName();
		}
	}
	
	function Update(){
		
		var ray : Ray= Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		if(Physics.Raycast(ray,hit,clippingDistance) ){
			if (hit.collider.gameObject == gameObject) OnMouseOver();
		}
		if (renderer.sharedMaterial == materialHighlighted && !highlighted && Time.time - lastHighlight > highlightTime){
			renderer.material = materialNormal;//turn temporary highlight off after some time
		}
		
		if (Network.isClient) Update_C();
		
		if (Network.isServer) enabled = false;
	}
		
	function Update_C(){
	}
	/*
	function OnMouseEnter(){
		highlight(true);
	}
	function OnMouseExit(){
		highlight(false);
	}
	*/
	function OnMouseOver(){
		highlight();
	}
	
	function isOwner() : boolean{
		return owner;
	}
	
	public function highlight(active : boolean){
		highlighted = active;
		if (highlighted){
			highlight();
		}
	}
	public function highlight(){
		if (renderer.sharedMaterial == materialNormal){
			renderer.material = materialHighlighted;
		}
		lastHighlight = Time.time;
	}
	
	public function getName() : String{
		if (!partnameKnown){
			networkView.RPC("RequestName",RPCMode.Server);
		}
		return partname;
	}
	
	public function setName(name : String){
		if (!Network.isClient) return;
		networkView.RPC("setServerName",RPCMode.Server,name);
		partname = name;
	}
	
	public function getBuildingSlots() : int{
		if (buildingSlotPos == null ) {
			if (!requestedBuildingSlots){
				networkView.RPC("RequestBuildingSlots",RPCMode.Server);
				requestedBuildingSlots = true;
			}
			return 0;
		}else{
			return buildingSlotPos.length;
		}
	}
	public function getBuildingSlotPosition(i : int) : Vector3{
		if (buildingSlotPos) return buildingSlotPos[i];
		return Vector3.zero;//watch out, this is NOT null
	}
	public function getBuildingSlotChild(i : int) : PartClient{
		if (buildingSlotChildren) return buildingSlotChildren[i];
		return null;
	}
	
	public function removeBuildingSlotChild(i : int){
		networkView.RPC("removeBuildingSlotChildS",RPCMode.Server,i);
	}
	public function addBuildingSlotChild(type: int, i : int){
		addBuildingSlotChild(type,i,"");
	}
	public function addBuildingSlotChild(type: int, i : int, name : String){
		networkView.RPC("addBuildingSlotChildS",RPCMode.Server,type,i,name);
	}
	
	@RPC
	function setBuildingSlots(pos : Vector3[], id : NetworkViewID[]){
		buildingSlotPos = pos;
		buildingSlotChildren = new PartClient[id.length];
		for (var i : int = 0; i < id.length; i++){
			var nv: NetworkView = NetworkView.Find(id[i]);
			if (nv){
				buildingSlotChildren[i] = nv.gameObject.GetComponent(PartClient);
			}else{
				buildingSlotChildren[i] = null;
			}
		}
	}
	
	@RPC
	function setNameByServer(name : String){
		partname = name;
	}
	@RPC
	function setPartOwner(owner : boolean){
		Debug.Log("set owner" + partname);
		this.owner = owner;
	}
	
	
}
