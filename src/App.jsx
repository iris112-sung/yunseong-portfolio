import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Github, X, Menu, Search, ArrowLeft, UserRound, FolderCode, BookOpen, Mail, Linkedin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import IntroExperience from './components/IntroExperience';
import LoadingScreen from './components/LoadingScreen';
import ProjectGallery from './components/ProjectGallery';
import ProjectCaseStudy from './components/ProjectCaseStudy';
import ScrollHeader from './components/ScrollHeader';
import RubberSegment from './components/react-bits/RubberSegment/RubberSegment';
import reviews from './reviews.json';
import { projects } from './projects';

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'ko'; } catch { return 'ko'; } });
  const [route, setRoute] = useState(location.hash);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [sceneReady, setSceneReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const reduced = useReducedMotion();
  const ko = lang === 'ko';
  const navItems = [
    { value: '#about', label: ko ? '소개' : 'About', icon: <UserRound size={15} /> },
    { value: '#projects', label: ko ? '프로젝트' : 'Projects', icon: <FolderCode size={15} /> },
    { value: '#/reviews', label: ko ? '논문 기록' : 'Reading', icon: <BookOpen size={15} /> },
    { value: '#contact', label: ko ? '연락' : 'Contact', icon: <Mail size={15} /> }
  ];
  const navigate = value => {
    setMenu(false);
    if (location.hash === value) {
      document.getElementById(value.slice(1))?.scrollIntoView();
    } else {
      location.hash = value;
    }
  };
  useEffect(() => { const listener = () => { setRoute(location.hash); setMenu(false); }; window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener); }, []);
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('portfolio-language', lang); } catch {} }, [lang]);
  const article = route.startsWith('#/reviews/') ? reviews.find(r => r.slug === route.split('/')[2]) : null;
  const isBlog = route.startsWith('#/reviews');
  const isProjectPage = route.startsWith('#/projects/');
  const caseProject = isProjectPage ? projects.find(project => project.slug === route.split('/')[2]) : null;
  useEffect(() => {
    document.documentElement.classList.toggle('is-project-page', isProjectPage);
    return () => document.documentElement.classList.remove('is-project-page');
  }, [isProjectPage]);
  const selectedNav = isBlog ? '#/reviews' : navItems.some(item => item.value === route) ? route : '#about';
  const ready = fontsReady && (sceneReady || isBlog || isProjectPage);
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
  useEffect(() => {
    document.title = caseProject ? `${caseProject.name} · Yunseong Bae` : article ? `${article.title} · Study Archive` : 'Yunseong Bae · AI Engineer';
    if (!ready) return;
    requestAnimationFrame(() => {
      if (isProjectPage) {
        const section = route.split('/')[3];
        const target = section ? document.getElementById(`case-${section}`) : null;
        if (target) target.scrollIntoView({ behavior: 'instant' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (isBlog || route === '#/') window.scrollTo({ top: 0, behavior: 'instant' });
      else if (route.startsWith('#')) document.getElementById(route.slice(1))?.scrollIntoView({ behavior: 'instant' });
    });
  }, [route, article, isBlog, isProjectPage, caseProject, ready]);
  const visibleReviews = reviews.filter(r => (r.title + r.body).toLowerCase().includes(query.toLowerCase()));
  const reviewLink = (r, i) => <a className="review-row" href={`#/reviews/${r.slug}`} key={r.slug}><span className="review-number">{String(i + 1).padStart(2,'0')}</span><div><div className="review-meta">{r.date} <span>{r.draft ? (ko ? '작성 중' : 'In progress') : 'REVIEW'}</span></div><h3>{r.title}</h3></div><ArrowUpRight /></a>;
  if (isProjectPage) return <><LoadingScreen ready={ready} lang={lang}/><ProjectCaseStudy key={caseProject?.slug || 'not-found'} project={caseProject} projects={projects} lang={lang} setLang={setLang} ready={ready}/></>;
  return <>
    <LoadingScreen ready={ready} lang={lang}/>
    <div className="app-shell" inert={!ready} aria-busy={!ready}>
    <a className="skip" href="#main">{ko ? '본문으로 이동' : 'Skip to content'}</a>
    <ScrollHeader alwaysVisible={isBlog}>
      <a className="wordmark" href="#/">Yunseong Bae<span> / AI ENGINEER</span></a>
      <nav aria-label={ko ? '주요 탐색' : 'Main navigation'} className={menu ? 'open' : ''}>
        <RubberSegment
          items={navItems}
          value={selectedNav}
          onChange={navigate}
          aria-label={ko ? '페이지 이동' : 'Page navigation'}
          trackColor="#edf0eb"
          thumbColor="#293b2f"
          textColor="#526758"
          activeTextColor="#ffffff"
          radius={14}
          inset={3}
        />
      </nav>
      <div className="header-actions"><div className="languages">{['ko','en'].map(l => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}>{l === 'ko' ? 'KR' : 'EN'}</button>)}</div><button className="icon-button mobile-menu" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>
    </ScrollHeader>
    <main id="main">
    {isBlog ? <div className="archive container">
      <a className="back" href={article ? '#/reviews' : '#/'}><ArrowLeft size={16}/>{article ? 'Study Archive' : 'Portfolio'}</a>
      {article ? <><div className="article-heading"><p className="eyebrow">PAPER NOTES / {article.date}</p><h1>{article.title}</h1>{article.draft && <p className="draft-notice">{ko ? '작성 중인 학습 노트입니다. 현재까지 작성한 내용을 기록합니다.' : 'A work-in-progress reading note, preserved as written.'}</p>}</div><article className="prose"><Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{img: ({src,alt}) => <img src={src?.startsWith('/assets/') ? `.${src}` : src} alt={alt || article.title} loading="lazy" />}}>{article.body}</Markdown></article></> : <><p className="eyebrow">READ. QUESTION. UNDERSTAND.</p><h1>Study Archive<span className="blue">.</span></h1><p className="lead">{ko ? '논문을 읽고, 구조를 이해하고, 나의 언어로 남기는 기록.' : 'Reading papers. Understanding systems. Thinking in my own words.'}</p><label className="search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={ko ? '제목이나 내용으로 검색' : 'Search titles or notes'} aria-label={ko ? '논문 검색' : 'Search papers'}/></label><p className="result-count">{visibleReviews.length} NOTES</p><div>{visibleReviews.map(reviewLink)}</div>{!visibleReviews.length && <p>{ko ? '검색 결과가 없습니다.' : 'No matching notes.'}</p>}</>}
    </div> : <>
      <IntroExperience lang={lang} reduced={!!reduced} onReady={onSceneReady}/>
      <motion.section id="about" className="section main-entry" initial={reduced ? false : {opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.7}}><div className="container"><div className="section-label"><span>01 / ABOUT</span><span>LEARNING IN PUBLIC</span></div><div className="about-grid"><div><h2>{ko ? '배윤성' : 'Yunseong Bae'}</h2><p className="main-role">AI ENGINEER</p><div className="main-links"><a href="#projects">{ko ? '프로젝트' : 'Projects'}<ArrowUpRight size={17}/></a><a href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer"><Github size={17}/>GitHub<ArrowUpRight size={17}/></a></div></div><div><p className="lead">{ko ? '모델을 이해하고, 더 효율적인 AI를 만듭니다.' : 'Understanding models. Building efficient AI.'}</p><p>{ko ? '경북소프트웨어마이스터고등학교 인공지능소프트웨어 개발과에서 AI와 소프트웨어 개발을 배우고 있습니다.' : 'I study AI Software Development at Gyeongbuk Software Meister High School.'}</p><p>{ko ? 'LLM 모델링과 최적화, 데이터 처리와 API 활용에 관심이 있습니다. 논문을 읽으며 원리를 정리하고, 프로젝트에 적용하는 과정을 기록합니다.' : 'My interests include LLM modeling, optimization, data processing and APIs. I document the path from reading a paper to applying an idea.'}</p></div></div></div></motion.section>
      <section id="projects" className="section project-section"><div className="container"><div className="section-label"><span>02 / SELECTED WORK</span><span>03 PROJECTS</span></div><h2>{ko ? '문제에서 시작한 프로젝트' : 'Ideas, put into practice.'}</h2><ProjectGallery projects={projects} lang={lang} reduced={!!reduced}/></div></section>
      <section className="section reading-section"><div className="container"><div className="section-label"><span>03 / READING NOTES</span><span>{reviews.length.toString().padStart(2,'0')} NOTES</span></div><div className="section-title"><h2>{ko ? '읽고, 질문하고, 기록합니다.' : 'Notes from the reading desk.'}</h2><a href="#/reviews">{ko ? '전체 기록' : 'All notes'}<ArrowUpRight size={18}/></a></div><div>{reviews.slice(0,3).map(reviewLink)}</div><a className="archive-link" href="https://iris112-sung.github.io/" target="_blank" rel="noopener noreferrer">Study Archive · GitHub Pages<ArrowUpRight size={16}/></a></div></section>
      <section id="contact" className="section contact"><div className="container"><p className="eyebrow">04 / GET IN TOUCH</p><h2>{ko ? '다음 아이디어를 함께.' : 'Start a conversation.'}</h2><p>{ko ? 'AI와 소프트웨어에 관한 이야기, 프로젝트와 협업을 기다립니다.' : 'Open to conversations about AI, software and collaboration.'}</p><a className="mail" href="mailto:mineiris@naver.com">mineiris@naver.com<ArrowUpRight/></a><a className="contact-linkedin" href="https://www.linkedin.com/in/yunseong-bae-9a964b35b/" target="_blank" rel="noopener noreferrer"><Linkedin size={19}/><span>LinkedIn · Yunseong Bae</span><ArrowUpRight size={17}/></a></div></section>
    </>}
    </main><footer className="container"><span>© 2026 Yunseong Bae</span><a href="https://github.com/iris112-sung" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14}/></a></footer>
    </div>
  </>;
}
