'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} GetButlr. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/preferences" className="footer-link">
            Email Preferences
          </Link>
          <Link href="/unsubscribe" className="footer-link">
            Unsubscribe
          </Link>
          <a
            href="https://getbutlr.ai/privacy"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
