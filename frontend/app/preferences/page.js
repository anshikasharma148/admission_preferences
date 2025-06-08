'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

const branchOptions = {
  CSE: 'Computer Science & Engineering',
  CSAIML: 'Computer Science & Engineering (AI&ML)',
  CSDS: 'Computer Science & Engineering (Data Science)',
  ECE: 'Electronics & Communication Engineering',
  EEVLSI: 'Electronics Engineering (VLSI Design & Technology)',
  MEC: 'Mechanical Engineering',
  MMEAM: 'Mechanical & Mechatronics Engineering (Additive Manufacturing)',
  CHE: 'Chemical Engineering',
  CE: 'Civil Engineering',
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <PreferencesForm />
    </Suspense>
  );
}

function PreferencesForm() {
  const params = useSearchParams();
  const appIdFromQuery = params.get('appId') || '';
  const dobFromQuery = params.get('dob') || '';

  const initialFormState = {
    applicationNo: appIdFromQuery,
    name: '',
    rollNo: '',
    dob: dobFromQuery,
    mobile: '',
    Preference1: '',
    Preference2: '',
    Preference3: '',
    Preference4: '',
    Preference5: '',
    Preference6: '',
    Preference7: '',
    Preference8: '',
    Preference9: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const isSubmitted = localStorage.getItem(`juet_submitted_${appIdFromQuery}`);
    if (isSubmitted === 'true') {
      setSubmitted(true);
    }
  }, [appIdFromQuery]);

  const handleInputChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const selectedPreferences = Array.from({ length: 9 }, (_, i) => form[`Preference${i + 1}`]);

  const availableBranches = (currentPrefKey) => {
    return Object.entries(branchOptions).filter(([code]) =>
      !selectedPreferences.includes(code) || form[currentPrefKey] === code
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'applicationNo', 'name', 'rollNo', 'dob', 'mobile',
      'Preference1', 'Preference2', 'Preference3', 'Preference4'
    ];
    const missing = requiredFields.filter(f => !form[f]);
    if (missing.length > 0) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      const response = await fetch('https://script.google.com/macros/s/AKfycbxgBx13qO4_u3ApfzDj2dL04Ms_SFPHPX1l6YituZ0VuYmGCVl0Aw5TDQkYWA6M_ut8Tg/exec', {
        method: 'POST',
        body: formData,
      });

      const resultText = await response.text();

      if (response.ok && resultText.includes("success")) {
        localStorage.setItem(`juet_submitted_${form.applicationNo}`, 'true');
        setSubmitted(true);
      } else {
        alert('Failed to submit preferences.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the form.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f0f0f8] flex items-center justify-center">
        <div className="text-center">
          <img src="/logo.jpeg" alt="JUET Logo" className="h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Thank you!</h2>
          <p className="mt-2 text-gray-600">You have submitted the form successfully.</p>
          <p className="mt-6 font-medium text-green-700">You can close now.</p>
          <button
            className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-sm"
            onClick={() => window.close()}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f8] flex flex-col">
      <div className="w-full">
        <img src="/header.png" alt="JUET Header" className="w-full object-cover" />
      </div>

      <form onSubmit={handleSubmit} className="flex-grow px-4 py-10 flex justify-center">
        <div className="w-full max-w-3xl border border-orange-500 border-t-[3px] border-b-[20px] bg-white p-10 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-2xl text-[#333]">JEE Based Counselling 2025</h2>
            <img src="/logo.jpeg" alt="JUET Logo" className="h-20 w-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <InputField label="Application ID." required value={form.applicationNo} onChange={e => handleInputChange('applicationNo', e.target.value)} />
            <InputField label="Name" required value={form.name} onChange={e => handleInputChange('name', e.target.value)} />
            <InputField label="12th Roll No." required value={form.rollNo} onChange={e => handleInputChange('rollNo', e.target.value)} />
            <InputField label="Date of Birth (DD-MM-YYYY)" required value={form.dob} onChange={e => handleInputChange('dob', e.target.value)} />
            <InputField label="Mobile No." required value={form.mobile} onChange={e => handleInputChange('mobile', e.target.value)} maxLength={10} />
          </div>

          <h3 className="text-lg font-bold mb-4 text-gray-700">Branch Preferences</h3>
          {[...Array(9)].map((_, i) => {
            const prefKey = `Preference${i + 1}`;
            return (
              <div key={prefKey} className="mb-5">
                <label className="block font-bold text-gray-700 mb-1">
                  Preference {i + 1} {i < 4 && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={form[prefKey]}
                  required={i < 4}
                  onChange={(e) => handleInputChange(prefKey, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none"
                >
                  <option value="">Select branch</option>
                  {availableBranches(prefKey).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            );
          })}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-sm font-medium"
            >
              Submit Preferences
            </button>
          </div>
        </div>
      </form>

      <footer className="text-center mt-auto pb-6 text-sm text-gray-700">
        <p>
          For comments or suggestions, email at{' '}
          <a href="mailto:info@juet.ac.in" className="text-blue-600 underline">
            info@juet.ac.in
          </a>
        </p>
      </footer>
    </div>
  );
}

function InputField({ label, required, value, onChange, ...props }) {
  return (
    <div>
      <label className="block font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none"
        {...props}
      />
    </div>
  );
}
