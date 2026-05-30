import type { Variants } from 'framer-motion';

const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Fog dissipating — for hero name, main headings
export const fogReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.4,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Stagger container — wraps children with fogReveal
export const fogRevealStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

// Fast fog — for subtitles, secondary paragraphs
export const fogRevealFast: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Unfurl / clip-path — for bio paragraphs, chapter cards
// Used with useInView for scroll trigger
export const unfurlReveal: Variants = {
  hidden: {
    clipPath: 'inset(0 0 100% 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: {
      duration: 1.0,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Organic growth — for tech cards, list items
export const growIn: Variants = {
  hidden: {
    scale: 0.94,
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: EASE_OUT_STRONG,
    },
  },
};

// Stagger for card lists (TechCard, chapters)
export const growInStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};
