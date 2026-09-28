import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import LatticeLoader from './react-bits/LatticeLoader';

export default function LoadingScreen({ ready, lang }) {
  const reduced = useReducedMotion();
  return <AnimatePresence>{!ready && <motion.div key="loading" className="page-loader" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced ? 0 : 0.25}}>
    <span className="loader-name">YUNSEONG BAE</span>
    <LatticeLoader label={lang === 'ko' ? '불러오는 중' : 'Loading'} pattern="orbit" grid={4} cellSize={10} gap={5} color="#c89bff" showTimer={false}/>
  </motion.div>}</AnimatePresence>;
}
