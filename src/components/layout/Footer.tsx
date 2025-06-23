import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

interface SocialIcon {
  Icon: React.ComponentType;
  href: string;
  label: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface MeteorProps {
  size: number;
  duration: number;
  delay: number;
}

interface StarProps {
  top: number;
  left: number;
  size: number;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const socialIcons: SocialIcon[] = [
  { Icon: FaFacebookF, href: '#', label: 'Facebook' },
  { Icon: FaTwitter, href: '#', label: 'Twitter' },
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
  { Icon: FaYoutube, href: '#', label: 'YouTube' },
];

const footerLinks: FooterColumn[] = [
  {
    title: 'PathFinder',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Our Approach', href: '#' },
      { label: 'Resources', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Career Paths', href: '#' },
      { label: 'Success Stories', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Webinars', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', href: '#' },
      { label: 'Testimonials', href: '#' },
      { label: 'Volunteer', href: '#' },
      { label: 'Partnerships', href: '#' },
    ],
  },
];

const Meteor: React.FC<MeteorProps> = ({ size, duration, delay }) => (
  <motion.div
    className={`absolute bg-white rounded-full shadow-lg`}
    style={{
      width: size,
      height: size,
      boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255,255,255,0.3)`,
    }}
    initial={{ top: '-5%', left: '105%' }}
    animate={{
      top: '105%',
      left: '-5%',
      transition: { duration, delay, repeat: Infinity, repeatDelay: 4 },
    }}
  />
);

const Star: React.FC<StarProps> = ({ top, left, size }) => (
  <div
    className="absolute bg-white rounded-full animate-pulse"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      opacity: Math.random() * 0.8 + 0.2,
    }}
  />
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <motion.a
    href={href}
    className="inline-block text-base transition-colors duration-300 hover:text-amber-300"
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.a>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative py-16 sm:py-20 overflow-hidden text-white bg-gradient-to-br from-teal-800 to-teal-900">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <Star key={i} top={Math.random() * 100} left={Math.random() * 100} size={Math.random() * 2 + 1} />
        ))}
      </div>
      <Meteor size={2} duration={3} delay={0} />
      <Meteor size={1.5} duration={2.5} delay={1.5} />
      <Meteor size={2.5} duration={3.5} delay={3} />
      
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-12 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((column, index) => (
            <motion.div 
              key={index} 
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl sm:text-2xl font-medium text-amber-400">{column.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-medium text-amber-400">Connect</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="p-3 text-xl sm:text-2xl transition-all duration-300 rounded-full hover:bg-teal-700 hover:text-amber-300 border border-teal-600 hover:border-amber-300"
                  aria-label={label}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          className="pt-6 sm:pt-8 text-center border-t border-teal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-base sm:text-lg text-teal-200">
            &copy; 2024{' '}
            <span className="text-amber-400 font-medium">PathFinder</span>
            . All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
