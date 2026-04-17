'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required (example: user@gmail.com)';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format (example: user@gmail.com)';
    }

    if (!password) {
      newErrors.password = 'Password is required (min 6 chars)';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      setErrors({ general: 'Signup failed. Try again.' });
    }
  };

  return (
    <div className="flex items-center justify-center px-4">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8"
      >

        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Create Account
        </h1>

        {errors.general && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {errors.general}
          </p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-bold text-gray-700">
            Email:
          </label>

          <input
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="user@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-bold text-gray-700">
            Password:
          </label>

          <input
            type="password"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-5">
          Already have an account?
          <span
            onClick={() => router.push('/login')}
            className="text-blue-600 cursor-pointer ml-1 underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}