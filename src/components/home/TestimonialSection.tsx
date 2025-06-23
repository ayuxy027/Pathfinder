import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const TestimonialSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      name: "Ravi Kumar",
      role: "Recent Graduate",
      content: "The AI-Enhanced Career Guidance helped me identify my strengths and find the right job opportunities. I felt so supported throughout the process!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=33"
    },
    {
      name: "Anita Singh",
      role: "Career Counselor",
      content: "This platform has transformed the way I advise students. The insights from the AI are invaluable for tailored career advice.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=23"
    },
    {
      name: "Sanjay Desai",
      role: "Job Seeker",
      content: "I found the personalized career assessment incredibly helpful. It guided me toward roles I never considered before!",
      rating: 4,
      image: "https://i.pravatar.cc/150?img=41"
    },
    {
      name: "Priya Mehta",
      role: "HR Manager",
      content: "The platform provides great visibility into potential candidates. The AI recommendations are spot on for our needs.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=53"
    },
    {
      name: "Rahul Verma",
      role: "Intern",
      content: "I loved the resume-building feature! It helped me create a professional resume that got me noticed by recruiters.",
      rating: 4,
      image: "https://i.pravatar.cc/150?img=44"
    },
    {
      name: "Neha Joshi",
      role: "Graduate Student",
      content: "The virtual career fairs were a game changer for me. I connected with companies directly and landed multiple interviews!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=63"
    },
    {
      name: "Arjun Nair",
      role: "Career Development Coach",
      content: "This tool is a must-have for anyone looking to enhance their career. The features are intuitive and highly effective.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=68"
    }
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white mb-4">
            What Our{' '}
            <span className="text-amber-400 font-medium">Users</span>{' '}
            Say
          </h2>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Real stories from professionals who transformed their careers
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 sm:gap-12">
          <TestimonialRow testimonials={testimonials.slice(0, 4)} direction="left" />
          <TestimonialRow testimonials={testimonials.slice(4)} direction="right" />
        </div>
      </div>
    </section>
  );
};

const TestimonialRow = ({ testimonials, direction }) => {
  return (
    <motion.div
      className="flex gap-6 sm:gap-8"
      initial={{ x: direction === 'left' ? 0 : -960 }}
      animate={{ x: direction === 'left' ? [-960, -1920] : [0, -960] }}
      transition={{
        x: {
          repeat: Infinity,
          duration: 30,
          ease: "linear",
          repeatType: "loop"
        },
        opacity: { duration: 0.8 }
      }}
    >
      {testimonials.concat(testimonials, testimonials).map((testimonial, index) => (
        <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
      ))}
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative flex-shrink-0 p-6 overflow-hidden bg-white rounded-xl shadow-lg w-80 sm:w-96 group"
    >
      <div className="absolute top-0 left-0 w-20 h-20 -translate-x-10 -translate-y-10 bg-teal-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 translate-x-10 translate-y-10 bg-amber-100 rounded-full opacity-30"></div>

      <FaQuoteLeft className="mb-4 text-3xl text-teal-600" />
      <p className="mb-6 text-sm leading-relaxed text-gray-700 italic">{testimonial.content}</p>

      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="object-cover w-12 h-12 rounded-full ring-2 ring-teal-100"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
          <p className="text-xs text-gray-600">{testimonial.role}</p>
        </div>
      </div>

      <div className="flex mt-3">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialSection;
