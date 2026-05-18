import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/roadmap');
  }, [navigate]);

  return (
    <section className="overflow-hidden relative py-16 bg-gradient-to-br from-teal-50 to-white sm:py-20 lg:py-24">
      <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            Unlock your potential through personalized career guidance and expert support!
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="flex justify-center items-center px-6 py-3 text-base font-medium text-black bg-amber-400 rounded-full shadow-lg transition-all duration-300 sm:px-8 sm:py-4 lg:px-10 lg:py-4 sm:text-lg lg:text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-300 hover:bg-amber-500 hover:shadow-xl"
          >
            <GraduationCap className="mr-2 text-base sm:mr-3 sm:text-lg lg:text-xl" aria-hidden="true" />
            Get Career Guidance
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
