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
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/applications');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-center">
        Login to Job Tracker
      </h1>

      <input
        className="border p-2 rounded text-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded text-black"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Login
      </button>

      {/* CTA */}
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