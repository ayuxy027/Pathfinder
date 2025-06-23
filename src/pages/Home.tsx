import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeatureSection from '../components/home/FeatureSection';
import TestimonialSection from '../components/home/TestimonialSection';
import CTASection from '../components/home/CTASection';
import ChatSection from '../chatbot/ChatBot';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-900 bg-white">
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <TestimonialSection />
      <CTASection />
      <ChatSection />
    </div>
  );
};

export default Home;