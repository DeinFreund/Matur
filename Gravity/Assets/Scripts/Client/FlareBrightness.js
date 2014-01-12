

 //Coordinates for the right and left hand sides of the screen respectively 

 //Change to "1" and "0" if you want the flare to disappear as soon as its invisible to the camera's frustrum.

 var coord1 = 1;  

 var coord2 = 0;

 var cam:Camera ;
 

 //The strength of the flare relative to it's distance from the camera ("brightness = strength/distance")

 var strength:float = 5;

 var falloff:boolean=true;
 

 //Simple counter to ensure that the flare is visible for a few frames before the layer is changed

 var count = 0;

 

 function Start()

 {

 //Ensures that the flare's layer isn't part of its ingore list to begin with

 //Change to whatever you want, as long as it's not on the ignore list

	 gameObject.layer= 0;

 }

 

 function Update () 

 {
	if (!Camera.current) return;
 	if (!cam) cam = Camera.current;
	 var heading: Vector3 = gameObject.transform.position - cam.transform.position;
	 var heading2: Vector3 = cam.transform.position -gameObject.transform.position;
	 var dist: float = Vector3.Dot(heading, cam.transform.forward);
	 var viewPos : Vector3 = cam.WorldToViewportPoint (gameObject.transform.position);
	
	 
	 //Turns off the flare when it goes outside of the camera's frustrum
	 if( viewPos.x > coord1 || viewPos.x < coord2 || viewPos.y < coord2 || viewPos.y > coord1)
	 	gameObject.GetComponent(LensFlare).brightness = 0;
	 
	 //Turns off the flare when it's occluded by a collider.
	 else if (Physics.Raycast (gameObject.transform.position, heading2.normalized, Mathf.Clamp(dist,0.01,20)))
	 	gameObject.GetComponent(LensFlare).brightness = 0;
	
	 else{
	 	gameObject.GetComponent(LensFlare).brightness = strength/(falloff ? dist : 1);
	 }
 }