Shader "Custom/ExposureShader" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_normMax ("normalized maximum Luminance" , Float) = 0.5
	}
	SubShader {
		
		CGINCLUDE 
		#include "UnityCG.cginc"
		
		float4 _Color;
		sampler2D _MainTex;
		float _normMax;
		float _maxLum;
		
		
		struct vertexOutput{
			float4 pos : SV_POSITION;
			float2 coords  : TEXCOORD0;
		};
		
		vertexOutput vert(appdata_img v){
			vertexOutput o;
			o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
			o.coords = v.texcoord.xy;
			
			
			return o;
		}
		
		float4 frag1(vertexOutput o) : COLOR{
		
			
			float4 col = tex2D(_MainTex, o.coords);
	
			if (Luminance( tex2D(_MainTex, o.coords).rgb ) >= _maxLum) {
				_maxLum = Luminance( tex2D(_MainTex, o.coords).rgb );
			}
			
			return col;
		}
		
		float4 frag2(vertexOutput i) : COLOR{
			
			_maxLum = 1.0;
			
			float4 col = tex2D(_MainTex, i.coords);
			
			if (Luminance( tex2D(_MainTex, i.coords).rgb ) >= 0) {
				col.rgb = tex2D(_MainTex, i.coords).rgb * _normMax / _maxLum;
			}
	
			
			return col;
		}
		ENDCG
			
		Pass{
			CGPROGRAM
			
			#pragma vertex vert
			#pragma fragment frag1
			#pragma glsl
			#pragma target 3.0	
			
			
			ENDCG
		}
		Pass{
			CGPROGRAM
			
			#pragma vertex vert
			#pragma fragment frag2
			#pragma glsl
			#pragma target 3.0	
			
			
			ENDCG
		}
	} 
	//FallBack "Diffuse"
}
