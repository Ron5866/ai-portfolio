import { motion } from 'framer-motion';
import { ReactNode, ComponentProps } from 'react';

interface AnimatedButtonProps extends ComponentProps<typeof motion.button> {
  children: ReactNode;
  className?: string;
  asLink?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: string;
}

const AnimatedButton = ({ 
  children, 
  className = '',
  asLink = false,
  href,
  target,
  rel,
  download,
  ...props
}: AnimatedButtonProps) => {
  const buttonAnimation = {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    whileTap: { 
      scale: 0.97,
      transition: { duration: 0.1 }
    },
  };

  if (asLink && href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        download={download}
        {...buttonAnimation}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...buttonAnimation}
      {...props}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
