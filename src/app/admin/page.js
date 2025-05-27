import AdminPanel from "../../components/AdminPanel";
import { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  return (
    <div className="p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4 px-2 sm:px-4">Admin Panel</h1>
      <AdminPanel />
    </div>
  );
}