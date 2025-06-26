import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 border-t">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p>&copy; {new Date().getFullYear()} GetButlr. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <Link href="/preferences" className="hover:underline">
            Email Preferences
          </Link>
          <Link href="/unsubscribe" className="hover:underline">
            Unsubscribe
          </Link>
          <a href="https://getbutlr.ai/privacy" className="hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

