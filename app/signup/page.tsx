'use client';

import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);

    alert('User created! Now login.');
    window.location.href = '/login';
  };

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h1 className="text-xl font-bold">Signup</h1>

      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup} className="bg-black text-white p-2">
        Signup
      </button>
    </div>
  );
}