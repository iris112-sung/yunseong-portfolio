import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, X, Menu, Search, ArrowLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import IntroExperience from './components/IntroExperience';
import LoadingScreen from './components/LoadingScreen';
import ProjectGallery from './components/ProjectGallery';
import ScrollHeader from './components/ScrollHeader';
import reviews from './reviews.json';
import { projectDetails } from './projectDetails';

const projects = [
  { name: 'Run a B', type: 'LLM ENGINEERING', tags: ['PyTorch', 'LoRA', 'HF Transformers', 'React', 'Spring Boot'], ko: ['소상공인을 위한 정책 분석 AI', '기획 · LLM 엔지니어링 · 팀장', '단순한 공고 나열을 넘어, 사업 조건에 맞는 정책 해석과 리포트를 제공하기 위한 프로젝트입니다.', '통합 정책 허브, 정책 원문 분석, 지원사업 추천 기능을 설계했습니다. 팀장으로 서비스 기획과 LLM 파인튜닝을 담당했습니다.'], en: ['Policy intelligence for small businesses', 'Planning · LLM engineering · Team lead', 'A project to turn policy documents into personalized explanations for small business owners.', 'Designed a policy hub, document analysis and program recommendations. Led planning and LLM fine-tuning.'] },
  { name: 'Reply', type: 'AI APPLICATION', tags: ['JavaScript', 'HTML', 'Python', 'AWS', 'OpenAI API'], ko: ['댓글의 의미를 지키는 AI', '기획 · 발표', '유튜브의 유해한 댓글을 삭제하는 대신 표현을 순화하면서 맥락을 보존하는 서비스를 기획했습니다.', '크롬 확장 프로그램으로 댓글을 감지하고 AI API로 유해 표현을 판단·순화하는 흐름을 설계했습니다. 기획과 발표에 참여했습니다.'], en: ['A more thoughtful comment section', 'Planning · Presentation', 'A service concept that softens harmful YouTube comments while preserving their context.', 'Planned a Chrome extension workflow that detects comments and uses an AI API to identify and rewrite harmful language. Contributed to planning and presentation.'] },
  { name: 'Speaki', type: 'VOICE AI · IN PROGRESS', tags: ['Python', 'Whisper', 'HTTP API', 'RAG / SLM'], ko: ['모두를 위한 음성 주문', '팀장 · AI 개발', '터치스크린 사용이 어려운 사용자를 위한 STT 기반 배리어프리 음성 주문 키오스크입니다.', 'Whisper 비교 실험과 AI 파이프라인 설계, 산학협력 요구사항 협의 및 팀 리딩을 담당하고 있습니다.'], en: ['Voice ordering, for everyone', 'Team lead · AI developer', 'A barrier-free STT-powered ordering kiosk for people who find touchscreens difficult to use.', 'Leading Whisper experiments, AI pipeline design, partner requirements and team coordination.'] }
];
const technical = {
  'Run a B': { ko: [['모델 학습', 'PyTorch · Hugging Face Transformers 기반 LLM 파인튜닝, LoRA를 활용한 파라미터 효율적 학습'], ['서비스 구성', 'React 프론트엔드 · Spring Boot 백엔드'], ['담당 범위', '정책 분석 서비스 기획, LLM 파인튜닝 및 팀 리딩']], en: [['Model training', 'LLM fine-tuning with PyTorch and Hugging Face Transformers; parameter-efficient adaptation with LoRA'], ['Application stack', 'React frontend · Spring Boot backend'], ['Contribution', 'Policy analysis planning, LLM fine-tuning and team leadership']] },
  Reply: { ko: [['처리 흐름', '댓글 감지 → AI 기반 유해 표현 판별 → 문맥을 보존하는 표현 순화'], ['서비스 구성', 'JavaScript · HTML 기반 브라우저 확장, Python · OpenAI API · AWS'], ['담당 범위', 'AI 활용 시나리오와 서비스 흐름 기획, 발표']], en: [['Processing flow', 'Comment detection → harmful-language classification → context-preserving rewriting'], ['Application stack', 'JavaScript / HTML browser extension, Python, OpenAI API and AWS'], ['Contribution', 'AI use-case planning, service workflow and presentation']] },
  Speaki: { ko: [['비교 실험', 'Whisper base · small · medium의 한국어·사투리 주문 음성 비교'], ['파이프라인 설계', 'STT → 사용자 확인 → 주문 구조화 → Backend DB 검증'], ['담당 범위', '아이디어 제안 · 산학협력 요구사항 협의 · AI 개발 · 일정 및 팀 리딩']], en: [['Experiments', 'Comparing Whisper base, small and medium on Korean and dialect order recordings'], ['Pipeline design', 'STT → user confirmation → structured order → backend database validation'], ['Contribution', 'Concept, partner requirements, AI development, scheduling and team leadership']] }
};

function ProjectTechnology({name, lang}) {
  return <dl className="project-tech">{technical[name][lang].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function ProjectDialog({ project, lang, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; opener?.focus(); };
  }, []);
  const t = project[lang];
  return <dialog ref={ref} className="project-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
    <div className="dialog-body"><button className="icon-button close" aria-label={lang === 'ko' ? '닫기' : 'Close'} onClick={onClose}><X /></button>
      <p className="eyebrow">{project.type}</p><h2 id="dialog-title">{project.name}</h2><p className="dialog-subtitle">{t[0]}</p>
      <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <section><h3>{lang === 'ko' ? '참여 역할' : 'My role'}</h3><p>{t[1]}</p></section>
      {projectDetails[project.name][lang].map(([heading,body]) => <section key={heading}><h3>{heading}</h3><p>{body}</p></section>)}
      <ProjectTechnology name={project.name} lang={lang}/>
    </div></dialog>;
}

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'ko'; } catch { return 'ko'; } });
  const [route, setRoute] = useState(location.hash);
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState(null);
  const [query, setQuery] = useState('');
  const [sceneReady, setSceneReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const reduced = useReducedMotion();
  const ko = lang === 'ko';
  useEffect(() => { const listener = () => { setRoute(location.hash); setMenu(false); }; window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener); }, []);
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('portfolio-language', lang); } catch {} }, [lang]);
  const article = route.startsWith('#/reviews/') ? reviews.find(r => r.slug === route.split('/')[2]) : null;
  const isBlog = route.startsWith('#/reviews');
  const ready = fontsReady && (sceneReady || isBlog);
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => { if (active) setFontsReady(true); });
    const timeout = setTimeout(() => { if (active) { setFontsReady(true); setSceneReady(true); } }, 8000);
    return () => { active = false; clearTimeout(timeout); };
  }, []);
  useEffect(() => {
    if (ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [ready]);
  useEffect(() => { if(isBlog || route === '#/') window.scrollTo(0,0); else if(route.startsWith('#')) requestAnimationFrame(() => document.getElementById(route.slice(1))?.scrollIntoView()); document.title = article ? `${article.title} · Study Archive` : 'Yunseong Bae · AI Engineer'; }, [route, article, isBlog]);
  const visibleReviews = reviews.filter(r => (r.title + r.body).toLowerCase().includes(query.toLowerCase()));
  const reviewLink = (r, i) => <a className="review-row" href={`#/reviews/${r.slug}`} key={r.slug}><span className="review-number">{String(i + 1).padStart(2,'0')}</span><div><div className="review-meta">{r.date} <span>{r.draft ? (ko ? '작성 중' : 'In progress') : 'REVIEW'}</span></div><h3>{r.title}</h3></div><ArrowUpRight /></a>;
  return <>
    <LoadingScreen ready={ready} lang={lang}/>
    <div className="app-shell" inert={!ready} aria-busy={!ready}>
    <a className="skip" href="#main">{ko ? '본문으로 이동' : 'Skip to content'}</a>
    <ScrollHeader alwaysVisible={isBlog}><a className="wordmark" href="#/">Yunseong Bae<span> / AI ENGINEER</span></a><nav aria-label="Main navigation" className={menu ? 'open' : ''}><a href="#about">{ko ? '소개' : 'About'}</a><a href="#projects">{ko ? '프로젝트' : 'Projects'}</a><a href="#/reviews">{ko ? '논문 기록' : 'Reading'}</a><a href="#contact">{ko ? '연락' : 'Contact'}</a></nav><div className="header-actions"><div className="languages">{['ko','en'].map(l => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}>{l === 'ko' ? 'KR' : 'EN'}</button>)}</div><button className="icon-button mobile-menu" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></ScrollHeader>
    <main id="main">
    {isBlog ? <div className="archive container">
      <a className="back" href={article ? '#/reviews' : '#/'}><ArrowLeft size={16}/>{article ? 'Study Archive' : 'Portfolio'}</a>
      {article ? <><div className="article-heading"><p className="eyebrow">PAPER NOTES / {article.date}</p><h1>{article.title}</h1>{article.draft && <p className="draft-notice">{ko ? '작성 중인 학습 노트입니다. 현재까지 작성한 내용을 기록합니다.' : 'A work-in-progress reading note, preserved as written.'}</p>}</div><article className="prose"><Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{img: ({src,alt}) => <img src={src?.startsWith('/assets/') ? `.${src}` : src} alt={alt || article.title} loading="lazy" />}}>{article.body}</Markdown></article></> : <><p className="eyebrow">READ. QUESTION. UNDERSTAND.</p><h1>Study Archive<span className="blue">.</span></h1><p className="lead">{ko ? '논문을 읽고, 구조를 이해하고, 나의 언어로 남기는 기록.' : 'Reading papers. Understanding systems. Thinking in my own words.'}</p><label className="search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={ko ? '제목이나 내용으로 검색' : 'Search titles or notes'} aria-label={ko ? '논문 검색' : 'Search papers'}/></label><p className="result-count">{visibleReviews.length} NOTES</p><div>{visibleReviews.map(reviewLink)}</div>{!visibleReviews.length && <p>{ko ? '검색 결과가 없습니다.' : 'No matching notes.'}</p>}</>}
    </div> : <>
      <IntroExperience lang={lang} reduced={!!reduced} onReady={onSceneReady}/>
      <motion.section id="about" className="container section main-entry" initial={reduced ? false : {opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.7}}><div className="section-label"><span>01 / ABOUT</span><span>LEARNING IN PUBLIC</span></div><div className="about-grid"><div><h2>{ko ? '배윤성' : 'Yunseong Bae'}</h2><p className="main-role">AI ENGINEER</p><div className="main-links"><a href="#projects">{ko ? '프로젝트' : 'Projects'}<ArrowUpRight size={17}/></a><a href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer"><Github size={17}/>GitHub<ArrowUpRight size={17}/></a></div></div><div><p className="lead">{ko ? '모델을 이해하고, 더 효율적인 AI를 만듭니다.' : 'Understanding models. Building efficient AI.'}</p><p>{ko ? '경북소프트웨어마이스터고등학교 인공지능소프트웨어 개발과에서 AI와 소프트웨어 개발을 배우고 있습니다.' : 'I study AI Software Development at Gyeongbuk Software Meister High School.'}</p><p>{ko ? 'LLM 모델링과 최적화, 데이터 처리와 API 활용에 관심이 있습니다. 논문을 읽으며 원리를 정리하고, 프로젝트에 적용하는 과정을 기록합니다.' : 'My interests include LLM modeling, optimization, data processing and APIs. I document the path from reading a paper to applying an idea.'}</p></div></div></motion.section>
      <section id="projects" className="container section project-section"><div className="section-label"><span>02 / SELECTED WORK</span><span>03 PROJECTS</span></div><h2>{ko ? '문제에서 시작한 프로젝트' : 'Ideas, put into practice.'}</h2><ProjectGallery projects={projects} lang={lang} reduced={!!reduced} onSelect={setProject} renderDetails={p=><ProjectTechnology name={p.name} lang={lang}/>}/></section>
      <section className="container section"><div className="section-label"><span>03 / READING NOTES</span><span>{reviews.length.toString().padStart(2,'0')} NOTES</span></div><div className="section-title"><h2>{ko ? '읽고, 질문하고, 기록합니다.' : 'Notes from the reading desk.'}</h2><a href="#/reviews">{ko ? '전체 기록' : 'All notes'}<ArrowUpRight size={18}/></a></div><div>{reviews.slice(0,3).map(reviewLink)}</div><a className="archive-link" href="https://iris112-sung.github.io/" target="_blank" rel="noopener noreferrer">Study Archive · GitHub Pages<ArrowUpRight size={16}/></a></section>
      <section id="contact" className="container section contact"><p className="eyebrow">04 / GET IN TOUCH</p><h2>{ko ? '다음 아이디어를 함께.' : 'Start a conversation.'}</h2><p>{ko ? 'AI와 소프트웨어에 관한 이야기, 프로젝트와 협업을 기다립니다.' : 'Open to conversations about AI, software and collaboration.'}</p><a className="mail" href="mailto:mineiris@naver.com">mineiris@naver.com<ArrowUpRight/></a></section>
    </>}
    </main><footer className="container"><span>© 2026 Yunseong Bae</span><a href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14}/></a></footer>
    </div>
    {project && <ProjectDialog project={project} lang={lang} onClose={() => setProject(null)}/>}
  </>;
}
