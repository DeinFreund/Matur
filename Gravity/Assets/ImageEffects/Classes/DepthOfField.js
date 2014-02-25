#pragma strict

@script RequireComponent(IndieEffects)
@script RequireComponent(IndieEffects_Depth)
import IndieEffects;
import IndieEffects_Depth;

var shader : Shader;
private var DOFMat : Material;
@range (0,20)
var FStop : float;
@range (0,2.5)
var BlurAmount : float;

function Start () {
	DOFMat = new Material(shader);
}

function Update () {
	DOFMat.SetTexture("_MainTex",renderTexture);
	DOFMat.SetTexture("_Depth",DepthTex);
	DOFMat.SetFloat ("_FStop", FStop/10);
	DOFMat.SetFloat ("_Amount", BlurAmount);
}

function OnPostRender () {
	FullScreenQuad(DOFMat);
}