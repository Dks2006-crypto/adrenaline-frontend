// Header.tsx
import Link from 'next/link';
import AuthForm from './AuthForm';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          Adrenaline
        </Link>

        <nav className="flex items-center gap-6">
          <AuthForm />
        </nav>
      </div>
    </header>
  );
}