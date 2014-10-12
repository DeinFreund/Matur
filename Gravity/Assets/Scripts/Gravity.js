#pragma strict
import System.Collections.Generic;

public static var objekte : List. < GameObject > = new List.<GameObject>();

var mass : float;
private static var rate : float = 0.3;
private var last : float = 0;

function Start () {
	
	objekte.Add(this.gameObject);
	if (Network.isClient) enabled = false;
}

function Update () {
	if (Time.time-last<rate) return;
	var o=this.gameObject;
		for (var o2:GameObject in objekte){
			if (o.transform.position != o2.transform.position)
			{
				o.transform.rigidbody.velocity+=((o2.transform.position-o.transform.position).normalized * (Time.time - last) * 
						CalcForce(1,o2.GetComponent(Gravity).mass, Vector3.Distance(o.transform.position,o2.transform.position)));
				
			}
			//print (CalcForce(o.rigidbody.mass,o2.rigidbody.mass, Vector3.Distance(o.transform.position,o2.transform.position)));
			
		}	
	last = Time.time;
	
}


function CalcForce(m1:double, m2:double, dist:double):double {
	var result:double=(m1*m2)/(dist*dist) * 6.67384e-11;
	return result; 
}