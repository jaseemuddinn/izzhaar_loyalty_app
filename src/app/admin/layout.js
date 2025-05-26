import Navbar from "../../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
}