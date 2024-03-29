attribute vec3 position1;
attribute vec3 color1;
attribute vec3 color2;
attribute vec4 aSeed;

uniform float uRandom;
uniform vec4  uRandomVec4;
uniform float uFocalDepth;
uniform float uBokehStrength;
uniform float uMinimumLineSize;
uniform float uFocalPowerFunction;
uniform float uTime;

varying vec3 vColor;

float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

//----------------------------------------------------------------------------------------
//  1 out, 2 in...
float hash12(vec2 p)
{
vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

//----------------------------------------------------------------------------------------
//  1 out, 3 in...
float hash13(vec3 p3)
{
p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}
//----------------------------------------------------------------------------------------
// 1 out 4 in...
float hash14(vec4 p4)
{
p4 = fract(p4  * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.x + p4.y) * (p4.z + p4.w));
}

//----------------------------------------------------------------------------------------
//  2 out, 1 in...
vec2 hash21(float p)
{
vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

//----------------------------------------------------------------------------------------
///  2 out, 2 in...
vec2 hash22(vec2 p)
{
vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

//----------------------------------------------------------------------------------------
///  2 out, 3 in...
vec2 hash23(vec3 p3)
{
p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

//----------------------------------------------------------------------------------------
//  3 out, 1 in...
vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx+33.33);
   return fract((p3.xxy+p3.yzz)*p3.zyx);
}


//----------------------------------------------------------------------------------------
///  3 out, 2 in...
vec3 hash32(vec2 p)
{
vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

//----------------------------------------------------------------------------------------
///  3 out, 3 in...
vec3 hash33(vec3 p3)
{
p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}

//----------------------------------------------------------------------------------------
// 4 out, 1 in...
vec4 hash41(float p)
{
vec4 p4 = fract(vec4(p) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);

}

//----------------------------------------------------------------------------------------
// 4 out, 2 in...
vec4 hash42(vec2 p)
{
vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);

}

//----------------------------------------------------------------------------------------
// 4 out, 3 in...
vec4 hash43(vec3 p)
{
vec4 p4 = fract(vec4(p.xyzx)  * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

//----------------------------------------------------------------------------------------
// 4 out, 4 in...
vec4 hash44(vec4 p4)
{
p4 = fract(p4  * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

float hash2T( vec2 n )
{
    float t = fract( uTime );
    float float12 = hash12( n + 0.7*t );
    return float12;
}


void main() {
    float o1 = hash12( vec2(uRandom + aSeed.x, uRandomVec4.x) );
    float o2 = hash12( vec2(uRandom + aSeed.y, uRandomVec4.y) );
    float o3 = hash12( vec2(uRandom + aSeed.z, uRandomVec4.z) );
    float o4 = hash12( vec2(uRandom + aSeed.w, uRandomVec4.w) );
    float o5 = hash12( vec2(uRandom + aSeed.w, uRandomVec4.w) );

    float t = o1;
    vec3 positiont = position * (1.0 - t) + position1 * t;
    vColor = color1 * (1.0 - t) + color2 * t;

	float distanceFromFocalPoint = length((modelViewMatrix * vec4(positiont, 1.0)).z - (-uFocalDepth));
	if(uFocalPowerFunction > 0.5) {
		distanceFromFocalPoint = pow(distanceFromFocalPoint, 1.5);
	}


    float bokehStrength = distanceFromFocalPoint * uBokehStrength;
	bokehStrength = max(bokehStrength, uMinimumLineSize);

    vec4 randNumbers = vec4( o2, o3, o4, o5 );

    float lambda = randNumbers.x;
    float u      = randNumbers.y * 2.0 - 1.0;
    float phi    = randNumbers.z * 6.28;
    float R      = bokehStrength;

    float x = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * cos(phi);
    float y = R * pow(lambda, 0.33333) * sqrt(1.0 - u * u) * sin(phi);
    float z = R * pow(lambda, 0.33333) * u;

    positiont += vec3(x, y, z);

	 vColor = vec3(
	 	vColor.r / (1.0 + pow(distanceFromFocalPoint * 0.015, 2.71828)),
	 	vColor.g / (1.0 + pow(distanceFromFocalPoint * 0.015, 2.71828)),
	 	vColor.b / (.8 + pow(distanceFromFocalPoint * 0.015, 2.71828))
	 );

    vec4 projectedPosition = projectionMatrix * modelViewMatrix * vec4(positiont, 1.0);
    gl_Position = projectedPosition;

    gl_PointSize = 1.0;
}
