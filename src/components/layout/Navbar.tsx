import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Map, TrendingUp, Calendar, GraduationCap } from 'lucide-react';
import { Link, useLocation, Location } from 'react-router-dom';

interface NavItemData {
  name: string;
  link: string;
  icon: React.ReactNode;
}

interface ExternalResource {
  name: string;
  link: string;
  icon: string;
}

const navItems: NavItemData[] = [
  { name: 'Exam Prep', link: '/exam-prep', icon: <GraduationCap size={18} /> },
  { name: 'Roadmap', link: '/roadmap', icon: <Map size={18} /> },
  { name: 'Progress', link: '/progress', icon: <TrendingUp size={18} /> },
  { name: 'Resume', link: '/resume', icon: <Calendar size={18} /> }
];

const externalResources: ExternalResource[] = [
  { name: 'Udemy Course', link: 'https://www.udemy.com/course/100-days-of-code/?couponCode=LEARNNOWPLANS', icon: '↗️' },
  { name: 'Coursera Course', link: 'https://www.coursera.org/learn/algorithms-part1', icon: '↗️' }
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
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

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };



  return (
    <>
      <div className="h-20"></div>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 font-body transition-colors duration-300 ease-in-out 
          ${isScrolled ? 'shadow-lg backdrop-blur-sm bg-teal-700/95' : 'bg-teal-700'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo />
            <DesktopNav location={location} />
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
        <MobileMenu isOpen={isOpen} location={location} />
      </motion.nav>
    </>
  );
};

export default Navbar;

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <motion.a
        href="/"
        className="flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.h1
          className="text-xl font-medium text-white sm:text-2xl lg:text-3xl"
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

interface DesktopNavProps {
  location: Location;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ location }) => {
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
    </div>
  );
}

interface NavItemProps {
  to: string;
  text: string;
  icon: React.ReactNode;
  index: number;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, text, icon, index, isActive }) => {
  return (
    <motion.div
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'text-amber-400 bg-teal-600' : 'text-white hover:text-amber-300 hover:bg-teal-600'
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

// Services dropdown removed

function MobileMenuToggle({ isOpen, toggleMenu }: { isOpen: boolean, toggleMenu: () => void }) {
  return (
    <motion.button
      onClick={toggleMenu}
      type="button"
      className="inline-flex justify-center items-center p-2 ml-4 rounded-md sm:hidden hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="sr-only">Open main menu</span>
      {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
    </motion.button>
  );
}

function MobileMenu({ isOpen, location }: { isOpen: boolean, location: Location }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backdrop-blur-sm sm:hidden bg-teal-700/95"
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

            <div className="pt-4 mt-4 border-t border-teal-600">
              <p className="px-3 text-sm font-medium text-teal-200">External Resources</p>
              {externalResources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-teal-600"
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

function MobileNavItem({ to, text, icon, isActive }: { to: string, text: string, icon: React.ReactNode, isActive: boolean }) {
  return (
    <motion.div
      className="block overflow-hidden rounded-md"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to} className="block">
        <motion.div
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'text-amber-400 bg-teal-600' : 'text-white hover:bg-teal-600'
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