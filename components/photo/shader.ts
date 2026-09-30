export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

/**
 * Photo « vivante » du S-Works Tarmac SL9.
 * - roues en rotation réelle (échantillonnage tourné dans le repère elliptique de chaque roue)
 *   avec flou de mouvement et masquage des pièces fixes (cadre, fourche, chaîne, dérailleur)
 * - recoloration de la peinture (masque G) avec fondu entre deux finitions
 * - reflet de lumière balayant la peinture
 * - reflet au sol
 */
export const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uMask;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uCenter;
uniform vec2 uOffset;
uniform float uScale;
uniform vec4 uW0;
uniform vec4 uW1;
uniform float uAng;
uniform float uSpread;
uniform int uTaps;
uniform int uTries;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uColMix;
uniform vec3 uSheen;
uniform float uGround;
uniform float uDpr;
out vec4 frag;

vec4 texAt(vec2 p) {
  if (p.x < 0.0 || p.y < 0.0 || p.x > uImg.x || p.y > uImg.y) return vec4(0.0);
  return texture(uTex, p / uImg);
}
vec4 maskAt(vec2 p) {
  if (p.x < 0.0 || p.y < 0.0 || p.x > uImg.x || p.y > uImg.y) return vec4(1.0, 0.0, 0.0, 1.0);
  return texture(uMask, p / uImg);
}
vec2 rot(vec2 p, vec4 w, float a) {
  vec2 q = (p - w.xy) / w.zw;
  float c = cos(a), s = sin(a);
  q = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  return w.xy + q * w.zw;
}
// échantillon tourné ; weight = 0 si seules des pièces fixes ont été rencontrées
vec4 wheelSample(vec2 p, vec4 w, float ang, out float weight) {
  const float STEP = 0.2617994; // 15° ≈ pas des rayons
  for (int k = 0; k < 9; k++) {
    if (k >= uTries) break;
    float off = float((k + 1) / 2) * STEP * ((k % 2 == 0) ? 1.0 : -1.0);
    vec2 sp = rot(p, w, -(ang + off));
    if (maskAt(sp).r < 0.5) {
      weight = 1.0;
      return texAt(sp);
    }
  }
  weight = 0.0;
  return vec4(0.0);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}
vec3 recolor(vec3 rgb, vec3 k) {
  vec3 h = rgb2hsv(rgb);
  h.x = fract(h.x + k.x);
  h.y = clamp(h.y * k.y, 0.0, 1.0);
  h.z = clamp(h.z * k.z, 0.0, 1.0);
  return hsv2rgb(h);
}

vec4 shade(vec2 p, bool fx) {
  vec4 m = maskAt(p);
  vec4 c = texAt(p);
  if (m.r < 0.999 && m.b > 0.001) {
    vec4 w = p.x < uImg.x * 0.5 ? uW0 : uW1;
    vec4 acc = vec4(0.0);
    float wsum = 0.0;
    for (int t = 0; t < 12; t++) {
      if (t >= uTaps) break;
      float f = uTaps > 1 ? float(t) / float(uTaps - 1) - 0.5 : 0.0;
      float wt;
      acc += wheelSample(p, w, uAng + f * uSpread, wt);
      wsum += wt;
    }
    acc = wsum > 0.0 ? acc / wsum : c;
    c = mix(acc, c, m.r);
  }
  if (c.a > 0.001) {
    vec3 rgb = c.rgb / c.a;
    if (m.g > 0.004) {
      vec3 a = recolor(rgb, uColA);
      vec3 b = recolor(rgb, uColB);
      rgb = mix(rgb, mix(a, b, uColMix), m.g);
    }
    if (fx) {
      // reflet de lumière : bande diagonale qui glisse sur le vélo
      float d = dot(p - vec2(uSheen.x, 560.0), normalize(vec2(1.0, 0.55)));
      float band = exp(-(d * d) / (uSheen.y * uSheen.y));
      float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
      float gloss = m.g * 0.9 + (1.0 - m.g) * 0.18 * step(lum, 0.35);
      rgb += band * uSheen.z * gloss * (0.25 + lum * 1.4);
    }
    c = vec4(rgb * c.a, c.a);
  }
  return c;
}

void main() {
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = (fc - uRes * 0.5 - uOffset * uDpr) / (uScale * uDpr) + uCenter;
  vec4 col = shade(p, true);
  if (p.y > uGround && p.y < uGround + 360.0) {
    float d = p.y - uGround;
    vec2 rp = vec2(p.x, uGround - d * 1.05);
    float f = pow(clamp(1.0 - d / 340.0, 0.0, 1.0), 2.2) * 0.16;
    vec4 r = shade(rp, false);
    col += r * f * (1.0 - col.a);
  }
  frag = col;
}
`
