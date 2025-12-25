import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
}

const AnimatedIcon = ({ Icon, size = 24, className = '' }: AnimatedIconProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.15,
        rotate: 5,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Icon size={size} />
    </motion.div>
  );
};

interface AnimatedIconWrapperProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedIconWrapper = ({ children, className = '' }: AnimatedIconWrapperProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.1,
        y: -2,
        filter: 'brightness(1.2)',
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedIcon;
