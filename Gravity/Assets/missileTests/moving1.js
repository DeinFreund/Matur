#pragma strict

	var force : float = 0.5;
	
	function Start() {
	}
	
	function Update () {
			rigidbody.AddForce(force * (-transform.position).normalized);
	}