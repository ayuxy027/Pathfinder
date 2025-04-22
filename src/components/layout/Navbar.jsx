import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, ChevronDown, Map, TrendingUp, Calendar, FileQuestion } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Roadmap Generation', link: '/roadmap', icon: <Map size={18} /> },
  { name: 'My Progress', link: '/progress', icon: <TrendingUp size={18} /> },
  { name: 'Build Your Resume', link: '/resume', icon: <Calendar size={18} /> }
];

const serviceItems = [
  { name: 'Take A Quiz', link: '/quiz', icon: <FileQuestion size={18} /> },
];

const externalResources = [
  { name: 'Udemy Course', link: 'https://www.udemy.com/course/100-days-of-code/?couponCode=LEARNNOWPLANS', icon: '↗️' },
  { name: 'Coursera Course', link: 'https://www.coursera.org/learn/algorithms-part1', icon: '↗️' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleServicesDropdown = () => {
    setShowServicesDropdown(!showServicesDropdown);
  };

  return (
    <>
      <div className="h-20"></div>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 font-body transition-colors duration-300 ease-in-out 
          ${isScrolled ? 'shadow-md backdrop-blur-sm bg-teal-800/90' : 'bg-teal-700'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo />
            <DesktopNav location={location} showServicesDropdown={showServicesDropdown} toggleServicesDropdown={toggleServicesDropdown} />
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
        <MobileMenu isOpen={isOpen} location={location} />
      </motion.nav>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center">
      <motion.a
        href="/"
        className="flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.h1 
          className="text-xl font-bold text-white sm:text-2xl lg:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          PathFinder
        </motion.h1>
      </motion.a>
    </div>
  );
}

function DesktopNav({ location, showServicesDropdown, toggleServicesDropdown }) {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
      {navItems.map((item, index) => (
        <NavItem 
          key={item.name} 
          to={item.link} 
          text={item.name} 
          icon={item.icon}
          index={index}
          isActive={location.pathname === item.link}
        />
      ))}
      <ServicesDropdown 
        showServicesDropdown={showServicesDropdown} 
        toggleServicesDropdown={toggleServicesDropdown}
        location={location}
      />
    </div>
  );
}

function NavItem({ to, text, icon, index, isActive }) {
  return (
    <motion.div
      className={`px-3 py-2 text-sm font-medium rounded-md ${
        isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Link to={to} className="flex items-center space-x-2">
        {icon}
        <span>{text}</span>
      </Link>
    </motion.div>
  );
}

function ServicesDropdown({ showServicesDropdown, toggleServicesDropdown, location }) {
  return (
    <div className="relative group">
      <motion.button
        className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md hover:text-yellow-300"
        onClick={toggleServicesDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Briefcase size={18} />
        <span className="ml-2">Services</span>
        <ChevronDown size={14} className="ml-1" />
      </motion.button>
      <AnimatePresence>
        {showServicesDropdown && (
          <motion.div
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {serviceItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={`flex items-center px-4 py-2 text-sm ${
                  location.pathname === item.link ? 'text-teal-600 bg-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            <div className="px-4 py-2 text-sm font-medium text-gray-700">External Resources</div>
            {externalResources.map((resource) => (
              <a
                key={resource.name}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600"
              >
                <span className="mr-2">{resource.icon}</span>
                {resource.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenuToggle({ isOpen, toggleMenu }) {
  return (
    <motion.button
      onClick={toggleMenu}
      type="button"
      className="inline-flex justify-center items-center p-2 ml-4 rounded-md sm:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="sr-only">Open main menu</span>
      {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
    </motion.button>
  );
}

function MobileMenu({ isOpen, location }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backdrop-blur-sm sm:hidden bg-teal-800/95"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <MobileNavItem 
                key={item.name} 
                to={item.link} 
                text={item.name}
                icon={item.icon}
                isActive={location.pathname === item.link}
              />
            ))}
            {serviceItems.map((item) => (
              <MobileNavItem 
                key={item.name} 
                to={item.link} 
                text={item.name}
                icon={item.icon}
                isActive={location.pathname === item.link}
              />
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="px-3 text-sm font-medium text-white">External Resources</p>
              {externalResources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/10"
                >
                  <span className="mr-2">{resource.icon}</span>
                  {resource.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavItem({ to, text, icon, isActive }) {
  return (
    <motion.div
      className="block overflow-hidden rounded-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={to} className="block">
        <motion.div 
          className={`px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
            isActive ? 'text-yellow-600 bg-blue-200' : 'text-white hover:bg-blue-200'
          }`}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span>{text}</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}