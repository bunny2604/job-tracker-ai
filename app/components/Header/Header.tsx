'use client';

import { useRouter } from 'next/navigation';

export default function Header({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-xl font-bold">
          Job Tracker
        </h1>

        {/* USER ACTION */}
        {user && (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-200 transition"
            style={{ cursor: 'pointer' }}
          >
            Logout
          </button>
        )}

      </div>
    </header>
  );
}