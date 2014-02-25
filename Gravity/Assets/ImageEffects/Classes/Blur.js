#pragma strict

@script RequireComponent (IndieEffects)
@script AddComponentMenu ("Indie Effects/Blur")
import IndieEffects;

private var blurMat : Material;
var blurShader : Shader;
@range(0,5)
var blur : float;

function Start () {
	blurMat = new Material(blurShader);
}

function Update () {
}

function OnPostRender () {
	blurMat.SetTexture("_MainTex", renderTexture);
	blurMat.SetFloat("_Threshold", 0);
	blurMat.SetFloat("_Amount", blur);
	FullScreenQuad(blurMat);
}