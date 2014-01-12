#pragma strict
import System.Collections.Generic;

public static var objekte : List. < GameObject > = new List.<GameObject>();

function Start () {
	
	objekte.Add(this.gameObject);
	transform.rigidbody.AddForce(transform.forward * 1e4);
}

function Update () {

	var o=this.gameObject;
		for (var o2:GameObject in objekte){
			transform.LookAt(o2.transform.position);
			if (o.transform.position.x != o2.transform.position.x)
			{o.transform.rigidbody.AddForce(1e9 * transform.forward * CalcForce(o.rigidbody.mass,o2.rigidbody.mass, Vector3.Distance(o.transform.position,o2.transform.position)));}
			//print (CalcForce(o.rigidbody.mass,o2.rigidbody.mass, Vector3.Distance(o.transform.position,o2.transform.position)));
			
		}	
	
}


function CalcForce(m1:double, m2:double, dist:double):double {
	var result:double=(m1*m2)/(dist*dist) * 6.67384e-11;
	return result;
}