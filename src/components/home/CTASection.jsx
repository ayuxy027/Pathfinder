import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaUserGraduate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GlowingButton = () => {
  const buttonRef = useRef(null);
  const glowAnimation = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const animateGlow = async () => {
      await glowAnimation.start({
        boxShadow: [
          '0 0 5px #f59e0b, 0 0 10px #f59e0b',
          '0 0 8px #fbbf24, 0 0 15px #fbbf24',
          '0 0 5px #f59e0b, 0 0 10px #f59e0b',
        ],
        transition: { duration: 3, ease: 'easeInOut', repeat: Infinity },
      });
    };
    animateGlow();
  }, [glowAnimation]);

  const handleClick = () => {
    navigate('/consult');
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={glowAnimation}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex justify-center items-center px-6 py-3 text-base font-medium text-black bg-amber-400 rounded-full shadow-lg transition-all duration-300 sm:px-8 sm:py-4 lg:px-10 lg:py-4 sm:text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 hover:bg-amber-500 hover:shadow-xl"
    >
      <FaUserGraduate className="mr-2 text-base sm:mr-3 sm:text-lg lg:text-xl" />
      Get Career Guidance
    </motion.button>
  );
};

export default function EnhancedCTASection() {
  return (
    <section className="overflow-hidden relative py-16 bg-gradient-to-br from-teal-50 to-white sm:py-20 lg:py-24">
      <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="mb-4 text-3xl font-medium leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
            Discover Your Future with{' '}
            <span className="font-medium text-teal-600">PathFinder</span>{' '}
            Today
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            Unlock your potential through personalized career guidance and expert support!
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <GlowingButton />
        </motion.div>
      </div>
    </section>
  );
}