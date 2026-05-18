import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Camera, Video } from 'lucide-react';

interface FooterLinkData {
  label: string;
  href: string;
}

interface FooterColumnData {
  title: string;
  links: FooterLinkData[];
}

const footerColumns: FooterColumnData[] = [
  {
    title: 'PathFinder',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Approach', href: '/approach' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Career Paths', href: '/roadmap' },
      { label: 'Success Stories', href: '/testimonials' },
      { label: 'Blog', href: '/blog' },
      { label: 'Webinars', href: '/webinars' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', href: '/faq' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Partnerships', href: '/partnerships' },
    ],
  },
];

const socialLinks = [
  { Icon: MessageCircle, href: '/facebook', label: 'Facebook' },
  { Icon: MessageCircle, href: '/twitter', label: 'Twitter' },
  { Icon: Camera, href: '/instagram', label: 'Instagram' },
  { Icon: Video, href: '/youtube', label: 'YouTube' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const stars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: (i * 17 + 3) % 100,
      left: (i * 41 + 7) % 100,
      size: (i * 13) % 2 + 1,
      opacity: ((i * 7) % 80 + 20) / 100,
    }));
  }, []);

  return (
    <footer className="relative py-16 sm:py-20 overflow-hidden text-white bg-gradient-to-br from-teal-800 to-teal-900">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-12 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column, index) => (
            <motion.div
              key={column.title}
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl sm:text-2xl font-medium text-amber-400">{column.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block text-base transition-colors duration-300 hover:text-amber-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-medium text-amber-400">Connect</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="p-3 text-xl sm:text-2xl transition-all duration-300 rounded-full hover:bg-teal-700 hover:text-amber-300 border border-teal-600 hover:border-amber-300"
                  aria-label={label}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="pt-6 sm:pt-8 text-center border-t border-teal-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-base sm:text-lg text-teal-200">
            &copy; {currentYear}{' '}
            <span className="text-amber-400 font-medium">PathFinder</span>
            . All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
