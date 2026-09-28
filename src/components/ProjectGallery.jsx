import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import LatticeLoader from './react-bits/LatticeLoader';
const FlexCarousel = lazy(() => import('./react-bits/FlexCarousel'));
const coverSlugs = ['run-a-b','reply','speaki'];

class CarouselBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function ProjectGallery({ projects, lang, reduced, onSelect, renderDetails }) {
  const control = useRef(null);
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    setWebgl(!!context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);
  const ko = lang === 'ko';
  const current = projects[active];
  const items = useMemo(() => projects.map((project,index) => ({ src:`./assets/projects/${coverSlugs[index]}.png`,title:project.name,alt:`${project.name} project cover`,subtitle:project.type })), [projects]);
  const select = index => { const next=(index+projects.length)%projects.length; setActive(next); control.current?.goTo(next); };
  const fallback = <img className="gallery-fallback" src={items[active].src} alt={items[active].alt}/>;
  return <>
    <div className="gallery-canvas">
      {webgl === false ? fallback : webgl === null ? null : <CarouselBoundary fallback={fallback}>
      <Suspense fallback={<div className="gallery-loading"><LatticeLoader label={ko ? '프로젝트 로딩' : 'Loading projects'} showTimer={false} color="#c89bff"/></div>}>
        <FlexCarousel items={items} controlRef={control} intro={reduced ? 'fade' : 'rise'} preset="ribbon" cardHeight={0.78} gap={28} radius={8} fit="landscape" bend={reduced ? 0 : 0.14} dispersion={0.06} squeeze={0.08} captions={false} captureWheel={false} focusOnClick={false} onChange={setActive} onSelect={index => onSelect(projects[index])}/>
      </Suspense>
      </CarouselBoundary>}
    </div>
    <div className="gallery-toolbar">
      <div className="project-tabs" role="tablist" aria-label={ko ? '프로젝트 선택' : 'Select project'}>{projects.map((project,index) => <button key={project.name} role="tab" id={`project-tab-${index}`} tabIndex={active===index ? 0 : -1} aria-selected={active===index} aria-controls="project-panel" onClick={()=>select(index)} onKeyDown={event=>{
        const next = event.key==='ArrowRight' ? (index+1)%projects.length : event.key==='ArrowLeft' ? (index+projects.length-1)%projects.length : event.key==='Home' ? 0 : event.key==='End' ? projects.length-1 : null;
        if(next!==null){event.preventDefault();select(next);document.getElementById(`project-tab-${next}`)?.focus();}
      }}>{project.name}</button>)}</div>
      <div className="gallery-arrows"><button className="icon-button" onClick={()=>select(active-1)} aria-label={ko ? '이전 프로젝트' : 'Previous project'} title={ko ? '이전 프로젝트' : 'Previous project'}><ArrowLeft size={19}/></button><span>{String(active+1).padStart(2,'0')} / 03</span><button className="icon-button" onClick={()=>select(active+1)} aria-label={ko ? '다음 프로젝트' : 'Next project'} title={ko ? '다음 프로젝트' : 'Next project'}><ArrowRight size={19}/></button></div>
    </div>
    <div className="selected-project" id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${active}`}>
      <div className="selected-project-summary"><p className="eyebrow">{current.type}</p><h3>{current[lang][0]}</h3><p>{current[lang][1]}</p><button className="project-detail-button" onClick={()=>onSelect(current)} aria-haspopup="dialog">{ko ? '자세히 보기' : 'View project'}<ArrowUpRight size={18}/></button></div>
      {renderDetails(current)}
    </div>
  </>;
}
