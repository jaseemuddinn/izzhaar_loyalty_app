import Navbar from '../components/Navbar';
import '../styles/globals.css';

export const metadata = {
  title: 'Izzhaar Loyalty Program',
  description: 'A retail loyalty program for Izzhaar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="text-center p-4">
          © {new Date().getFullYear()} Izzhaar. All rights reserved.
        </footer>
      </body>
    </html>
  );
}