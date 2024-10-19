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
    <section ref={ref} className="py-20 bg-gray-50"> {/* Increased vertical padding */}
      <div className="container px-6 mx-auto space-y-16"> {/* Added spacing between sections */}
        
        {/* Heading with additional bottom margin */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold leading-snug text-center text-gray-800 mb-14 md:text-4xl"
        >
          Folks who use <span className="text-transparent text-semibold bg-proj bg-clip-text">PathFinder</span> get hired at
        </motion.h2>

        {/* Grid of Logos with increased spacing */}
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
          className="grid items-center grid-cols-2 gap-10 md:grid-cols-5 md:gap-12" // Increased gaps between grid items
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
              className="flex items-center justify-center p-4" // Added padding inside each grid item
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="max-w-[100px] md:max-w-[120px] h-auto opacity-70 transition-opacity duration-300 hover:opacity-100"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
