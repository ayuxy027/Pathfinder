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
          '0 0 5px #fbbf24, 0 0 10px #fbbf24',
          '0 0 8px #f59e0b, 0 0 15px #f59e0b',
          '0 0 5px #b45309, 0 0 10px #b45309',
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
      className="px-8 py-3 text-lg font-semibold text-black transition-all duration-300 bg-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
      style={{ backgroundColor: '#fbbf24' }}
    >
      <FaUserGraduate className="inline-block mr-2 text-black" />
      Get Career Guidance
    </motion.button>
  );
};

export default function EnhancedCTASection() {
  return (
    <section className="relative py-16 overflow-hidden bg-white">
      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-3xl font-bold md:text-4xl"
        >
          Discover Your Future with <span className="text-transparent text-semibold bg-proj bg-clip-text">PathFinder</span> Today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 text-xl text-gray-600"
        >
          Unlock your potential through personalized career guidance and expert support!
        </motion.p>
        <GlowingButton />
      </div>
    </section>
  );
}