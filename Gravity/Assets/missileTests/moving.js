#pragma strict

	var force : float = 0.5;
	
	function Start() {
	}
	
	function Update () {
		if (transform.position.y > 0){
			rigidbody.AddForce(Vector3.up*-force);
		}else{
			rigidbody.AddForce(Vector3.up*force);
		}
	}