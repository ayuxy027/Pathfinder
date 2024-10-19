import React from 'react';
import { FaChalkboardTeacher, FaBriefcase, FaUserGraduate, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeatureSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: FaUserGraduate,
      title: "Personalized Career Assessment",
      description: "Receive tailored career suggestions based on your skills, interests, and personality traits."
    },
    {
      icon: FaChartLine,
      title: "Job Market Insights",
      description: "Access real-time job market trends and insights to make informed career decisions."
    },
    {
      icon: FaChalkboardTeacher,
      title: "Expert Guidance",
      description: "Connect with career experts for advice and mentorship in your desired field."
    },
    {
      icon: FaBriefcase,
      title: "Resume and Interview Preparation",
      description: "Get assistance in crafting an impressive resume and preparing for job interviews effectively."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-6 mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold leading-snug text-center text-gray-800 mb-14 md:text-4xl"
        >
          How <span className="text-transparent text-semibold bg-proj bg-clip-text">PathFinder</span> works
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-lg sm:p-8 rounded-xl hover:shadow-xl"
    >
      <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 rounded-full bg-proj opacity-10"></div>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 text-white rounded-xl bg-proj"
      >
        <feature.icon className="text-2xl" />
      </motion.div>
      <h3 className="mb-3 text-xl font-bold text-gray-800">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
      <motion.div
        className="absolute bottom-0 right-0 w-20 h-20 transform translate-x-6 translate-y-6 rounded-full bg-proj opacity-10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      ></motion.div>
    </motion.div>
  );
};

export default FeatureSection;