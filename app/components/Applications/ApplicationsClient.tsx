'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  createdAt: Date;
  userId: string;
};

type Props = {
  initialApps: Application[];
};

export default function ApplicationsPage({ initialApps }: Props) {
  const [apps, setApps] = useState<Application[]>(initialApps);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // AI MODAL
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SEARCH + FILTER
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchApps = async () => {
    const res = await fetch('/api/applications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
    } else {
      fetchApps();
    }
  }, []);

  const handleSubmit = async () => {
    if (!company || !role) return;

    await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, role, status }),
    });

    setCompany('');
    setRole('');
    setStatus('applied');

    fetchApps();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchApps();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchApps();
  };

  const generateInsight = async (app: any) => {
    setLoadingId(app.id);

    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });

    const data = await res.json();

    setSelectedInsight(data.insight);
    setIsModalOpen(true);

    setLoadingId(null);
  };

  // FILTERED DATA
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ? true : app.status === filter;

    return matchesSearch && matchesFilter;
  });

  // CHART DATA
  const chartData = [
    { name: 'Applied', value: apps.filter(a => a.status === 'applied').length },
    { name: 'Interview', value: apps.filter(a => a.status === 'interview').length },
    { name: 'Rejected', value: apps.filter(a => a.status === 'rejected').length },
  ];

  const exportCSV = () => {
  const headers = ['Company', 'Role', 'Status'];

  const rows = apps.map((a) =>
    [a.company, a.role, a.status].join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'job-applications.csv';
  link.click();

  window.URL.revokeObjectURL(url);
};

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];

  const getStatusColor = (status: string) => {
    if (status === 'applied')
      return 'bg-blue-100 text-blue-700 border border-blue-300';
    if (status === 'interview')
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    if (status === 'rejected')
      return 'bg-red-100 text-red-700 border border-red-300';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Job Applications Dashboard
      </h1>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">📊 Analytics</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-3">

        <input
          className="border p-2 rounded w-full text-black"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="grid md:grid-cols-3 gap-4">

          <input
            className="border p-2 rounded text-black"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="border p-2 rounded text-black"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <select
            className="border p-2 rounded text-black"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Application
        </button>
      </div>

      <button
  onClick={exportCSV}
  className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
>
  📥 Export Applications
</button>   

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
          >
            <p className="text-lg font-semibold">{app.company}</p>
            <p className="text-sm text-gray-600">{app.role}</p>

            <span className={`mt-2 inline-block px-2 py-1 text-xs rounded ${getStatusColor(app.status)}`}>
              {app.status}
            </span>

            <div className="mt-4 flex flex-col gap-3">

              <select
                className="border p-2 rounded text-black"
                value={app.status}
                onChange={(e) =>
                  handleStatusChange(app.id, e.target.value)
                }
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => generateInsight(app)}
                className="bg-purple-600 text-white text-xs px-3 py-1 rounded"
              >
                {loadingId === app.id ? 'Thinking...' : 'AI Insight'}
              </button>

              <button
                onClick={() => handleDelete(app.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* AI MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-6">

            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-600 w-5 h-5" />
                <h2 className="text-lg font-semibold">
                  AI Insight
                </h2>
              </div>

              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {selectedInsight}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}   