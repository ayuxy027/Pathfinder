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
    <section ref={ref} className="py-20 overflow-hidden bg-proj">
      <div className="container px-6 mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold leading-snug text-center text-white mb-14 md:text-4xl"
        >
          What Our <span className="text-transparent bg-white text-semibold bg-clip-text">Users</span> Say
        </motion.h2>
        <div className="flex flex-col gap-12">
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
      className="flex gap-8"
      animate={{ x: direction === 'left' ? [0, -1920] : [-1920, 0] }}
      transition={{
        x: { repeat: Infinity, duration: 60, ease: "linear" },
        opacity: { duration: 0.8 }
      }}
    >
      {testimonials.concat(testimonials).map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      className="relative flex-shrink-0 p-6 overflow-hidden bg-white rounded-lg shadow-lg w-96"
    >
      <div className="absolute top-0 left-0 w-20 h-20 -translate-x-10 -translate-y-10 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 translate-x-10 translate-y-10 bg-blue-200 rounded-full opacity-20"></div>
      <FaQuoteLeft className="mb-4 text-3xl text-teal-600" />
      <p className="mb-4 text-sm italic text-gray-700">{testimonial.content}</p>
      <div className="flex items-center gap-4">
        <img src={testimonial.image} alt={testimonial.name} className="object-cover w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-semibold text-teal-600">{testimonial.name}</h3>
          <p className="text-xs text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex mt-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialSection;