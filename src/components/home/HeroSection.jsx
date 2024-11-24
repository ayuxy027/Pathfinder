import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronRight, GraduationCap, Target, Users, Sparkles, MessageSquare, FileText, Map, Brain, Briefcase, Award, Flag, Star, Settings, Heart, Code, Coffee } from 'lucide-react';

const dynamicWords = ["AI-Powered", "Personalized", "Future-Ready"];

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

const MarqueeColumn = React.memo(({ cards, isLeft, containerRef }) => {
  const scrollerRef = useRef(null);
  const sentinel = useRef(null);

  useEffect(() => {
    if (!scrollerRef.current || !sentinel.current) return;

    const scroller = scrollerRef.current;
    const scrollHeight = scroller.offsetHeight;
    const container = containerRef.current;

    const resetPosition = () => {
      if (!container) return;
      const scrollTop = container.scrollTop;
      const maxScroll = scrollHeight / 2;
      
      if (scrollTop >= maxScroll) {
        container.scrollTop = 0;
      } else if (scrollTop <= 0) {
        container.scrollTop = maxScroll;
      }
    };

    // Initial scroll position
    container.scrollTop = scrollHeight / 4;

    const animate = () => {
      if (!container) return;
      container.scrollTop += isLeft ? 1 : -1;
      resetPosition();
      requestRef.current = requestAnimationFrame(animate);
    };

    const requestRef = { current: requestAnimationFrame(animate) };

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isLeft, containerRef]);

  return (
    <div ref={scrollerRef} className="flex flex-col gap-6 py-6">
      {[...cards, ...cards, ...cards].map((card, index) => (
        <Card key={`${index}-${card.title}`} card={card} index={index % cards.length} isLeft={isLeft} />
      ))}
      <div ref={sentinel} className="h-px" />
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
            <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function HeroSection() {
  const [dynamicText, setDynamicText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  useEffect(() => {
    const typeWriter = () => {
      const currentWord = dynamicWords[wordIndex];
      const shouldDelete = isDeleting && dynamicText === '';
      const shouldChangeWord = !isDeleting && dynamicText === currentWord;

      if (shouldDelete) {
        setIsDeleting(false);
        setWordIndex((prevIndex) => (prevIndex + 1) % dynamicWords.length);
      } else if (shouldChangeWord) {
        setIsDeleting(true);
      } else {
        setDynamicText(prevText =>
          isDeleting ? currentWord.slice(0, prevText.length - 1) : currentWord.slice(0, prevText.length + 1)
        );
      }
    };

    const timer = setTimeout(typeWriter, isDeleting ? 100 : 150);
    return () => clearTimeout(timer);
  }, [dynamicText, isDeleting, wordIndex]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-teal-50">
      <BackgroundEffects />
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 py-12 md:grid-cols-2">
          <LeftContent dynamicText={dynamicText} />
          <div className="relative grid grid-cols-2 gap-8 h-[700px]">
            <div ref={leftColumnRef} className="relative h-full overflow-hidden">
              <MarqueeColumn 
                cards={cardDataLeft} 
                isLeft={true}
                containerRef={leftColumnRef}
              />
            </div>
            <div ref={rightColumnRef} className="relative h-full overflow-hidden">
              <MarqueeColumn 
                cards={cardDataRight} 
                isLeft={false}
                containerRef={rightColumnRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundEffects() {
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

function LeftContent({ dynamicText }) {
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
      <h1 className="text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">
        <span className="text-teal-600">Navigate Your Career</span>
        <br />
        <span className="text-amber-400">
          {dynamicText}
          <span className="animate-blink">|</span>
        </span>
        <br />
        <span className="text-teal-600">Today!</span>
      </h1>
      
      <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
        Discover your perfect career path with AI-powered guidance and personalized recommendations.
      </p>

      <div className="mt-8 sm:mt-10">
        <button className="flex items-center px-8 py-3 text-base font-semibold text-white transition-all transform bg-teal-600 rounded-full sm:text-lg hover:bg-teal-700 hover:scale-105 group">
          Get Started
          <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default HeroSection;