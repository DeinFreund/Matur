#pragma strict

@script RequireComponent (IndieEffects)
@script AddComponentMenu ("Indie Effects/ExposureAdapt")
import IndieEffects;

private var exposureMat : Material;
var exposureShader : Shader;
@range (0,2)
var exposure : float;
@range (0,2)
var targetLuminance : float;
@range (0,5)
var radius : float;
@range(0,2)
var amount : float;


var updatesPerSecond : float = 2;

var maxSpeed : float = 1.05;

private var compensate:float = 1;
private var lastUpdate:float=0;

function Start () {
	exposureMat = new Material(exposureShader);
}

function Update () {
	exposureMat.SetTexture("_MainTex", renderTexture);
	exposureMat.SetFloat("_normMax", exposure);
	exposureMat.SetTexture("_BlurTex", renderTexture);
	exposureMat.SetFloat("_Radius", radius);
	exposureMat.SetFloat("_Amount", amount);
	
	if (Time.time - 1f/updatesPerSecond > lastUpdate){
		adaptExposure();
		lastUpdate = Time.time;
	}
	exposure = exposure * ((compensate - 1.0) * Time.deltaTime + 1.0);
}

function adaptExposure(){

	yield WaitForEndOfFrame();
	
	var width = Screen.width;
	var height = Screen.height;
	var tex = new Texture2D( width, height, TextureFormat.RGB24, false );
	tex.ReadPixels( Rect(0, 0, width, height), 0, 0 );
	tex.Apply();
	var avgLum : float = 0;
	var samples : int = 0;
	for (var x : int = 0; x < width; x+=50){
		for (var y : int = 0; y < width; y+=50){
			var luminance : float = getLuminance(tex.GetPixel(x,y));
			avgLum += luminance;
			samples ++;
		}
	}
	avgLum /= samples;
	//Debug.Log(avgLum);
	if (Mathf.Max(avgLum,targetLuminance) / Mathf.Min(avgLum,targetLuminance) > maxSpeed){
		if (avgLum < targetLuminance) compensate = maxSpeed;
		if (avgLum > targetLuminance) compensate = 1.0 / maxSpeed;
	}else{
		compensate = targetLuminance / avgLum;
	}
}

function getLuminance(col : Color) : float
{

	return 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
}

function OnPostRender () {
	FullScreenQuad(exposureMat);
}