'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // IMPORTANT for cookies
    });

    if (res.ok) {
      router.push('/applications'); // ✅ ALWAYS WORKS NOW
      router.refresh(); // ensures SSR revalidation
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-center">
        Login to Job Tracker
      </h1>

      <input
        className="w-1/2 mx-auto p-3 border rounded-lg bg-white text-gray-900"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-1/2 mx-auto p-3 border rounded-lg bg-white text-gray-900"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-1/4 mx-auto bg-blue-600 text-white py-2 rounded-lg"
      >
        Login
      </button>

      <p className="text-center text-sm mt-4">
        Don’t have an account?
        <span
          onClick={() => router.push('/signup')}
          className="text-blue-600 cursor-pointer ml-1 underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}