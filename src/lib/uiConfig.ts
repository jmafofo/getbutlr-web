export const defaultTheme = {
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
    },
    dark: {
      background: 'bg-black',
      text: 'text-gray-100',
    },
  };
  
  export const animationVariants = {
    fadeInUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 },
    },
    entrance: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 },
    },
  };
  