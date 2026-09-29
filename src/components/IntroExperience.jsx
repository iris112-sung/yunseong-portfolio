import { lazy, Suspense, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
const BlackHoleScene = lazy(() => import('./BlackHoleScene'));
const AeroShards = lazy(() => import('./react-bits/AeroShards'));

export default function IntroExperience({ lang, reduced, onReady }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const sculptureOpacity = useTransform(scrollYProgress, [0, 0.22, 0.58, 1], [1, 1, 0.13, 0]);
  const sculptureScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.75]);
  const titleOpacity = useTransform(scrollYProgress, reduced ? [0, 0.2, 0.201, 1] : [0, 0.17, 0.42, 0.85, 1], reduced ? [0, 0, 1, 1] : [0, 0, 1, 1, 0.45]);
  const titleY = useTransform(scrollYProgress, [0.17, 0.5, 1], [48, 0, -25]);
  const titleScale = useTransform(scrollYProgress, [0.17, 0.5, 1], [0.94, 1, 1]);
  const titleBlur = useTransform(scrollYProgress, [0.17, 0.42], [18, 0]);
  const titleFilter = useTransform(titleBlur, value => `blur(${value}px)`);
  const ko = lang === 'ko';
  return <section ref={ref} className={`intro-experience${reduced ? ' is-reduced' : ''}`} aria-label={ko ? '배윤성 포트폴리오 인트로' : 'Yunseong Bae portfolio intro'}>
    <div className="intro-stage">
      <motion.div className="intro-art" style={reduced ? {} : { opacity: sculptureOpacity, scale: sculptureScale }}>
        <Suspense fallback={null}><BlackHoleScene reduced={reduced} onReady={onReady}/></Suspense>
      </motion.div>
      <motion.div className="intro-shards-surround" style={reduced ? {} : { opacity: sculptureOpacity }}>
        <Suspense fallback={null}><AeroShards backgroundColor="#000000" shardColor="#867b9e" accentColor="#91cdbf" placement="full" flow="ribbon" material="chrome" detail="bold" scale={1.3} density={0.8} shardSize={1.5} speed={0.55} bloom={0.2} grain={0} chromaticAberration={0.001} paused={reduced}/></Suspense>
      </motion.div>
      <motion.div className="intro-statement" style={reduced ? { opacity: titleOpacity } : { opacity: titleOpacity, y: titleY, scale: titleScale, filter: titleFilter }}>
        <p className="eyebrow">FROM UNDERSTANDING TO BUILDING</p>
        <h1>{ko ? <><span className="intro-glass-line" data-text="더 깊이 이해하고,">더 깊이 이해하고,</span><span className="intro-glass-line intro-glass-line--accent" data-text="더 빠르게 구현합니다.">더 빠르게 구현합니다.</span></> : <><span className="intro-glass-line" data-text="Understand deeper.">Understand deeper.</span><span className="intro-glass-line intro-glass-line--accent" data-text="Build faster.">Build faster.</span></>}</h1>
        <p className="intro-identity">{ko ? '배윤성' : 'Yunseong Bae'}<span>AI ENGINEER</span></p>
      </motion.div>
    </div>
  </section>;
}
