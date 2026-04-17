import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } },
};

export function PageMotion({ children, ...props }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{ width: '100%' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({ children, ...props }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  );
}
