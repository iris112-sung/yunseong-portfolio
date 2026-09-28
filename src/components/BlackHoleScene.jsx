import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Independently authored particle field, not React Bits Pro source.
const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float presence;
uniform float pulse;
uniform float time;
varying vec2 vUv;
void main(){
 float aspect=resolution.x/resolution.y;
 vec2 scale=vec2(aspect,1.)*2.8/min(aspect,1.);
 vec2 p=(vUv-.5)*scale,mouse=pointer*scale;
 float pull=presence*(.55+pulse*.35),field=0.;
 for(int i=0;i<13;i++){
   float id=float(i),phase=id*2.39996;
   float orbit=time*(.22+.025*mod(id,3.))+phase;
   float radius=.40+.19*sin(time*.32+id*1.71);
   vec2 center=vec2(cos(orbit),sin(orbit*1.17))*radius;
   center.x+=.14*sin(time*.4+id);
   vec2 delta=mouse-center;
   center+=delta*exp(-dot(delta,delta)*1.35)*pull;
   vec2 d=p-center;
   float a=orbit+.7*sin(time*.27)+.55/(length(p)+.4);
   d=mat2(cos(a),-sin(a),sin(a),cos(a))*d;
   d.y*=1.8;
   field+=(.016+.006*sin(phase+time*.3))/(dot(d,d)+.004);
 }
 float core=smoothstep(.9,1.65,field);
 float glow=pow(clamp(field*.36,0.,1.),3.)*.48;
 float light=clamp(core+glow,0.,1.);
 vec3 tint=mix(vec3(.70,.83,1.),vec3(1.),core);
 gl_FragColor=vec4(tint,light*.9);
}`;

export default function BlackHoleScene({ reduced, onReady }) {
  const host=useRef(null),ready=useRef(onReady);
  ready.current=onReady;
  useEffect(()=>{
    const element=host.current;
    let renderer;
    try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'}); }
    catch { element.dataset.ready='true';ready.current();return; }
    renderer.setClearColor(0x000000,0);
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    element.appendChild(renderer.domElement);
    const uniforms={resolution:{value:new THREE.Vector2(1,1)},pointer:{value:new THREE.Vector2()},presence:{value:0},pulse:{value:0},time:{value:0}};
    const material=new THREE.ShaderMaterial({uniforms,fragmentShader,transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}'});
    const geometry=new THREE.PlaneGeometry(2,2);
    const scene=new THREE.Scene();scene.add(new THREE.Mesh(geometry,material));
    const camera=new THREE.Camera(),target=new THREE.Vector2();
    let frame=0,last=0,visible=true,active=0;
    const render=()=>renderer.render(scene,camera);
    const resize=()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);uniforms.resolution.value.set(width,height);render();};
    const tick=now=>{
      frame=0;if(!visible||document.hidden)return;
      const dt=Math.min((now-last)/1000||0,.05);last=now;
      if(!reduced){
        uniforms.time.value+=dt;
        uniforms.pointer.value.lerp(target,1-Math.exp(-dt*9));
        uniforms.presence.value+=(active-uniforms.presence.value)*(1-Math.exp(-dt*7));
        uniforms.pulse.value*=Math.exp(-dt*3);
      }
      render();if(!reduced)frame=requestAnimationFrame(tick);
    };
    const wake=()=>{if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}};
    const leave=()=>{active=0;element.dataset.pointerActive='false';};
    const move=e=>{
      if(reduced)return;
      const b=element.getBoundingClientRect();
      if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom){leave();return;}
      target.set((e.clientX-b.left)/b.width-.5,.5-(e.clientY-b.top)/b.height);
      active=1;element.dataset.pointerActive='true';
    };
    const press=e=>{move(e);if(active)uniforms.pulse.value=1;};
    const release=e=>{if(e.pointerType==='touch')leave();};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});observer.observe(element);
    const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(element);
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',press,{passive:true});
    window.addEventListener('pointerup',release);window.addEventListener('pointercancel',leave);window.addEventListener('blur',leave);document.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',wake);
    resize();wake();element.dataset.ready='true';ready.current();
    return()=>{
      cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',press);window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',leave);window.removeEventListener('blur',leave);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',wake);
      geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[reduced]);
  return <div className="signature-sculpture black-hole-scene" ref={host} aria-hidden="true"/>;
}
