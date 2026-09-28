import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Original stylized shader, not a physical ray-tracing simulation or Pro component.
const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){
 float aspect=resolution.x/resolution.y;
 vec2 p=(vUv-.5)*vec2(aspect,1.)*(aspect>1.2?2.8:3.5)/max(min(aspect,1.),.1);
 p-=pointer*.025;
 float tilt=-.09; p=mat2(cos(tilt),-sin(tilt),sin(tilt),cos(tilt))*p;
 float r=length(p),angle=atan(p.y,p.x);
 vec3 color=vec3(.011,.009,.018);
 vec2 starUV=(vUv+normalize(p+vec2(.001))*.008/(r+.15))*vec2(aspect,1.)*180.;
 vec2 cell=floor(starUV),local=fract(starUV)-.5;
 float star=pow(max(0.,1.-length(local)*5.),8.)*step(.993,hash(cell));
 color+=vec3(.46,.57,.72)*star*smoothstep(.45,1.1,r);
 float halo=exp(-abs(r-.47)*9.)*.1;
 color+=vec3(.64,.28,.12)*halo;
 float photon=exp(-abs(r-.455)*155.);
 float arc=exp(-abs(r-.49)*43.)*(.6+.4*sin(angle*3.+time*.16));
 color+=vec3(1.,.77,.47)*(photon*.85+arc*.33);
 // A narrow accretion disk crosses in front; the far side is occulted.
 vec2 disk=vec2(p.x,p.y/.20);
 float dr=length(disk),da=atan(disk.y,disk.x);
 float band=smoothstep(.36,.49,dr)*(1.-smoothstep(1.05,1.52,dr));
 float strands=.5+.5*sin(dr*112.+noise(vec2(da*5.-time*.22,dr*7.))*7.);
 float gas=noise(vec2(da*11.-time*.5,dr*25.));
 float streak=.48+.35*strands+.4*gas;
 float heat=pow(max(0.,1.-(dr-.35)/1.3),1.6);
 float front= p.y<0. ? 1. : smoothstep(.43,.48,r);
 vec3 hot=mix(vec3(.7,.21,.065),vec3(1.,.88,.64),heat);
 float doppler=1.+.38*clamp(-p.x,-1.,1.);
 color+=hot*band*streak*doppler*front*1.6;
 // The far disk appears as a gravitationally lensed arc above the shadow.
 float lensR=length(vec2(p.x,p.y/.91));
 float lens=exp(-abs(lensR-.52)*70.)*smoothstep(-.04,.18,p.y);
 color+=vec3(1.,.67,.32)*lens*(.6+.3*noise(vec2(angle*19.-time*.35,r*80.)));
 float shadow=1.-smoothstep(.426,.444,r);
 float foreground=band*step(p.y,0.)*smoothstep(-.12,-.015,p.y);
 color=mix(color,vec3(.001,.001,.003),shadow*(1.-foreground));
 float beam=exp(-abs(p.y)*42.)*exp(-abs(p.x)*1.8)*smoothstep(.43,.64,abs(p.x));
 color+=vec3(1.,.68,.38)*beam*.27;
 color=vec3(1.)-exp(-color*1.4);
 gl_FragColor=vec4(pow(color,vec3(.85)),1.);
}`;

export default function BlackHoleScene({ reduced, onReady }) {
  const host = useRef(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  useEffect(() => {
    const element = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' }); }
    catch { element.dataset.ready = 'true'; ready.current(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    element.appendChild(renderer.domElement);
    const uniforms={resolution:{value:new THREE.Vector2(1,1)},pointer:{value:new THREE.Vector2()},time:{value:0}};
    const material=new THREE.ShaderMaterial({uniforms,fragmentShader,vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}'});
    const geometry=new THREE.PlaneGeometry(2,2);
    const scene=new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
    const camera=new THREE.Camera();
    let frame=0,last=0,visible=true;
    const render=()=>renderer.render(scene,camera);
    const resize=()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);uniforms.resolution.value.set(width,height);render();};
    const tick=now=>{frame=0;if(!visible||document.hidden)return;uniforms.time.value+=Math.min((now-last)/1000||0,.05);last=now;render();if(!reduced)frame=requestAnimationFrame(tick);};
    const wake=()=>{if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}};
    const move=e=>{if(reduced)return;const b=element.getBoundingClientRect();uniforms.pointer.value.set((e.clientX-b.left)/b.width-.5,(e.clientY-b.top)/b.height-.5);};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});observer.observe(element);
    const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(element);
    element.addEventListener('pointermove',move);document.addEventListener('visibilitychange',wake);
    resize();wake();element.dataset.ready='true';ready.current();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();element.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',wake);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();};
  },[reduced]);
  return <div className="signature-sculpture black-hole-scene" ref={host} aria-hidden="true"/>;
}
