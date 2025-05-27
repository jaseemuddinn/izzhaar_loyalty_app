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
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">Izzhaar Loyalty Program</div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {pathname === '/admin' ? (
          <button
            onClick={handleLogout}
            className="hover:underline bg-red-600 px-3 py-1 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <Link href="/admin" className="hover:underline">
            Admin Panel
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;