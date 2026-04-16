'use client';

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/applications';
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h1 className="text-xl font-bold">Login</h1>

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

      <button onClick={handleLogin} className="bg-black text-white p-2">
        Login
      </button>
    </div>
  );
}