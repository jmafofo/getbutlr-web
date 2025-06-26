'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "Butlr transformed how I plan and publish my fishing videos.",
    name: "Joseph M.",
    role: "Content Creator – The Angler's Tales"
  },
  {
    quote: "The SEO insights and script writing tips gave me instant growth.",
    name: "Rami K.",
    role: "Travel Vlogger"
  },
  {
    quote: "I’ve doubled my subscribers thanks to Butlr’s weekly planner.",
    name: "Amina L.",
    role: "Food Blogger"
  }
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  return (
    <div className="bg-white dark:bg-gray-900 text-center py-10 px-6 rounded-lg shadow">
      <blockquote className="text-lg italic text-gray-700 dark:text-gray-100">“{testimonial.quote}”</blockquote>
      <p className="mt-4 font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
    </div>
  );
}

