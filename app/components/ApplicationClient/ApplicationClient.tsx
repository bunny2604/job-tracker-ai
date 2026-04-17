'use client';

import { useState } from 'react';
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
  createdAt: string;
  userId: string;
};

type Props = {
  initialApps: Application[];
};

export default function ApplicationsClient({ initialApps }: Props) {
  const [apps, setApps] = useState<Application[]>(initialApps);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const hasApps = apps.length > 0;

  // ---------------- FILTER ----------------
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ? true : app.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ---------------- CHART ----------------
  const chartData = [
    { name: 'Applied', value: apps.filter(a => a.status === 'applied').length },
    { name: 'Interview', value: apps.filter(a => a.status === 'interview').length },
    { name: 'Rejected', value: apps.filter(a => a.status === 'rejected').length },
  ];

  const COLORS = ['#3b82f6', '#6366f1', '#ef4444']; // blue + indigo + red

  // ---------------- CREATE ----------------
  const handleSubmit = async () => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, role, status }),
    });

    if (res.ok) {
      const newApp = await res.json();
      setApps((prev) => [newApp, ...prev]);
      setCompany('');
      setRole('');
      setStatus('applied');
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
    });

    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  // ---------------- UPDATE ----------------
  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    setApps((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );
  };

  // ---------------- AI ----------------
  const generateInsight = async (app: Application) => {
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

  // ---------------- EXPORT ----------------
  const exportCSV = () => {
    const headers = ['Company', 'Role', 'Status'];
    const rows = apps.map((a) =>
      [a.company, a.role, a.status].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    if (status === 'applied')
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (status === 'interview')
      return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    if (status === 'rejected')
      return 'bg-red-100 text-red-700 border border-red-200';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        Job Applications Dashboard
      </h1>

      {/* CHART */}
      {hasApps && (
        <div className="bg-blue-50 p-6 rounded-xl shadow mb-6 border border-blue-100">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="bg-blue-50 p-4 rounded-xl shadow mb-6 flex gap-3 border border-blue-100">
        <input
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />

        <select
          className="border p-2 rounded"
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
      {/* FORM */}
<div className="bg-blue-50 p-6 rounded-xl shadow mb-10 border border-blue-100">
  <div className="grid md:grid-cols-3 gap-6">

    {/* COMPANY */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-blue-900">
        Company
      </label>
      <input
        className="border p-2 rounded"
        placeholder="Enter company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
    </div>

    {/* ROLE */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-blue-900">
        Role
      </label>
      <input
        className="border p-2 rounded"
        placeholder="Enter job role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
    </div>

    {/* STATUS */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-blue-900">
        Status
      </label>
      <select
        className="border p-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

  </div>

  <button
    onClick={handleSubmit}
    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    Add Application
  </button>
</div>

      {/* EXPORT */}
      <button
        onClick={exportCSV}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export CSV
      </button>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-blue-50 p-5 rounded-xl shadow border border-blue-100 hover:shadow-lg transition"
          >
            <p className="font-semibold text-blue-900">{app.company}</p>
            <p className="text-sm text-gray-600">{app.role}</p>

            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}>
              {app.status}
            </span>

            <div className="mt-3 flex flex-col gap-2">

              <select
                className="border p-2 rounded"
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
                className="bg-indigo-600 text-white text-xs px-3 py-1 rounded"
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="bg-white p-6 rounded-xl z-50 w-[400px]">
            <div className="flex justify-between">
              <h2 className="font-bold text-blue-700">AI Insight</h2>
              <X onClick={() => setIsModalOpen(false)} />
            </div>

            <p className="mt-4 text-sm whitespace-pre-line">
              {selectedInsight}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}