'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/auth', { method: 'DELETE' });
    setLoading(false);
    router.push('/admin/login');
  };

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-800 text-white gap-2 sm:gap-0">
      <div className="text-lg font-bold mb-2 sm:mb-0">Izzhaar Loyalty Program</div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <Link href="/" className="hover:underline w-full sm:w-auto text-center">
          Home
        </Link>
        {pathname === '/admin' ? (
          <button
            onClick={handleLogout}
            className="hover:underline bg-red-600 px-3 py-1 rounded disabled:opacity-50 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <Link href="/admin" className="hover:underline w-full sm:w-auto text-center">
            Admin Panel
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;