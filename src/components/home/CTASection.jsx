import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaUserGraduate } from 'react-icons/fa'; // Changed icon to represent education
import { useNavigate } from 'react-router-dom';

const GlowingButton = () => {
  const buttonRef = useRef(null);
  const glowAnimation = useAnimation();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const animateGlow = async () => {
      await glowAnimation.start({
        boxShadow: [
          '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24', // Light yellow for glow
          '0 0 15px #f59e0b, 0 0 30px #f59e0b, 0 0 45px #f59e0b',
          '0 0 10px #b45309, 0 0 20px #b45309, 0 0 30px #b45309',
        ],
        scale: [1, 1.05, 1],
        transition: { duration: 3, ease: 'easeInOut', repeat: Infinity },
      });
    };
    animateGlow();
  }, [glowAnimation]);

  const handleClick = () => {
    navigate('/consult'); // Navigate to the consultation route
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={glowAnimation}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick} // Handle button click
      className="px-8 py-3 text-lg font-semibold text-black transition-all duration-300 bg-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
      style={{ backgroundColor: '#fbbf24' }} // Solid gold background color
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
          className="mb-4 text-3xl font-bold text-transparent md:text-4xl bg-clip-text bg-proj"
        >
          Ready to Shape Your Future?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 text-xl text-gray-600"
        >
          Sign up now for personalized career guidance and unlock your potential!
        </motion.p>
        <GlowingButton />
      </div>
    </section>
  );
}