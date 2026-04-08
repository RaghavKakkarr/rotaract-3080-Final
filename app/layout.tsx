import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Hum website ke font ko Inter kar rahe hain jo bahut clean lagta hai
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rotaract District 3080",
  description: "Official Portal for Rotaract District 3080 - Unite for Good",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-950 text-white`}>
        {/* Yahan humne apna Navbar laga diya */}
        <Navbar />
        
        {/* Yeh children wo pages hain jo badalte rahenge (Home, Clubs, etc.) */}
        {children}
      </body>
    </html>
  );
}