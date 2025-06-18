'use client';
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>GetButlr</h2>
      <ul>
        {['Dashboard','SEO','Thumbnail','A/B Test','Settings'].map((item) => (
          <li key={item}>📌 {item}</li>
        ))}
      </ul>
    </aside>
  );
}

