#pragma strict

class ShipBuilder extends MonoBehaviour
{

	class SPart
	{
		var defaultName: String;
		var id : int;
	}

	final private static var windowHeight : int = 230;
	final private static var windowWidth : int = 200;
	final private static var btnEnable : Rect = Rect(20,20,160,30);
	final private static var btnEnableTxtOn : String = "Disable Building";
	final private static var btnEnableTxtOff : String = "Enable Building";
	final private static var lblSlots : Rect = Rect(20,70,150,20);
	final private static var lblSlotsTxt0 : String = "There are ";
	final private static var lblSlotsTxt1 : String = " slots.";
	final private static var lblSlotsTxtAlt : String = "Select a part.";
	final private static var lblSlotId : Rect = Rect(20,150,50,30);
	final private static var lblSlotIdTxt : String = "Slot: " ;
	final private static var txtSlot : Rect = Rect(80,150,20,20);
	final private static var btnNextSlot : Rect = Rect(110,150,20,20);
	final private static var btnNextSlotTxt : String = "+";
	final private static var btnPrevSlot : Rect = Rect(140,150,20,20);
	final private static var btnPrevSlotTxt : String = "-";
	final private static var txtName : Rect = Rect(20,110,90,20);
	final private static var btnApplyName : Rect = Rect(130,110,50,30);
	final private static var btnApplyNameTxt : String = "Apply";
	final private static var btnPrevPart : Rect = Rect(20,190,20,20);
	final private static var btnPrevPartTxt : String = "-";
	final private static var btnPart : Rect = Rect(50,190,100,20);
	final private static var btnNextPart : Rect = Rect(160,190,20,20);
	final private static var btnNextPartTxt : String = "+";
	final private static var btnRemove : Rect = Rect(20,190,160,20);
	final private static var btnRemoveTxt : String = "Remove ";
		
	final private static var partFile : String = "data/parts.dat";
	final private static var clippingDistance : int = 100;
 
	private var partData : Field;
	private var parts : SPart[];
	private var building : boolean = false;
	private var selected : GameObject = null;
	private var selectedPart : PartClient = null;
	
	private var slotId : int = 0;
	private var partname : String;
	private var partId : int =  0;
	
	var markerPrefab : Transform;
	var marker : Transform;

	function Start () {
		Window.newWindow("ShipBuilder", gameObject, "OnBuilderWindow",windowWidth,windowHeight);
		partData = Field.newField(FileIO.ReadFile(partFile));
		var parts : List.<Field> = partData.getFields("Part");
		this.parts = new SPart[parts.Count];
		for (var part : Field in parts){
			var spart = new SPart();
			spart.defaultName = part.getField("DefaultName").getString();
			spart.id = part.getField("Id").getInt();
			this.parts[part.getField("Id").getInt()] = spart;
		}
		
	}

	function Select(){
		if (Input.GetKeyDown(KeyCode.Mouse0)){
			
			var ray : Ray= Camera.main.ScreenPointToRay(Input.mousePosition);
			var hit : RaycastHit;
			if(Physics.Raycast(ray,hit,clippingDistance) )
			{
				if( hit.collider)
				{
					if(hit.collider.gameObject.GetComponent(PartClient) != null && hit.collider.gameObject.GetComponent(PartClient).isOwner())
					{
						selected = hit.collider.gameObject;
						selectedPart = hit.collider.gameObject.GetComponent(PartClient);
						partname = selectedPart.getName();
						if (marker) Destroy(marker.gameObject);
						
						marker = Instantiate(markerPrefab, selected.transform.position, selected.transform.rotation);
						marker.parent = selected.transform;
					} else {
						Debug.Log("invalid");
					}
				}  
				else
				{
					selected = null;
					selectedPart = null;
					if (marker) Destroy(marker.gameObject);
			    }    
			    
				Debug.Log(selected);
			}
		}
		
	}

	function Update () {
		if (building){
			Select();
		}else{
			selected = null;
		}
	}
	

	function OnBuilderWindow(){
		if (GUI.Button(btnEnable,(building) ? btnEnableTxtOn : btnEnableTxtOff)){
			building = !building;
		}
		GUI.Label(lblSlots, (building && selected) ? (lblSlotsTxt0 + selectedPart.getBuildingSlots().ToString() + lblSlotsTxt1) : lblSlotsTxtAlt);
		
		if (building && selected){
			if (selectedPart.getBuildingSlots()>0){
				
				//slot selector
				GUI.Label(lblSlotId,lblSlotIdTxt);
				
				var txt : String = GUI.TextField(txtSlot,slotId.ToString());
				int.TryParse(txt,slotId);
				slotId = Mathf.Clamp(slotId, 0, selectedPart.getBuildingSlots()-1);
				
				if (GUI.Button(btnNextSlot,btnNextSlotTxt)){
					slotId = (slotId + 1) % selectedPart.getBuildingSlots();
				}
				if (GUI.Button(btnPrevSlot,btnPrevSlotTxt)){
					slotId = (slotId - 1 + selectedPart.getBuildingSlots()) % selectedPart.getBuildingSlots();
				}
				
				marker.localPosition = selectedPart.getBuildingSlotPosition(slotId) ;
				
				
				if(selectedPart.getBuildingSlotChild(slotId)){
					//part remover
					selectedPart.getBuildingSlotChild(slotId).highlight();
					if (GUI.Button(btnRemove,btnRemoveTxt + selectedPart.getBuildingSlotChild(slotId).getName())){
						selectedPart.removeBuildingSlotChild(slotId);
					}
				}else{
					//part selector
					if (GUI.Button(btnPart,parts[partId].defaultName)){
						selectedPart.addBuildingSlotChild(partId,slotId,parts[partId].defaultName);
						
					}
					
					if (GUI.Button(btnNextPart,btnNextPartTxt)){
						partId = (partId + 1) % parts.length;
					}
					if (GUI.Button(btnPrevPart,btnPrevPartTxt)){
						partId = (partId - 1 + parts.length) % parts.length;
					}
				}
			}
			partname = GUI.TextField(txtName,partname);
			if (GUI.Button(btnApplyName,btnApplyNameTxt)){
				selectedPart.setName(partname);
			}
		}
	}

}