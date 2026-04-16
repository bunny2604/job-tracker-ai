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
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold">Job Tracker</h1>

        {/* 🔥 INSTANT CORRECT STATE (NO FLICKER) */}
        {user && (
          <button
            onClick={handleLogout}
            className="text-red-500"
            style={{cursor: 'pointer'}}
          >
            Logout
          </button>
        )}

      </div>
    </header>
  );
}