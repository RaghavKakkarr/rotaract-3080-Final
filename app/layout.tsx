import './globals.css'; 
// 👇 Navbar aur Footer dono import karne hain
import Navbar from '@/components/Navbar'; // (Path check kar lena agar Navbar folder alag hai)
import Footer from '@/components/Footer'; 

export const metadata = {
  title: 'Rotaract District 3080',
  description: 'Official Portal of Rotaract District 3080',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-black text-white">
        
        {/* 👇 Navbar Wapas Aagaya! */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        
      </body>
    </html>
  );
}