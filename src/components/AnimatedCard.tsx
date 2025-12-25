import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
  glowOnHover?: boolean;
}

const AnimatedCard = ({ 
  children, 
  className = '',
  delay = 0,
  hoverScale = 1.04,
  glowOnHover = true,
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ 
        scale: hoverScale,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      className={`${className} ${glowOnHover ? 'hover-glow-card' : ''}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
