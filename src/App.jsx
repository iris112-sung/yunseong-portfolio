import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Github, Mail, X, Menu, Search, ArrowLeft, Cpu, Code2, BookOpen } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import BlurText from './components/react-bits/BlurText';
import SpotlightCard from './components/react-bits/SpotlightCard';
import Magnet from './components/react-bits/Magnet';
import AeroShards from './components/react-bits/AeroShards';
import reviews from './reviews.json';

const projects = [
  { name: 'Run a B', type: 'LLM ENGINEERING', tags: ['PyTorch', 'LoRA', 'HF Transformers', 'React', 'Spring Boot'], ko: ['소상공인을 위한 정책 분석 AI', '기획 · LLM 엔지니어링 · 팀장', '단순한 공고 나열을 넘어, 사업 조건에 맞는 정책 해석과 리포트를 제공하기 위한 프로젝트입니다.', '통합 정책 허브, 정책 원문 분석, 지원사업 추천 기능을 설계했습니다. 팀장으로 서비스 기획과 LLM 파인튜닝을 담당했습니다.'], en: ['Policy intelligence for small businesses', 'Planning · LLM engineering · Team lead', 'A project to turn policy documents into personalized explanations for small business owners.', 'Designed a policy hub, document analysis and program recommendations. Led planning and LLM fine-tuning.'] },
  { name: 'Reply', type: 'AI APPLICATION', tags: ['JavaScript', 'HTML', 'Python', 'AWS', 'OpenAI API'], ko: ['댓글의 의미를 지키는 AI', '기획 · 발표', '유튜브의 유해한 댓글을 삭제하는 대신 표현을 순화하면서 맥락을 보존하는 서비스를 기획했습니다.', '크롬 확장 프로그램으로 댓글을 감지하고 AI API로 유해 표현을 판단·순화하는 흐름을 설계했습니다. 기획과 발표에 참여했습니다.'], en: ['A more thoughtful comment section', 'Planning · Presentation', 'A service concept that softens harmful YouTube comments while preserving their context.', 'Planned a Chrome extension workflow that detects comments and uses an AI API to identify and rewrite harmful language. Contributed to planning and presentation.'] },
  { name: 'Wife', type: 'FRONTEND DEVELOPMENT', tags: ['HTML', 'CSS', 'JavaScript', 'Figma'], ko: ['한눈에 보는 구독과 소비', '기획 · 프론트엔드 개발', '작지만 반복되는 구독 지출을 시각화해 사용자가 소비 습관을 이해하도록 돕는 서비스입니다.', 'OTT 서비스 정보와 내 구독을 한 화면에서 살펴보는 대시보드를 기획하고 프론트엔드 개발에 참여했습니다.'], en: ['Subscriptions, in perspective', 'Planning · Frontend development', 'A service that makes recurring subscription costs visible and helps users understand spending habits.', 'Contributed to planning and frontend development for an OTT subscription dashboard.'] }
];
const technical = {
  'Run a B': { ko: [['모델 학습', 'PyTorch · Hugging Face Transformers 기반 LLM 파인튜닝, LoRA를 활용한 파라미터 효율적 학습'], ['서비스 구성', 'React 프론트엔드 · Spring Boot 백엔드'], ['담당 범위', '정책 분석 서비스 기획, LLM 파인튜닝 및 팀 리딩']], en: [['Model training', 'LLM fine-tuning with PyTorch and Hugging Face Transformers; parameter-efficient adaptation with LoRA'], ['Application stack', 'React frontend · Spring Boot backend'], ['Contribution', 'Policy analysis planning, LLM fine-tuning and team leadership']] },
  Reply: { ko: [['처리 흐름', '댓글 감지 → AI 기반 유해 표현 판별 → 문맥을 보존하는 표현 순화'], ['서비스 구성', 'JavaScript · HTML 기반 브라우저 확장, Python · OpenAI API · AWS'], ['담당 범위', 'AI 활용 시나리오와 서비스 흐름 기획, 발표']], en: [['Processing flow', 'Comment detection → harmful-language classification → context-preserving rewriting'], ['Application stack', 'JavaScript / HTML browser extension, Python, OpenAI API and AWS'], ['Contribution', 'AI use-case planning, service workflow and presentation']] },
  Wife: { ko: [['인터페이스', 'OTT 서비스 정보와 구독 현황을 통합하는 대시보드'], ['서비스 구성', 'HTML · CSS · JavaScript 기반 웹 UI, Figma 화면 설계'], ['담당 범위', '구독 관리 서비스 기획 및 프론트엔드 개발 참여']], en: [['Interface', 'A dashboard combining OTT service information and subscription status'], ['Application stack', 'HTML, CSS and JavaScript web UI; screen design with Figma'], ['Contribution', 'Subscription-service planning and frontend development']] }
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
      <section><h3>{lang === 'ko' ? '개발 목적' : 'Purpose'}</h3><p>{t[2]}</p></section>
      <section><h3>{lang === 'ko' ? '내용' : 'Work'}</h3><p>{t[3]}</p></section>
      <ProjectTechnology name={project.name} lang={lang}/>
    </div></dialog>;
}

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'ko'; } catch { return 'ko'; } });
  const [route, setRoute] = useState(location.hash);
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState(null);
  const [query, setQuery] = useState('');
  const reduced = useReducedMotion();
  const ko = lang === 'ko';
  useEffect(() => { const listener = () => { setRoute(location.hash); setMenu(false); }; window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener); }, []);
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('portfolio-language', lang); } catch {} }, [lang]);
  const article = route.startsWith('#/reviews/') ? reviews.find(r => r.slug === route.split('/')[2]) : null;
  const isBlog = route.startsWith('#/reviews');
  useEffect(() => { if(isBlog || route === '#/') window.scrollTo(0,0); else if(route.startsWith('#')) requestAnimationFrame(() => document.getElementById(route.slice(1))?.scrollIntoView()); document.title = article ? `${article.title} · Study Archive` : 'Yunseong Bae · AI Engineer'; }, [route, article, isBlog]);
  const visibleReviews = reviews.filter(r => (r.title + r.body).toLowerCase().includes(query.toLowerCase()));
  const reviewLink = (r, i) => <a className="review-row" href={`#/reviews/${r.slug}`} key={r.slug}><span className="review-number">{String(i + 1).padStart(2,'0')}</span><div><div className="review-meta">{r.date} <span>{r.draft ? (ko ? '작성 중' : 'In progress') : 'REVIEW'}</span></div><h3>{r.title}</h3></div><ArrowUpRight /></a>;
  return <>
    <a className="skip" href="#main">{ko ? '본문으로 이동' : 'Skip to content'}</a>
    <header><a className="wordmark" href="#/">Yunseong Bae<span> / AI ENGINEER</span></a><nav aria-label="Main navigation" className={menu ? 'open' : ''}><a href="#about">{ko ? '소개' : 'About'}</a><a href="#projects">{ko ? '프로젝트' : 'Projects'}</a><a href="#/reviews">{ko ? '논문 기록' : 'Reading'}</a><a href="#contact">{ko ? '연락' : 'Contact'}</a></nav><div className="header-actions"><div className="languages">{['ko','en'].map(l => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}>{l === 'ko' ? 'KR' : 'EN'}</button>)}</div><button className="icon-button mobile-menu" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <main id="main">
    {isBlog ? <div className="archive container">
      <a className="back" href={article ? '#/reviews' : '#/'}><ArrowLeft size={16}/>{article ? 'Study Archive' : 'Portfolio'}</a>
      {article ? <><div className="article-heading"><p className="eyebrow">PAPER NOTES / {article.date}</p><h1>{article.title}</h1>{article.draft && <p className="draft-notice">{ko ? '작성 중인 학습 노트입니다. 현재까지 작성한 내용을 기록합니다.' : 'A work-in-progress reading note, preserved as written.'}</p>}</div><article className="prose"><Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{img: ({src,alt}) => <img src={src?.startsWith('/assets/') ? `.${src}` : src} alt={alt || article.title} loading="lazy" />}}>{article.body}</Markdown></article></> : <><p className="eyebrow">READ. QUESTION. UNDERSTAND.</p><h1>Study Archive<span className="blue">.</span></h1><p className="lead">{ko ? '논문을 읽고, 구조를 이해하고, 나의 언어로 남기는 기록.' : 'Reading papers. Understanding systems. Thinking in my own words.'}</p><label className="search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={ko ? '제목이나 내용으로 검색' : 'Search titles or notes'} aria-label={ko ? '논문 검색' : 'Search papers'}/></label><p className="result-count">{visibleReviews.length} NOTES</p><div>{visibleReviews.map(reviewLink)}</div>{!visibleReviews.length && <p>{ko ? '검색 결과가 없습니다.' : 'No matching notes.'}</p>}</>}
    </div> : <>
      <section className="hero container">
        <div className="hero-scene"><AeroShards backgroundColor="#100e15" shardColor="#b89be8" accentColor="#a855f7" placement="right" flow="stream" speed={0.7} density={1.2} bloom={0.35} grain={0.025} paused={!!reduced}/></div>
        <p className="eyebrow">LLM MODELING / INFERENCE OPTIMIZATION</p>
        <h1>{ko ? <>경험으로 깊이를 만드는<br/><span>AI 엔지니어</span></> : <>Building depth.<br/><span>Through experience.</span></>}</h1>
        <p className="hero-name">{ko ? '배윤성' : 'Yunseong Bae'}</p>
        {reduced ? <p className="hero-intro">{ko ? '모델을 이해하고, 더 효율적인 AI를 만듭니다.' : 'Understanding models. Building efficient AI.'}</p> : <BlurText key={lang} text={ko ? '모델을 이해하고, 더 효율적인 AI를 만듭니다.' : 'Understanding models. Building efficient AI.'} className="hero-intro" delay={55} direction="bottom" />}
        <div className="hero-bottom"><p>{ko ? 'LLM 모델링과 추론 최적화를 공부하며, 프로젝트와 논문 리뷰로 이해를 넓혀가고 있습니다.' : 'Exploring LLM modeling and inference optimization through hands-on projects and close reading.'}</p><div className="actions"><Magnet padding={20} magnetStrength={8} disabled={!!reduced}><a className="button primary" href="#projects">{ko ? '프로젝트 보기' : 'Explore projects'}<ArrowDown size={17}/></a></Magnet><a className="button" href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer"><Github size={17}/>GitHub<ArrowUpRight size={16}/></a></div></div>
        <div className="hero-footer"><span>AI SOFTWARE STUDENT</span><span>BASED IN KOREA / 2026</span></div>
      </section>
      <section id="about" className="container section"><div className="section-label"><span>01 / ABOUT</span><span>LEARNING IN PUBLIC</span></div><div className="about-grid"><h2>{ko ? <>깊이 이해하고,<br/>직접 구현합니다.</> : <>Understand deeply.<br/>Build deliberately.</>}</h2><div><p className="lead">{ko ? '경북소프트웨어마이스터고등학교 인공지능소프트웨어 개발과에서 AI와 소프트웨어 개발을 배우고 있습니다.' : 'I study AI Software Development at Gyeongbuk Software Meister High School.'}</p><p>{ko ? 'LLM 모델링과 최적화, 데이터 처리와 API 활용에 관심이 있습니다. 논문을 읽으며 원리를 정리하고, 프로젝트에 적용하는 과정을 기록합니다.' : 'My interests include LLM modeling, optimization, data processing and APIs. I document the path from reading a paper to applying an idea.'}</p></div></div></section>
      <section id="projects" className="container section"><div className="section-label"><span>02 / SELECTED WORK</span><span>03 PROJECTS</span></div><h2>{ko ? '문제에서 시작한 프로젝트' : 'Ideas, put into practice.'}</h2><div className="projects">{projects.map((p,i) => <SpotlightCard className="project" spotlightColor="rgba(168, 85, 247, 0.15)" key={p.name}><div className="project-top"><span>0{i+1}</span><span>{p.type}</span></div><div className="project-mark" aria-hidden="true">{i === 0 ? <Cpu/> : i === 1 ? <Code2/> : <BookOpen/>}<span>{p.name}</span></div><h3>{p[lang][0]}</h3><p>{p[lang][1]}</p><ProjectTechnology name={p.name} lang={lang}/><button className="project-open" onClick={() => setProject(p)} aria-haspopup="dialog">{ko ? '자세히 보기' : 'View project'}<ArrowUpRight size={18}/></button></SpotlightCard>)}</div></section>
      <section className="container section"><div className="section-label"><span>03 / READING NOTES</span><span>{reviews.length.toString().padStart(2,'0')} NOTES</span></div><div className="section-title"><h2>{ko ? '읽고, 질문하고, 기록합니다.' : 'Notes from the reading desk.'}</h2><a href="#/reviews">{ko ? '전체 기록' : 'All notes'}<ArrowUpRight size={18}/></a></div><div>{reviews.slice(0,3).map(reviewLink)}</div><a className="archive-link" href="https://iris112-sung.github.io/" target="_blank" rel="noopener noreferrer">Study Archive · GitHub Pages<ArrowUpRight size={16}/></a></section>
      <section id="contact" className="container section contact"><p className="eyebrow">04 / GET IN TOUCH</p><h2>{ko ? '다음 아이디어를 함께.' : 'Start a conversation.'}</h2><p>{ko ? 'AI와 소프트웨어에 관한 이야기, 프로젝트와 협업을 기다립니다.' : 'Open to conversations about AI, software and collaboration.'}</p><a className="mail" href="mailto:mineiris@naver.com">mineiris@naver.com<ArrowUpRight/></a></section>
    </>}
    </main><footer className="container"><span>© 2026 Yunseong Bae</span><a href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14}/></a></footer>
    {project && <ProjectDialog project={project} lang={lang} onClose={() => setProject(null)}/>}
  </>;
}
