#pragma strict

private var inpSpeed = "0";
private var inpDistance = "0";
var sphere:Transform;

function Start () {

}

function OnGUI(){
	if (!Input.GetButton("FreezeCamera")){return;}
	inpSpeed=GUI.TextField (Rect (25, 25, 100, 20), inpSpeed);
	inpDistance=GUI.TextField (Rect (25, 50, 100, 20), inpDistance);
	if (GUI.Button (Rect (25,75,100,20), "Add")) {
		var nObj = Instantiate(sphere,Gravity.objekte[0].transform.position,new Quaternion());
	}
}
	
function Update () {

	if(Input.GetKey("w")){
		this.transform.Translate(0,0,0.1 );
	}
	if(Input.GetKey("s")){
		this.transform.Translate(0,0,-0.1 );
	}
	if(Input.GetKey("d")){
		this.transform.Translate(0.1,0,0 );
	}
	if(Input.GetKey("a")){
		this.transform.Translate(-0.1,0,0 );
	}
}