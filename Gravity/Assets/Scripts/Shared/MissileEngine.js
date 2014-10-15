#pragma strict

@RPC
private function turnOnEngine(){
	for (var component : ParticleEmitter in gameObject.GetComponentsInChildren(ParticleEmitter)){
		component.minEmission*=1000;
		component.maxEmission*=1000;
	}
}

@RPC
private function turnOffEngine(){
	for (var component : ParticleEmitter in gameObject.GetComponentsInChildren(ParticleEmitter)){
		component.minEmission*=0.001;
		component.maxEmission*=0.001;
	}
}
