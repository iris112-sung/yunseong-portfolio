import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';

export default function ScrollHeader({ alwaysVisible, children }) {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(() => window.innerHeight);
  const [interactive, setInteractive] = useState(() => window.scrollY > 40);
  useEffect(() => {
    const resize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useMotionValueEvent(scrollY, 'change', y => setInteractive(y > 40));
  const opacity = useTransform(scrollY, [0, 40, height * 0.65], [0, 0, 1]);
  const filter = useTransform(scrollY, [40, height * 0.65], ['blur(14px)', 'blur(0px)']);
  const y = useTransform(scrollY, [0, height * 0.65], [-12, 0]);
  const visible = alwaysVisible || interactive;
  return <motion.header className="scroll-header" inert={!visible} aria-hidden={!visible}
    style={alwaysVisible ? { opacity: 1, filter: 'none', y: 0 } : {
      opacity: reduced ? Number(interactive) : opacity,
      filter: reduced ? 'none' : filter,
      y: reduced ? 0 : y,
      pointerEvents: visible ? 'auto' : 'none'
    }}>{children}</motion.header>;
}
