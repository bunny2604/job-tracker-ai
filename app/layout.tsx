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
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden">

        <div className="shrink-0">
          <Header user={user} />
        </div>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {children}
        </main>

        <div className="shrink-0">
          <Footer />
        </div>

      </body>
    </html>
  );
}