import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, TrendingUp, Users, Briefcase } from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: GraduationCap,
    title: "Personalized Career Assessment",
    description: "Receive tailored career suggestions based on your skills, interests, and personality traits."
  },
  {
    icon: TrendingUp,
    title: "Job Market Insights",
    description: "Access real-time job market trends and insights to make informed career decisions."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Connect with career experts for advice and mentorship in your desired field."
  },
  {
    icon: Briefcase,
    title: "Resume and Interview Preparation",
    description: "Get assistance in crafting an impressive resume and preparing for job interviews effectively."
  }
];

export default function FeatureSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-gradient-to-br from-white to-teal-50 sm:py-20 lg:py-24">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center sm:mb-16 lg:mb-20"
        >
          <h2 className="mb-4 text-3xl font-medium leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
            How{' '}
            <span className="font-medium text-teal-600">PathFinder</span>{' '}
            works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover your perfect career path through our comprehensive approach
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  inView: boolean;
}

function FeatureCard({ feature, index, inView }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="overflow-hidden relative p-6 bg-white rounded-xl shadow-lg transition-all duration-300 sm:p-8 hover:shadow-xl group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full opacity-50 transform translate-x-8 -translate-y-8" aria-hidden="true" />
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="flex relative z-10 justify-center items-center mb-6 w-16 h-16 text-white bg-teal-600 rounded-xl transition-colors duration-300 group-hover:bg-teal-700"
      >
        <Icon className="w-8 h-8" aria-hidden="true" />
      </motion.div>
      <h3 className="mb-3 text-xl font-medium text-gray-800">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
      <motion.div
        className="absolute right-0 bottom-0 w-20 h-20 bg-teal-100 rounded-full opacity-30 transform translate-x-6 translate-y-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
