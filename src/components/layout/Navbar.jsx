import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LogIn, Settings, HelpCircle, Bell, Calendar, Briefcase, TrendingUp, Link as LinkIcon, Map, FileQuestion, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const navItems = [
  { name: 'Home', link: '/', icon: <User size={18} /> },
  { name: 'Build Your Resume', link: '/resume', icon: <Calendar size={18} /> },
  { name: 'Roadmap Generation', link: '/roadmap', icon: <Map size={18} /> },
  { name: 'My Progress', link: '/progress', icon: <TrendingUp size={18} /> },
];

const serviceItems = [
  { name: 'Take A Quiz', link: '/quiz', icon: <FileQuestion size={18} /> },
];

const externalResources = [
  { name: 'Udemy Course', link: 'https://www.udemy.com/course/100-days-of-code/?couponCode=LEARNNOWPLANS', icon: '↗️' },
  { name: 'Coursera Course', link: 'https://www.coursera.org/learn/algorithms-part1', icon: '↗️' }
];

// Dummy data for user stats
const userStats = {
  completedCourses: 12,
  ongoingCourses: 3,
  achievements: 8,
  nextMilestone: 'Advanced Level'
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserCard, setShowUserCard] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const location = useLocation();
  const { loginWithRedirect, logout, user, isLoading, isAuthenticated } = useAuth0();

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

  const toggleUserCard = () => {
    setShowUserCard(!showUserCard);
  };

  const toggleServicesDropdown = () => {
    setShowServicesDropdown(!showServicesDropdown);
  };

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setShowUserCard(false);
  };

  return (
    <>
      <div className="h-20"></div>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 font-body transition-colors duration-300 ease-in-out 
          ${isScrolled ? 'bg-teal-800/90 backdrop-blur-sm shadow-md' : 'bg-teal-700'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <DesktopNav location={location} showServicesDropdown={showServicesDropdown} toggleServicesDropdown={toggleServicesDropdown} />
            <div className="flex items-center space-x-2 sm:space-x-4">
              <AuthButton
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                toggleUserCard={toggleUserCard}
              />
              <MobileMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
        <MobileMenu isOpen={isOpen} location={location} />
      </motion.nav>
      <AnimatePresence>
        {showUserCard && (
          <UserCard user={user} userStats={userStats} onClose={toggleUserCard} onLogout={handleLogout} />
        )}
      </AnimatePresence>
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
            className="absolute right-0 w-64 mt-2 bg-white rounded-md shadow-lg"
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
      className="inline-flex items-center justify-center p-2 ml-4 rounded-md sm:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
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
          className="sm:hidden bg-teal-800/95 backdrop-blur-sm"
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

function AuthButton({ isLoading, isAuthenticated, user, onLogin, onLogout, toggleUserCard }) {
  if (isLoading) {
    return (
      <motion.div
        className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-md bg-white/10"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
        <span>Loading...</span>
      </motion.div>
    );
  }

  if (isAuthenticated) {
    return (
      <motion.div
        className="relative"
        initial={false}
        animate={{ scale: [0.9, 1], opacity: [0, 1] }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={toggleUserCard}
          className="flex items-center space-x-2 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 border-2 border-yellow-400 rounded-full"
            whileHover={{ borderColor: "#ffffff" }}
          />
          <motion.span 
            className="hidden text-base font-medium text-white sm:inline-block"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {user.name}
          </motion.span>
        </motion.button>
      
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onLogin}
      className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-blue-900 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
      whileTap={{ scale: 0.95 }}
    >
      <LogIn className="w-4 h-4" />
      <span>Join Now</span>
    </motion.button>
  );
}

function UserCard({ user, userStats, onClose, onLogout }) {
  return (
    <motion.div
      className="fixed z-50 overflow-hidden bg-white rounded-lg shadow-xl top-20 right-4 w-80"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6 text-white bg-teal-700">
        <div className="flex items-center space-x-4">
          <img src={user.picture} alt={user.name} className="w-16 h-16 border-2 border-white rounded-full" />
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm opacity-75">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div>
            <p className="text-2xl font-bold">{userStats.completedCourses}</p>
            <p className="text-xs opacity-75">Completed Courses</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{userStats.ongoingCourses}</p>
            <p className="text-xs opacity-75">Ongoing Courses</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-2 text-sm text-gray-600">Your Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="mb-4 text-sm text-gray-600">Next milestone: {userStats.nextMilestone}</p>
        <UserCardButton icon={<User size={18} />} text="Profile" />
        <UserCardButton icon={<Settings size={18} />} text="Settings" />
        <UserCardButton icon={<Bell size={18} />} text="Notifications" />
        <UserCardButton icon={<HelpCircle size={18} />} text="Help" />
        <UserCardButton icon={<LogOut size={18} />} text="Logout" onClick={onLogout} />
      </div>
    </motion.div>
  );
}

function UserCardButton({ icon, text, onClick }) {
  return (
    <motion.button
      className="flex items-center w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
      onClick={onClick}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="ml-2 text-sm">{text}</span>
    </motion.button>
  );
}