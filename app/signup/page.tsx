'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-center">
        Create Account
      </h1>

      <input
        className="w-1/2 mx-auto p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-1/2 mx-auto p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="w-1/4 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        Sign Up
      </button>

      {/* CTA */}
      <p className="text-center text-sm mt-4">
        Already have an account?
        <span
          onClick={() => router.push('/login')}
          className="text-blue-600 cursor-pointer ml-1 underline"
        >
          Login
        </span>
      </p>
    </div>
  );
}