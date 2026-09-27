// Ashima Arts 3D simplex noise (MIT) — shared by the core and its particle shell.
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform vec3 uPointer;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${NOISE}
void main(){
  vec3 p = position;
  float n = snoise(p * 1.35 + vec3(uTime * 0.18));
  float n2 = snoise(p * 3.4 - vec3(uTime * 0.32)) * 0.35;
  // Pointer pushes a soft dent/bulge toward where the cursor is
  float reach = smoothstep(1.6, 0.0, distance(normalize(p), normalize(uPointer)));
  float d = (n + n2) * (0.16 + uEnergy * 0.12) + reach * 0.22;
  p += normal * d;
  vDisp = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorB;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
  // Contour bands that ride the displacement — reads like a topographic scan
  float bands = smoothstep(0.92, 1.0, abs(sin(vDisp * 38.0 + uTime * 0.6)));
  vec3 base = mix(vec3(0.015, 0.02, 0.035), uColorB * 0.25, smoothstep(-0.2, 0.3, vDisp));
  vec3 col = base + uColor * fres * 1.6 + uColor * bands * 0.55;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const shellVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
${NOISE}
void main(){
  vec3 p = position;
  float n = snoise(p * 0.9 + vec3(uTime * 0.12 + aSeed));
  p *= 1.0 + n * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.5 + aSeed * 2.5) * uPixelRatio * (6.0 / -mv.z);
  vAlpha = 0.25 + 0.75 * smoothstep(-0.3, 0.6, n);
  gl_Position = projectionMatrix * mv;
}
`;

export const shellFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, a);
}
`;

export const gridVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
void main(){
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const gridFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
varying vec3 vWorld;
float line(float v, float w){
  float d = abs(fract(v - 0.5) - 0.5) / fwidth(v);
  return 1.0 - min(d / w, 1.0);
}
void main(){
  vec2 g = vWorld.xz * 0.9 + vec2(0.0, uTime * 0.35);
  float l = max(line(g.x, 1.0), line(g.y, 1.0));
  float fade = smoothstep(26.0, 2.0, length(vWorld.xz));
  gl_FragColor = vec4(uColor, l * fade * 0.22);
}
`;
