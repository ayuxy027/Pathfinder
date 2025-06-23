import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronRight, GraduationCap, Target, Users, Sparkles, MessageSquare, FileText, Map, Brain, Briefcase, Award, Flag, Star, Settings, Heart, Code, Coffee } from 'lucide-react';

// Add CSS animations for infinite scroll
const scrollAnimations = `
  @keyframes scroll-up {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }
  
  @keyframes scroll-down {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  .animate-scroll-up {
    animation: scroll-up 30s linear infinite;
  }
  
  .animate-scroll-down {
    animation: scroll-down 30s linear infinite;
  }
`;

const cardDataLeft = [
  { icon: GraduationCap, title: "Learn", description: "Custom path", color: "#0D9488" },
  { icon: Target, title: "Focus", description: "Clear goals", color: "#0E7490" },
  { icon: Users, title: "Connect", description: "Build network", color: "#0369A1" },
  { icon: Sparkles, title: "Grow", description: "New skills", color: "#0D9488" },
  { icon: MessageSquare, title: "Chat", description: "Get help", color: "#0E7490" },
  { icon: FileText, title: "Create", description: "Pro resume", color: "#0369A1" },
  { icon: Brain, title: "Think", description: "Stay sharp", color: "#0D9488" },
  { icon: Map, title: "Plan", description: "Your future", color: "#0E7490" },
  { icon: Briefcase, title: "Work", description: "Dream job", color: "#0369A1" },
  { icon: Award, title: "Achieve", description: "Excellence", color: "#0D9488" }
];

const cardDataRight = [
  { icon: Flag, title: "Start", description: "Journey begins", color: "#0E7490" },
  { icon: Star, title: "Excel", description: "Stand out", color: "#0D9488" },
  { icon: Settings, title: "Adjust", description: "Fine tune", color: "#0369A1" },
  { icon: Heart, title: "Passion", description: "Love work", color: "#0E7490" },
  { icon: Code, title: "Build", description: "Create value", color: "#0D9488" },
  { icon: Coffee, title: "Balance", description: "Work-life", color: "#0369A1" },
  { icon: Target, title: "Aim", description: "Hit goals", color: "#0E7490" },
  { icon: Brain, title: "Learn", description: "Grow skills", color: "#0D9488" },
  { icon: Users, title: "Team", description: "Collaborate", color: "#0369A1" },
  { icon: Sparkles, title: "Shine", description: "Be best", color: "#0E7490" }
];

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

const MarqueeColumn = React.memo(({ cards, isLeft }) => {
  return (
    <div className="overflow-hidden relative h-full">
      <div
        className={`flex flex-col gap-6 py-6 ${isLeft ? 'animate-scroll-up' : 'animate-scroll-down'}`}
        style={{
          animationDuration: '30s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {/* First set of cards */}
        {cards.map((card, index) => (
          <Card key={`first-${index}-${card.title}`} card={card} index={index} isLeft={isLeft} />
        ))}
        {/* Duplicate set for seamless loop */}
        {cards.map((card, index) => (
          <Card key={`second-${index}-${card.title}`} card={card} index={index} isLeft={isLeft} />
        ))}
      </div>
    </div>
  );
});

const Card = React.memo(({ card, index, isLeft }) => {
  const Icon = card.icon;
  const controls = useAnimation();

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate={controls}
      className="w-full transform-gpu"
    >
      <div
        className={`p-4 transition-all duration-500 bg-white border shadow-lg rounded-xl backdrop-blur-lg border-teal-50
          ${isLeft ? 'translate-x-2' : '-translate-x-2'}`}
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transform: `perspective(1000px) rotateY(${isLeft ? '5deg' : '-5deg'})`,
        }}
      >
        <div className="flex items-center space-x-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${card.color}15`, color: card.color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const HeroSection: React.FC = () => {
  // Inject CSS animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollAnimations;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section className="overflow-hidden relative bg-gradient-to-br from-white to-teal-50">
      <BackgroundEffects />
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 items-center py-12 lg:grid-cols-2">
          <LeftContent />
          {/* Hide carousels on small/medium screens, show only on large screens */}
          <div className="relative hidden lg:grid grid-cols-2 gap-8 h-[700px]">
            <MarqueeColumn
              cards={cardDataLeft}
              isLeft={true}
            />
            <MarqueeColumn
              cards={cardDataRight}
              isLeft={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const BackgroundEffects: React.FC = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bgRef.current.children, {
        scale: 0,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power3.out",
      });
    }, bgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-teal-200/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-teal-200/20 blur-3xl" />
    </div>
  );
}

const LeftContent: React.FC = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power4.out",
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef} className="relative z-10">
      <h1 className="text-4xl font-medium leading-tight lg:text-5xl xl:text-6xl">
        <span className="text-teal-600">Navigate Your Career</span>
        <br />
        <span className="text-amber-400">AI Powered</span>
        <br />
        <span className="text-teal-600">Today!</span>
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
        Discover your perfect career path with AI-powered guidance and personalized recommendations.
      </p>

      <div className="mt-8 sm:mt-10">
        <button className="flex items-center px-8 py-3 text-base font-medium text-white bg-teal-600 rounded-full transition-all transform sm:text-lg hover:bg-teal-700 hover:scale-105 group">
          Get Started
          <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
