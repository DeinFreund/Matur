var target : Transform;
var distance = 10.0;
var minDistanceLimit = -50.0;
var minSwitchDistance = 10;
var maxDistanceLimit = 5000.0;
var distancePow = 2.0;
var defaultFOV : int = 60;

var xSpeed = 250.0;
var ySpeed = 120.0;
var scrollSpeed = -200.0;

var yMinLimit = -20;
var yMaxLimit = 80;

private var x = 0.0;
private var y = 0.0;
private var distanceMult : int = 1 ;

@script AddComponentMenu("Camera-Control/Mouse Orbit")

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function LateUpdate () {
    if (target ) {
    	if (Input.GetButton("MouseOrbit")){
	        x += Input.GetAxis("Mouse X") * xSpeed * 0.0003 * Camera.main.fieldOfView;
	        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.0003 * Camera.main.fieldOfView;
 		}
        distance += Input.GetAxis("Mouse ScrollWheel") * scrollSpeed * 0.02 * Mathf.Abs(distance);
        if (Mathf.Abs(distance) < minSwitchDistance) distance -= minSwitchDistance * 2 * Mathf.Sign(distance);
        
        distance = Mathf.Clamp(distance,minDistanceLimit,maxDistanceLimit);
 		
 		y = ClampAngle(y, yMinLimit, yMaxLimit);
 		       
        var rotation = Quaternion.Euler(y, x, 0);
        var position : Vector3;
        if (distance > 0){
        //move camera
        	position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
        	Camera.main.fieldOfView = defaultFOV;
        }else{
        	position = rotation * Vector3(0.0, 0.0, minSwitchDistance) + target.position;
        	Camera.main.fieldOfView = defaultFOV + minSwitchDistance + distance;
        }
        
        transform.rotation = rotation;
        transform.position = position;
    }
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}