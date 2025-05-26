import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">Izzhaar Loyalty Program</div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/admin" className="hover:underline">
          Admin Panel
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;