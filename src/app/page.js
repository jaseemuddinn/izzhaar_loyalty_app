export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Izzhaar Loyalty Program</h1>
        <p className="text-lg mb-8">Join us to earn rewards and enjoy exclusive benefits!</p>
        
        <div className="flex gap-4 mt-8">

          <a
            className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center hover:bg-gray-200 hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/admin"
          >
            Admin Panel
          </a>
        </div>
      </main>
      <footer className="flex justify-center p-4 bg-gray-800 text-white">
        <p>&copy; {new Date().getFullYear()} Izzhaar Loyalty Program. All rights reserved.</p>
      </footer>
    </div>
  );
}