Shader "IndieEffects/DepthTexture" {
	SubShader {
	Tags {"RenderType" = "Fog"}

	Pass {
		Fog { Mode Off }
		Lighting Off
		Cull off

		CGPROGRAM
		#pragma target 3.0
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"

		struct v2f {
			float4 pos : POSITION;
			float2 depth : TEXCOORD0;
		};

		v2f vert( appdata_base v ) {
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
			COMPUTE_EYEDEPTH(o.depth);

			return o;
		}

		float4 frag(v2f i) : COLOR {
			half4 d = i.depth.x / 150;

			half4 c;
			c.r = d;
			c.g = d;
			c.b = d;
			c.a = d;

			return c;
		}

		ENDCG
		}
	}
}