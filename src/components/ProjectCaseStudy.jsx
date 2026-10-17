import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Check, ChevronDown, FileText, Layers3, MessageSquareText, ScanText, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { projectDetails } from '../projectDetails';
import { projectCaseStudies } from '../projectCaseStudies';
import './ProjectCaseStudy.css';

const sections = [
  ['overview', '개요', 'Overview'], ['workflow', '서비스 흐름', 'Workflow'],
  ['build', '개발 기록', 'Development'], ['troubleshooting', '트러블슈팅', 'Troubleshooting'],
  ['benchmark', '벤치마킹', 'Benchmarking'], ['learnings', '배운 점', 'Learnings']
];

function FlowExample({ project, study, lang }) {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const ko = lang === 'ko';
  return <figure className={`case-demo case-demo--${project.slug}`}>
    <div className="case-demo-inner">
      <figcaption><span>{ko ? '서비스 흐름 예시' : 'Service flow study'}</span><span>{String(step + 1).padStart(2, '0')} / 03</span></figcaption>
      <div className="case-demo-screen">
        <div className="case-demo-bar"><span className="case-demo-brand"><Layers3 size={17}/>{project.name}</span><span>{ko ? '서비스 컨셉' : 'Service concept'}</span></div>
        <motion.div key={step} id={`demo-panel-${project.slug}`} role="tabpanel" aria-labelledby={`demo-tab-${project.slug}-${step}`} className="case-demo-content" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {project.slug === 'run-a-b' && <>
            <div className="case-demo-symbol">{step === 0 ? <FileText/> : step === 1 ? <ScanText/> : <Sparkles/>}</div>
            <p className="case-demo-eyebrow">{['POLICY DISCOVERY', 'SOURCE ANALYSIS', 'BUSINESS REPORT'][step]}</p>
            <h3>{ko ? ['필요한 정책을 한곳에서.', '조건을 하나씩 읽어냅니다.', '내 사업의 다음 선택으로.'][step] : ['Find the right starting point.', 'Read the conditions, one by one.', 'A basis for your next decision.'][step]}</h3>
            <div className="case-demo-lines">{(ko ? [['지원사업 공고 탐색', '업종과 지역별 정보 확인', '정책 원문으로 연결'], ['지원 대상과 자격', '신청 조건과 예외', '검토할 원문 근거'], ['사업 조건 대조', '추천 이유와 검토 사항', '신청 전 원문 확인']][step] : [['Browse program notices', 'Review industry and region', 'Open the source document'], ['Applicant eligibility', 'Conditions and exceptions', 'Source evidence to review'], ['Compare business conditions', 'Recommendation and review notes', 'Verify the source before applying']][step]).map(item => <div key={item}><Check size={15}/><span>{item}</span></div>)}</div>
          </>}
          {project.slug === 'reply' && <>
            <div className="case-demo-symbol">{step === 0 ? <MessageSquareText/> : step === 1 ? <ScanText/> : <Sparkles/>}</div>
            <p className="case-demo-eyebrow">{['ORIGINAL COMMENT', 'CONTEXT & TONE', 'REWRITING CONCEPT'][step]}</p>
            <h3>{ko ? ['대화에서 출발합니다.', '의견과 표현을 나눠 봅니다.', '의견은 남기고, 표현은 부드럽게.'][step] : ['Start with the conversation.', 'Separate the opinion from the tone.', 'Preserve the opinion. Soften the tone.'][step]}</h3>
            <div className="case-comment"><span>{ko ? (step === 2 ? '순화문 예시' : '원문 예시') : (step === 2 ? 'Example rewrite' : 'Example comment')}</span><p>{ko ? (step === 2 ? '설명의 근거를 더 자세히 알려주시면 좋겠습니다.' : '말도 안 되는 설명이네. 근거부터 좀 가져와.') : (step === 2 ? 'Could you explain the evidence behind this in more detail?' : 'This explanation is ridiculous. Bring some evidence first.')}</p>{step === 1 && <small>{ko ? '남길 의미: 설명의 근거를 요청하는 의견' : 'Meaning to preserve: a request for supporting evidence'}</small>}</div>
          </>}
          {project.slug === 'speaki' && <>
            <div className="case-demo-symbol">{step === 0 ? <AudioLines/> : step === 1 ? <ScanText/> : <ShieldCheck/>}</div>
            <p className="case-demo-eyebrow">{['VOICE INPUT', 'STRUCTURED INTENT', 'CONFIRMATION DESIGN'][step]}</p>
            <h3>{ko ? ['“아이스 아메리카노 두 잔 주세요.”', '말을 주문 정보로.', '확인과 검증을 거쳐 주문으로.'][step] : ['“Two iced Americanos, please.”', 'Turn words into order data.', 'Confirm, validate, then order.'][step]}</h3>
            {step === 0 ? <div className="case-audio" aria-hidden="true">{[12,22,38,26,48,64,34,52,72,45,30,58,40,24,46,32,18,12].map((height, i) => <i key={i} style={{ height }}/>)}</div> : step === 1 ? <dl className="case-order">{(ko ? [['메뉴','아메리카노'],['수량','2'],['옵션','ICE']] : [['Item','Americano'],['Quantity','2'],['Option','ICE']]).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl> : <div className="case-demo-lines"><div><Check size={15}/><span>{ko ? '사용자가 인식 문장과 주문 후보 확인' : 'User reviews the transcript and candidate'}</span></div><div><Check size={15}/><span>{ko ? 'Backend DB에서 메뉴·재고·가격 검증' : 'Backend validates menu, stock and price'}</span></div><div><ShieldCheck size={15}/><span>{ko ? '검증 후 확정하도록 설계' : 'Designed to confirm after validation'}</span></div></div>}
          </>}
        </motion.div>
      </div>
      <div className="case-demo-controls"><div role="tablist" aria-label={ko ? '서비스 흐름 단계' : 'Service flow steps'}>{study.flow.map((item, i) => <button key={i} id={`demo-tab-${project.slug}-${i}`} role="tab" aria-controls={`demo-panel-${project.slug}`} aria-selected={step === i} tabIndex={step === i ? 0 : -1} onClick={() => setStep(i)} onKeyDown={event => { const next = event.key === 'ArrowRight' ? (i + 1) % 3 : event.key === 'ArrowLeft' ? (i + 2) % 3 : null; if (next !== null) { event.preventDefault(); setStep(next); event.currentTarget.parentElement.children[next].focus(); } }}><span>{String(i + 1).padStart(2,'0')}</span>{item.title[lang]}</button>)}</div><button className="case-icon-button" onClick={() => setStep((step + 1) % 3)} aria-label={ko ? '다음 단계' : 'Next step'} title={ko ? '다음 단계' : 'Next step'}><ArrowRight size={20}/></button></div>
    </div>
  </figure>;
}

function SectionTitle({ number, label, children }) {
  return <div className="case-section-heading"><p className="case-kicker">{number} / {label}</p><h2>{children}</h2></div>;
}

export default function ProjectCaseStudy({ project, projects, lang, setLang, ready }) {
  const [active, setActive] = useState('overview');
  const ko = lang === 'ko';
  const study = project ? projectCaseStudies[project.slug] : null;
  useEffect(() => {
    if (!project) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id.replace('case-', ''));
    }, { rootMargin: '-150px 0px -55% 0px' });
    document.querySelectorAll('.case-section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [project]);
  if (!project) return <div className="case-study case-not-found"><p className="case-kicker">PROJECT NOT FOUND</p><h1>{ko ? '프로젝트를 찾을 수 없습니다.' : 'Project not found.'}</h1><a className="case-return" href="#projects"><ArrowLeft size={16}/>{ko ? '프로젝트 목록' : 'All projects'}</a></div>;
  const notes = projectDetails[project.name][lang].filter(([heading]) => !['문제 정의','Problem','기간 · 상태','Timeline and status'].includes(heading));
  const index = projects.findIndex(item => item.slug === project.slug);
  const others = projects.filter(item => item.slug !== project.slug);
  return <div className="case-study" style={{ '--case-accent': study.accent, '--case-wash': study.wash }} inert={!ready} aria-busy={!ready}>
    <a className="case-skip" href={`#/projects/${project.slug}/overview`}>{ko ? '본문으로 이동' : 'Skip to content'}</a>
    <div className="case-topbar" role="banner"><a className="case-wordmark" href="#/">Yunseong Bae<span> / PROJECT NOTES</span></a><div className="case-topbar-actions"><label className="case-project-select"><span className="sr-only">{ko ? '프로젝트 선택' : 'Select a project'}</span><select value={project.slug} onChange={event => { location.hash = `/projects/${event.target.value}`; }}>{projects.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><ChevronDown size={14}/></label><div className="case-languages">{['ko','en'].map(value => <button key={value} aria-pressed={lang === value} onClick={() => setLang(value)}>{value === 'ko' ? 'KR' : 'EN'}</button>)}</div><a className="case-return" href="#projects" aria-label={ko ? '포트폴리오로 돌아가기' : 'Back to portfolio'} title={ko ? '포트폴리오로 돌아가기' : 'Back to portfolio'}><ArrowLeft size={15}/><span>{ko ? '포트폴리오' : 'Portfolio'}</span></a></div></div>
    <main id="project-main">
      <div className="case-hero case-container"><div className="case-hero-top"><p className="case-kicker">SELECTED WORK / {String(index + 1).padStart(2,'0')}</p><p className="case-status"><span/>{study.status[lang]}</p></div><h1>{project.name}<span>.</span></h1><p className="case-tagline">{project[lang][0]}</p><p className="case-hero-description">{project[lang][2]}</p><dl className="case-facts"><div><dt>{ko ? '참여 역할' : 'My role'}</dt><dd>{project[lang][1]}</dd></div><div><dt>{ko ? '프로젝트' : 'Project'}</dt><dd>{study.period[lang]}</dd></div><div><dt>STACK</dt><dd>{project.tags.join(' · ')}</dd></div></dl></div>
      <FlowExample project={project} study={study} lang={lang}/>
      <nav className="case-index" aria-label={ko ? '프로젝트 목차' : 'Case study contents'}>{sections.map(([id, korean, english], i) => <a key={id} href={`#/projects/${project.slug}/${id}`} aria-current={active === id ? 'location' : undefined}><span>{String(i + 1).padStart(2,'0')}</span>{ko ? korean : english}</a>)}</nav>
      <section className="case-section case-container" id="case-overview"><SectionTitle number="01" label="OVERVIEW">{study.premise[lang]}</SectionTitle><div className="case-overview-copy"><p className="case-lead">{study.intro[lang]}</p><div className="case-question"><h3>{study.question[lang]}</h3><p>{study.answer[lang]}</p></div></div></section>
      <section className="case-section case-workflow" id="case-workflow"><div className="case-container"><SectionTitle number="02" label="SERVICE FLOW">{ko ? '사용자의 한 걸음씩.' : 'One step at a time.'}</SectionTitle><ol className="case-flow">{study.flow.map((item, i) => <li key={i}><span className="case-step-number">{String(i + 1).padStart(2,'0')}</span><h3>{item.title[lang]}</h3><p>{item.body[lang]}</p>{i < study.flow.length - 1 && <ArrowRight aria-hidden="true" size={21}/>}</li>)}</ol></div></section>
      <section className="case-section case-container" id="case-build"><SectionTitle number="03" label="DEVELOPMENT">{ko ? '설계와 구현의 기록.' : 'Decisions behind the work.'}</SectionTitle><div className="case-records">{notes.map(([heading, body]) => <div key={heading}><h3>{heading}</h3><p>{body}</p></div>)}</div></section>
      <section className="case-section case-troubleshooting" id="case-troubleshooting"><div className="case-container"><SectionTitle number="04" label="TROUBLESHOOTING">{ko ? '고민한 지점,\n선택한 방향.' : 'The questions.\nThe decisions.'}</SectionTitle><p className="case-section-intro">{ko ? '실험에서 관찰한 문제와 설계 중 검토한 이슈를 구분해 기록했습니다.' : 'Observed experimental issues and design considerations are labeled separately.'}</p><div className="case-issues">{study.issues.map((issue, i) => <details key={issue.title[lang]} name={`issues-${project.slug}`} open={i === 0}><summary><span className="case-issue-number">{String(i + 1).padStart(2,'0')}</span><div><span className="case-issue-kind">{issue.kind[lang]}</span><h3>{issue.title[lang]}</h3></div><ChevronDown size={21}/></summary><dl><div><dt>{ko ? '문제 · 배경' : 'Problem / context'}</dt><dd>{issue.problem[lang]}</dd></div><div><dt>{ko ? '접근 · 선택' : 'Approach / decision'}</dt><dd>{issue.decision[lang]}</dd></div><div><dt>{ko ? '결과 · 현재 상태' : 'Outcome / current status'}</dt><dd>{issue.result[lang]}</dd></div></dl></details>)}</div></div></section>
      <section className="case-section case-container" id="case-benchmark"><SectionTitle number="05" label="BENCHMARK NOTES">{ko ? '다른 서비스에서\n가져온 질문.' : 'Questions from\nother services.'}</SectionTitle><p className="case-section-intro">{ko ? '공개된 서비스 기능과 문서를 비교한 노트입니다. 오른쪽은 이를 바탕으로 정리한 이 프로젝트의 설계 관점입니다.' : 'These notes compare publicly documented capabilities. The final column records design implications for this project.'}</p><div className="case-table-scroll" role="region" aria-label={ko ? '서비스 벤치마킹 비교' : 'Service benchmark comparison'} tabIndex={0}><table className="case-benchmark-table"><thead><tr><th>{ko ? '비교 대상 · 출처' : 'Reference / source'}</th><th>{ko ? '관찰한 방식' : 'Observation'}</th><th>{ko ? '설계에 가져온 기준' : 'Design implication'}</th></tr></thead><tbody>{study.benchmarks.map(item => <tr key={item.name}><th scope="row"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}<ArrowUpRight size={16}/></a></th><td>{item.observation[lang]}</td><td>{item.lesson[lang]}</td></tr>)}</tbody></table></div><p className="case-source-date">{ko ? '공개 문서 확인: 2026.10.17 · 성능 우열을 평가한 실험은 아닙니다.' : 'Public documentation reviewed: 17 Oct 2026 · This is not a comparative performance test.'}</p></section>
      <section className="case-section case-learnings" id="case-learnings"><div className="case-container"><SectionTitle number="06" label="WHAT I LEARNED">{study.takeaway[lang]}</SectionTitle><div className="case-next-steps"><h3>{ko ? '다음으로 검증할 것' : 'What to validate next'}</h3><ul>{study.next[lang].map(item => <li key={item}><ArrowUpRight size={16}/><span>{item}</span></li>)}</ul></div></div></section>
      <div className="case-more case-container"><div className="case-more-heading"><p className="case-kicker">MORE WORK</p><a className="case-return" href="#projects"><ArrowLeft size={15}/>{ko ? '프로젝트 목록' : 'All projects'}</a></div><div className="case-more-grid">{others.map(item => <a href={`#/projects/${item.slug}`} key={item.slug}><img src={`./assets/projects/${item.slug}.png`} alt={`${item.name} project cover`} loading="lazy"/><div><h3>{item.name}</h3><ArrowUpRight size={20}/></div><p>{item[lang][0]}</p></a>)}</div></div>
    </main>
    <div className="case-footer case-container"><a href="#/">Yunseong Bae</a><span>PROJECT NOTES / {project.name}</span><a href="mailto:mineiris@naver.com">{ko ? '이야기 나누기' : 'Get in touch'}<ArrowUpRight size={15}/></a></div>
  </div>;
}
