import { motion } from 'framer-motion';
import type { LoadingSpinnerProps } from '@/types';

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
};

export default function EnhancedLoadingSpinner({
  size = 'md',
  color = 'teal',
  text = 'Loading...'
}: LoadingSpinnerProps) {
  const containerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
  };

  const circleVariants = {
    start: { y: '0%' },
    end: { y: '100%' },
  };

  const circleTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const bgClass = colorMap[color] || 'bg-teal-500';

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="flex space-x-2"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className={`${sizeClasses[size] || sizeClasses.md} ${bgClass} rounded-full`}
            variants={circleVariants}
            transition={circleTransition}
          />
        ))}
      </motion.div>
      <p className="mt-4 text-lg font-semibold text-gray-700">{text}</p>
    </div>
  );
}
