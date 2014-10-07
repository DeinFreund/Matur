#pragma strict

var img : Texture;
var health : float = 0.8;

function Start () {
	img = Prefabs.getHealthbarTexture();
}

function Update () {

}

function OnGUI(){
	GUI.BeginGroup(Rect(Screen.width - img.width,Screen.height - img.height,health*img.width, img.height));
	GUI.Label(Rect(0,0,img.width,img.height),img);
	GUI.EndGroup();
}