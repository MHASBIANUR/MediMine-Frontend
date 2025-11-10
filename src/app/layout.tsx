import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediMine",
  description: "Simple Auth Example with Supabase Backend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex justify-center items-center">
        {children}
      </body>
    </html>
  );
}
