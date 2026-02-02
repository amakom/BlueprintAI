'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

interface SlideInProps extends ScrollAnimationProps {
  direction?: 'left' | 'right'
}

export function FadeUp({ children, className = '', delay = 0, duration = 0.5 }: ScrollAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const // Smooth easing
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, className = '', direction = 'left', delay = 0, duration = 0.5 }: SlideInProps) {
  const shouldReduceMotion = useReducedMotion()
  const xOffset = direction === 'left' ? -50 : 50

  const variants = {
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : xOffset 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className = '', delay = 0, duration = 0.4 }: ScrollAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: { children: ReactNode, className?: string, staggerDelay?: number }) {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    }
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
