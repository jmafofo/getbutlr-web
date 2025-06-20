// components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="w-full text-gray-400 bg-slate-900 text-sm py-4 px-6 flex justify-between items-center">
      <span>© {new Date().getFullYear()} GetButlr. All rights reserved.</span>
    </footer>
  );
}
