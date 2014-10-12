#pragma strict

var asteroids : int = 1000;
var minRadius : float = 50;
var maxRadius : float = 500;
var centreLocal : Vector3 = Vector3.zero;
var maxAngularVelocity : float = 30;

static private var mass : float  = 0;
static private var centre : Vector3;
static private final var G : float = 6.673e-11;

function Generate () {
	
	var roids : Transform[] = Prefabs.getAsteroidPrefabs();
	centre = centreLocal;
	/*for (var r : Transform in roids){
		mass += r.GetComponent(Gravity).mass;
	}
	mass *= asteroids / roids.Length;*/
	mass = Prefabs.getPlanetPrefab().GetComponent(Gravity).mass;
	
	for (var i : int = 0; i < asteroids ; i++){
		var prefab = roids[Random.Range(0,roids.Length)];
		var radius : float = Mathf.Sqrt(Random.value) * (maxRadius - minRadius) + minRadius;
		var speed : float =Mathf.Sqrt(G*(mass+prefab.GetComponent(Gravity).mass)/radius);
		var angle : float = Random.value * 2* Mathf.PI;
		var pos : Vector3 = radius * new Vector3(Mathf.Cos(angle),0,Mathf.Sin(angle)) + centre;
		var velocity : Vector3 = Vector3.Cross(centre-pos,Vector3.up).normalized * speed;
		var rot : Quaternion = Random.rotation;
		var obj = Network.Instantiate(prefab,pos,rot,NetworkGroup.ENVIRONMENT);
		obj.rigidbody.velocity = velocity;
		obj.rigidbody.angularVelocity = Random.insideUnitSphere * maxAngularVelocity;
	}
	Network.Instantiate(Prefabs.getPlanetPrefab(),centre,Quaternion.identity,NetworkGroup.ENVIRONMENT);
	Debug.Log("Generated " + asteroids + " asteroids.");
}

static function getOrbitalVelocity(go : GameObject) : Vector3{
	
		var speed : float =Mathf.Sqrt(G*(mass+go.GetComponent(Gravity).mass)/Vector3.Distance(go.transform.position,centre));
		Debug.LogWarning("Sqrt(" + G + " * (" + mass + " + " + go.GetComponent(Gravity).mass + ") / " + Vector3.Distance(go.transform.position,centre) + ") = "  +speed);
		return Vector3.Cross(centre-go.transform.position,Vector3.up).normalized * speed;
		
}