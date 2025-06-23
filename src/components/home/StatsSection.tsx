import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import company1 from '../../../images/company1.svg';
import company2 from '../../../images/company2.svg';
import company3 from '../../../images/company3.svg';
import company4 from '../../../images/company4.svg';
import company5 from '../../../images/company5.svg';
import company6 from '../../../images/company6.svg';
import company7 from '../../../images/company7.png';
import company8 from '../../../images/company8.png';
import company9 from '../../../images/company9.png';
import company10 from '../../../images/company10.svg';

const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyLogos = [
    { name: 'Company 1', src: company1 },
    { name: 'Company 2', src: company2 },
    { name: 'Company 3', src: company3 },
    { name: 'Company 4', src: company4 },
    { name: 'Company 5', src: company5 },
    { name: 'Company 6', src: company6 },
    { name: 'Company 7', src: company7 },
    { name: 'Company 8', src: company8 },
    { name: 'Company 9', src: company9 },
    { name: 'Company 10', src: company10 },
  ];

  return (
    <section ref={ref} className="py-16 bg-gradient-to-br from-teal-50 to-white sm:py-20 lg:py-24">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center sm:mb-16 lg:mb-20"
        >
          <h2 className="mb-4 text-3xl font-medium leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
            Folks who use{' '}
            <span className="font-medium text-teal-600">PathFinder</span>{' '}
            get hired at
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join thousands of professionals who found their dream careers
          </p>
        </motion.div>

        {/* Grid of Logos */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12"
        >
          {companyLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                  },
                },
              }}
              className="flex justify-center items-center p-4 group"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] h-auto opacity-60 transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 filter grayscale hover:grayscale-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
