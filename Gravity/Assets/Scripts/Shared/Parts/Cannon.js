#pragma strict

class Cannon extends MonoBehaviour implements Part
{
	
	private var owner : Player;
	
	function getType() :int 
	{
		
		
		return 1;
	}
	
	function Start(){
		owner = transform.parent.GetComponent(Ship).getOwner();
	}
	
	function Fire(){
		
	}
}