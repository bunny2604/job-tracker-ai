import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track your job applications efficiently",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;
  const user = getUserFromToken(token);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">

        {/* HEADER */}
        <Header user={user} />

        {/* MAIN */}
        <main className="flex-grow px-4 md:px-6 py-6">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </body>
    </html>
  );
} 