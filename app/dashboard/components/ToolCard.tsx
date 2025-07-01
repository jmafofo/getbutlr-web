'use client';

import Link from 'next/link';

type ToolCardProps = {
  title: string;
  icon: string;
  description: string;
  href: string;
};

export default function ToolCard({ title, icon, description, href }: ToolCardProps) {
  return (
    <Link href={href} className="tool-card">
      <div className="tool-icon">{icon}</div>
      <div>
        <h3 className="tool-name">{title}</h3>
        <p className="tool-description">{description}</p>
      </div>
    </Link>
  );
}

