'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [form, setForm] = useState({ applicationId: '', dob: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://admission-preferences.onrender.com/api/student/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/preferences?appId=${form.applicationId}&dob=${encodeURIComponent(form.dob)}`);
    } else {
      setError(data.message);
    }
  };

  const handleReset = () => {
    setForm({ applicationId: '', dob: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f0f0f8] flex flex-col">
      {/* Full-width Header */}
      <div className="w-full">
        <img src="/header.png" alt="JUET Header" className="w-full object-cover" />
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="flex flex-col flex-grow items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-2xl border border-orange-500 border-t-[3px] border-b-[20px] bg-white p-10 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#333]">
              Branch Preference Form
            </h2>
            <img src="/logo.jpeg" alt="JUET Logo" className="h-20 w-auto ml-4" />
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="mb-6">
            <label className="block font-bold text-gray-700 mb-1">
              Jaypee Application ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Application ID"
              value={form.applicationId}
              onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none text-black"
            />
            <p className="text-xs text-gray-500 mt-1">Format: JEG250000</p>
          </div>

          <div className="mb-6">
            <label className="block font-bold text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none text-black"
            />
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-sm font-medium"
            >
              Submit
            </button>
            <button
              type="reset"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="text-center mt-auto pb-6 text-sm text-gray-700">
        <p>
          For comments or suggestions, email at{' '}
          <a href="mailto:admission@juet.ac.in" className="text-blue-600 underline">
            admission@juet.ac.in
          </a>
        </p>
        <p className="mt-1">Toll Free No.: 1800 121 884444</p>
      </footer>
    </div>
  );
}
