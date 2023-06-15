uniform sampler2D textureOffRT;
uniform float uSamples;
uniform float uExposure;
uniform vec3 uBackgroundColor;

varying vec2 vUv;

void main() {

    float chromaticAberrationStrength = 0.0;
    chromaticAberrationStrength = length(vec2(0.5, 0.5) - vUv) * 0.0018;

    vec4 color = vec4(
    texture2D(textureOffRT, vUv + vec2(chromaticAberrationStrength, 0.0)).r,
    texture2D(textureOffRT, vUv + vec2(chromaticAberrationStrength, 0.0)).g,
    texture2D(textureOffRT, vUv + vec2(-chromaticAberrationStrength, 0.0)).b,
    1.0
    );

    const float gamma = 1.0; //2.2;
    vec3 hdrColor = (color.rgb) / (uSamples * uExposure);

    // reinhard tone mapping
    vec3 mapped = hdrColor / (hdrColor + vec3(1.0));

    // gamma correction
    mapped = pow(mapped, vec3(1.0 / gamma));

    gl_FragColor = vec4(uBackgroundColor + mapped, 1.0);
}
