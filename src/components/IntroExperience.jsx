import { lazy, Suspense, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
const BlackHoleScene = lazy(() => import('./BlackHoleScene'));
const AeroShards = lazy(() => import('./react-bits/AeroShards'));

export default function IntroExperience({ lang, reduced, onReady }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const sculptureOpacity = useTransform(scrollYProgress, [0, 0.22, 0.58, 1], [1, 1, 0.13, 0]);
  const sculptureScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.75]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.43, 0.85, 1], [0, 0, 1, 1, 0.45]);
  const titleY = useTransform(scrollYProgress, [0.2, 0.5, 1], [70, 0, -25]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const ko = lang === 'ko';
  const enter = () => window.scrollTo({ top: ref.current.offsetTop + (ref.current.offsetHeight - innerHeight) * 0.62, behavior: reduced ? 'instant' : 'smooth' });
  return <section ref={ref} className={`intro-experience${reduced ? ' is-reduced' : ''}`} aria-label={ko ? '배윤성 포트폴리오 인트로' : 'Yunseong Bae portfolio intro'}>
    <div className="intro-stage">
      <motion.div className="intro-art" style={reduced ? {} : { opacity: sculptureOpacity, scale: sculptureScale }}>
        <Suspense fallback={null}><BlackHoleScene reduced={reduced} onReady={onReady}/></Suspense>
      </motion.div>
      <motion.div className="intro-shards-surround" style={reduced ? {} : { opacity: sculptureOpacity }}>
        <Suspense fallback={null}><AeroShards backgroundColor="#000000" shardColor="#867b9e" accentColor="#91cdbf" placement="full" flow="ribbon" material="chrome" detail="bold" scale={1.3} density={0.8} shardSize={1.5} speed={0.55} bloom={0.2} grain={0} chromaticAberration={0.001} paused={reduced}/></Suspense>
      </motion.div>
      <motion.div className="intro-statement" style={reduced ? {} : { opacity: titleOpacity, y: titleY }}>
        <p className="eyebrow">FROM UNDERSTANDING TO BUILDING</p>
        <h1>{ko ? <>더 깊이 이해하고,<br/><span>더 빠르게 구현한다.</span></> : <>Understand deeper.<br/><span>Build faster.</span></>}</h1>
        <p className="intro-identity">{ko ? '배윤성' : 'Yunseong Bae'}<span>AI ENGINEER</span></p>
      </motion.div>
      <motion.div className="intro-edge" style={reduced ? {} : { opacity: cueOpacity }}><span>YUNSEONG BAE</span><button className="icon-button intro-next" onClick={enter} aria-label={ko ? '소개 문구 보기' : 'Reveal introduction'} title={ko ? '소개 문구 보기' : 'Reveal introduction'}><ArrowDown/></button><span>PORTFOLIO / 2026</span></motion.div>
    </div>
  </section>;
}
