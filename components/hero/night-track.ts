/**
 * Night-race scene in raw three.js (dynamically imported, client only).
 * Everything rushes toward the camera: wet tarmac with floodlight pools, kerbs,
 * long-exposure taillight streaks of the cars we're catching, trackside floodlights,
 * and their reflections in the wet surface. Bloom + a lens pass finish the image.
 */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export type NightTrack = {
  /** Ease toward a new speed (world units / s). ~90 is flat out. */
  setTarget(speed: number, response?: number): void;
  /** Current speed, for HUD readouts. */
  speed(): number;
  setPaused(paused: boolean): void;
  setPointer(x: number, y: number): void;
  dispose(): void;
};

const L = 396; // track length in view; a multiple of the floodlight spacing
const POOL = 18; // floodlight spacing

const NOISE = /* glsl */ `
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
`;

const BEND = /* glsl */ `
  uniform vec2 uBend;
  vec3 bend(vec3 p){
    float k = clamp(-p.z / ${L.toFixed(1)}, 0.0, 1.2);
    float k2 = k * k;
    p.x += uBend.x * k2 * 70.0;
    p.y += uBend.y * k2 * 16.0;
    return p;
  }
`;

export function createNightTrack(
  canvas: HTMLCanvasElement,
  opts: { livery: string; reduced: boolean; initialSpeed?: number },
): NightTrack {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x030304, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 700);
  camera.position.set(0, 1.35, 3);

  const livery = new THREE.Color(opts.livery);
  const fog = new THREE.Color(0.0025, 0.0028, 0.004);
  const shared = {
    uTravel: { value: 0 },
    uSpeed: { value: 0 },
    uBend: { value: new THREE.Vector2() },
    uTime: { value: 0 },
  };

  /* ── Sky haze at the vanishing point ── */
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(1600, 500),
    new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: { ...shared, uLivery: { value: livery } },
      vertexShader: /* glsl */ `
        ${BEND}
        varying vec2 vUv;
        void main(){
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.0);
          w.xyz = bend(w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uLivery;
        varying vec2 vUv;
        void main(){
          float h = vUv.y;
          float glow = exp(-pow((vUv.x - 0.5) * 5.0, 2.0)) * exp(-pow((h - 0.47) * 22.0, 2.0));
          vec3 haze = mix(vec3(0.0035, 0.004, 0.0065), vec3(0.0), smoothstep(0.46, 0.8, h));
          vec3 col = haze + glow * (vec3(0.010, 0.010, 0.014) + uLivery * 0.006);
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  sky.position.set(0, 60, -L - 10);
  sky.renderOrder = -2;
  scene.add(sky);

  /* ── Wet tarmac, kerbs, grass ── */
  const roadGeo = new THREE.PlaneGeometry(60, L + 20, 1, 220);
  roadGeo.rotateX(-Math.PI / 2);
  roadGeo.translate(0, 0, -(L + 20) / 2 + 12);
  const road = new THREE.Mesh(
    roadGeo,
    new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { ...shared, uLivery: { value: livery }, uFog: { value: fog } },
      vertexShader: /* glsl */ `
        ${BEND}
        varying vec2 vXZ;
        varying float vDepth;
        void main(){
          vec4 w = modelMatrix * vec4(position, 1.0);
          vXZ = w.xz;
          vDepth = -w.z;
          w.xyz = bend(w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${NOISE}
        uniform float uTravel; uniform float uSpeed; uniform vec3 uLivery; uniform vec3 uFog;
        varying vec2 vXZ; varying float vDepth;
        void main(){
          float x = vXZ.x;
          float s = vXZ.y - uTravel;
          float ax = abs(x);
          float blur = 1.0 + uSpeed * 0.06;             // motion blur stretches texture along travel

          // tarmac: two octaves of aggregate, darker rubbered racing line, wet sheen
          float n = vnoise(vec2(x * 4.0, s * 4.0 / blur)) * 0.6 + vnoise(vec2(x * 14.0, s * 14.0 / blur)) * 0.4;
          vec3 col = vec3(0.010, 0.010, 0.012) + n * 0.006;
          float racing = exp(-pow((x - sin(s * 0.018) * 2.4) / 1.5, 2.0));
          col *= 1.0 - racing * 0.45;
          float alpha = 0.80 - racing * 0.08;              // more transparent = more reflective

          // floodlight pools along both edges
          float pool = pow(0.5 + 0.5 * cos(6.2831 * s / ${POOL.toFixed(1)}), 6.0);
          float side = exp(-pow((ax - 5.0) / 3.2, 2.0));
          col += vec3(0.05, 0.045, 0.04) * pool * side;

          // white edge line
          float edge = smoothstep(5.55, 5.6, ax) * (1.0 - smoothstep(5.8, 5.85, ax));
          col = mix(col, vec3(0.11), edge);
          alpha = mix(alpha, 0.95, edge);

          // kerbs
          float kerb = step(5.95, ax) * (1.0 - step(7.0, ax));
          float stripe = step(0.5, fract(s * 0.38));
          vec3 kc = mix(vec3(0.085, 0.085, 0.09), uLivery * 0.11, stripe);
          kc *= 0.75 + 0.25 * smoothstep(7.0, 6.0, ax);
          col = mix(col, kc + vec3(0.03) * pool, kerb);
          alpha = mix(alpha, 0.97, kerb);

          // grass verge
          float grass = step(7.0, ax);
          vec3 gc = vec3(0.004, 0.009, 0.006) + vnoise(vec2(x * 2.0, s * 2.0 / blur)) * 0.006 + vec3(0.01, 0.014, 0.01) * pool * exp(-pow((ax - 8.0) / 3.0, 2.0));
          col = mix(col, gc, grass);
          alpha = mix(alpha, 1.0, grass);

          float f = smoothstep(30.0, ${(L * 0.95).toFixed(1)}, vDepth);
          col = mix(col, uFog, f);
          alpha = mix(alpha, 1.0, f);
          gl_FragColor = vec4(col, alpha);
        }`,
    }),
  );
  road.renderOrder = 1;
  scene.add(road);

  /* ── Light streaks (instanced) ── */
  type Streak = { x: number; y: number; z: number; r: number; len: number; spd: number; color: THREE.Color; gain: number };
  const streaks: Streak[] = [];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // cars ahead: pairs of red taillights, slower than us so we reel them in
  const tail = new THREE.Color(1, 0.06, 0.03);
  for (let i = 0; i < 26; i++) {
    const lane = rand(-4.2, 4.2);
    const z = rand(0, L);
    const spd = -rand(0.12, 0.42);
    const len = rand(6, 16);
    const c = Math.random() < 0.18 ? livery.clone() : tail;
    for (const dx of [-0.55, 0.55]) {
      streaks.push({ x: lane + dx, y: 0.55, z, r: 0.045, len, spd, color: c, gain: 5 });
    }
    // rain light in the middle, dimmer
    streaks.push({ x: lane, y: 0.38, z, r: 0.03, len: len * 0.8, spd, color: tail, gain: 2.5 });
  }
  // trackside floodlights, static in the world (spd = -1 → rush past)
  const warm = new THREE.Color(1, 0.86, 0.68);
  const cool = new THREE.Color(0.75, 0.82, 1);
  for (let i = 0; i < L / POOL; i++) {
    for (const sx of [-1, 1]) {
      streaks.push({ x: sx * 10.5, y: 6.2, z: i * POOL, r: 0.06, len: 2.2, spd: -1, color: i % 3 ? warm : cool, gain: 7 });
    }
  }
  // low LED barrier boards
  for (let i = 0; i < 36; i++) {
    const sx = Math.random() < 0.5 ? -1 : 1;
    streaks.push({
      x: sx * rand(7.8, 8.6),
      y: 0.5,
      z: rand(0, L),
      r: 0.05,
      len: rand(3, 9),
      spd: -1,
      color: Math.random() < 0.5 ? livery.clone() : new THREE.Color(0.6, 0.7, 1),
      gain: 2.2,
    });
  }

  const base = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
  base.rotateX(Math.PI / 2);
  base.translate(0, 0, -0.5); // spans z: 0 (head) → -1 (tail)

  const makeStreaks = (mirror: boolean) => {
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute("position", base.getAttribute("position"));
    geo.setAttribute("uv", base.getAttribute("uv"));
    geo.instanceCount = streaks.length;
    const off = new Float32Array(streaks.length * 3);
    const met = new Float32Array(streaks.length * 4);
    const col = new Float32Array(streaks.length * 3);
    streaks.forEach((s, i) => {
      off.set([s.x, s.y, s.z], i * 3);
      met.set([s.r, s.len, s.spd, s.gain], i * 4);
      col.set([s.color.r, s.color.g, s.color.b], i * 3);
    });
    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(off, 3));
    geo.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(met, 4));
    geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(col, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...shared, uMirror: { value: mirror ? 1 : 0 } },
      vertexShader: /* glsl */ `
        ${BEND}
        attribute vec3 aOffset; attribute vec4 aMetrics; attribute vec3 aColor;
        uniform float uTravel; uniform float uSpeed; uniform float uMirror;
        varying vec3 vColor; varying float vAlong; varying float vFade;
        void main(){
          vec3 p = position;
          float stretch = 0.35 + clamp(uSpeed / 90.0, 0.0, 1.3) * 0.9;   // longer exposure at speed
          vAlong = -p.z;
          p.xy *= aMetrics.x * (uMirror > 0.5 ? 1.6 : 1.0);
          p.z *= aMetrics.y * stretch;
          float z = -mod(aOffset.z + uTravel * aMetrics.z, ${L.toFixed(1)});
          vec3 w = vec3(p.x + aOffset.x, p.y + aOffset.y, p.z + z);
          if (uMirror > 0.5) w.y = -w.y - 0.02;
          w = bend(w);
          float depth = -z;
          vFade = (1.0 - smoothstep(${(L * 0.35).toFixed(1)}, ${(L * 0.92).toFixed(1)}, depth)) * smoothstep(-6.0, 4.0, depth);
          vColor = aColor * aMetrics.w * (uMirror > 0.5 ? 0.16 : 1.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor; varying float vAlong; varying float vFade;
        void main(){
          float a = pow(1.0 - clamp(vAlong, 0.0, 1.0), 1.6) * vFade;
          gl_FragColor = vec4(vColor * a, a);
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = mirror ? 0 : 2;
    return mesh;
  };
  const lights = makeStreaks(false);
  const reflections = makeStreaks(true);
  scene.add(reflections, lights);

  /* ── Post: bloom + lens (aberration, vignette, grain) ── */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.95, 0.55, 0.22);
  composer.addPass(bloom);
  const lens = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAberr: { value: 0.004 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse; uniform float uTime; uniform float uAberr; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 c = vUv - 0.5; float d = length(c);
        vec2 o = c * uAberr * d * 2.0;
        vec3 col = vec3(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b);
        col *= 1.0 - smoothstep(0.3, 0.95, d) * 0.8;
        col += (h(vUv * 1000.0 + fract(uTime) * 100.0) - 0.5) * 0.02;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  composer.addPass(lens);
  composer.addPass(new OutputPass());

  /* ── Sizing ── */
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    // keep the road filling narrow (portrait) screens
    camera.fov = w / h < 1 ? 78 : 60;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── Loop ── */
  let speed = opts.initialSpeed ?? 0;
  let target = speed;
  let response = 1.2;
  let travel = Math.random() * 1000;
  let paused = false;
  let frame = 0;
  let last = performance.now();
  const pointer = new THREE.Vector2();
  const camPos = new THREE.Vector2();
  const look = new THREE.Vector3();
  const bend = new THREE.Vector2();
  const baseFov = () => (camera.aspect < 1 ? 78 : 60);

  const render = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    speed += (target - speed) * Math.min(1, dt * response);
    travel += speed * dt;

    // the track ahead slowly winds left/right, up/down
    bend.set(Math.sin(t * 0.11) * 0.55 + Math.sin(t * 0.047 + 1.3) * 0.45, Math.sin(t * 0.083) * 0.4);
    shared.uBend.value.lerp(bend, Math.min(1, dt * 2));
    shared.uTravel.value = travel;
    shared.uSpeed.value = speed;
    shared.uTime.value = t;

    // camera: pointer parallax, speed shake, FOV kick
    camPos.lerp(pointer, Math.min(1, dt * 2.5));
    const shake = Math.min(1, speed / 90) * 0.012;
    camera.position.x = camPos.x * 0.9 + (Math.random() - 0.5) * shake;
    camera.position.y = 1.35 + camPos.y * 0.35 + (Math.random() - 0.5) * shake;
    look.set(camPos.x * 0.4 + shared.uBend.value.x * 2.5, 0.75 + camPos.y * 0.2, -40);
    camera.lookAt(look);
    const fov = baseFov() + Math.min(1.4, speed / 90) * 14;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    lens.uniforms.uTime!.value = t;
    lens.uniforms.uAberr!.value = 0.003 + Math.min(1.3, speed / 90) * 0.012;
    bloom.strength = 0.85 + Math.min(1, speed / 90) * 0.35;
    composer.render();
  };

  const loop = (now: number) => {
    render(now);
    frame = requestAnimationFrame(loop);
  };

  if (opts.reduced) {
    // a single, still frame
    speed = target = 40;
    render(performance.now());
  } else {
    frame = requestAnimationFrame(loop);
  }

  const onVisibility = () => api.setPaused(document.hidden);
  document.addEventListener("visibilitychange", onVisibility);

  const api: NightTrack = {
    setTarget(s, r = 1.2) {
      target = s;
      response = r;
    },
    speed: () => speed,
    setPaused(p) {
      if (opts.reduced || p === paused) return;
      paused = p;
      cancelAnimationFrame(frame);
      if (!p) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      base.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
  return api;
}
