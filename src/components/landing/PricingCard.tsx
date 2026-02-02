import { motion } from 'framer-motion';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  variant?: 'default' | 'pro' | 'team';
  delay?: number;
}

export function PricingCard({ 
  title, 
  description, 
  features, 
  ctaText, 
  ctaLink, 
  variant = 'default',
  delay = 0 
}: PricingCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isPro = variant === 'pro';

  // Color config based on variant
  const colors = {
    default: {
      title: 'text-white',
      check: 'text-cyan',
      cta: 'border border-white/20 hover:bg-white hover:text-navy',
      border: 'border-white/10 hover:border-white/30',
      bg: 'bg-white/5'
    },
    pro: {
      title: 'text-cyan',
      check: 'text-cyan',
      cta: 'bg-cyan text-navy hover:bg-white',
      border: 'border-cyan',
      bg: 'bg-navy'
    },
    team: {
      title: 'text-amber',
      check: 'text-amber',
      cta: 'border border-white/20 hover:bg-amber hover:text-navy hover:border-amber',
      border: 'border-white/10 hover:border-white/30',
      bg: 'bg-white/5'
    }
  };

  const theme = colors[variant];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      whileHover={shouldReduceMotion ? {} : { 
        y: isPro ? -8 : -8, 
        scale: isPro ? 1.02 : 1,
        boxShadow: isPro ? "0 25px 50px -12px rgba(46, 230, 214, 0.3)" : "none",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`
        relative flex flex-col p-8 rounded-2xl transition-colors duration-300
        border ${theme.border} ${theme.bg}
        ${isPro ? 'border-2 shadow-2xl shadow-cyan/10 md:-mt-4 z-10' : ''}
      `}
    >
      {isPro && (
        <div className="absolute top-0 right-0 bg-cyan text-navy text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          RECOMMENDED
        </div>
      )}

      <div className="mb-4">
        <motion.h3 
          className={`text-2xl font-bold ${theme.title}`}
          whileHover={{ scale: 1.05, originX: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            variants={itemVariants}
            className={`flex items-center gap-2 ${isPro ? 'text-white' : 'text-gray-300'}`}
          >
            <span className={theme.check}>✓</span> {feature}
          </motion.li>
        ))}
      </ul>

      <Link 
        href={ctaLink} 
        className={`
          block w-full py-3 rounded-lg text-center font-bold transition-all
          ${theme.cta}
        `}
      >
        {ctaText}
      </Link>
    </motion.div>
  );
}
