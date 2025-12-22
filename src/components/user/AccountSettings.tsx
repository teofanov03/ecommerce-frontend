// src/pages/user/AccountSettings.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../api/axios';
import { useAuthContext } from '../../context/AuthContext';
import type { AuthContextType } from '../../types/auth';
import type { AxiosError } from 'axios';

// --- TIPOVI ---
interface UserDetails {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- KOMPONENTA ---
const AccountSettings: React.FC = () => {
  // AuthContext
  const { user, logout } = useAuthContext() as AuthContextType;

  // State za detalje korisnika
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [detailsLoading, setDetailsLoading] = useState(false);

  // State za lozinku
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // --- HANDLERI ---
  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Update korisničkih detalja
  const handleDetailsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDetailsLoading(true);

    if (!userDetails.name || !userDetails.email) {
      toast.error('Name and email are required.');
      setDetailsLoading(false);
      return;
    }

    try {
      await axiosInstance.patch('/auth/update-details', userDetails);
      toast.success('Details updated successfully!');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || 'Failed to update details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update lozinke
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      await axiosInstance.patch('/auth/update-password', passwordData);
      toast.success('Password updated! Please log in again.');
      logout();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // --- JSX ---
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>

      {/* Detalji korisnika */}
      <form onSubmit={handleDetailsSubmit} className="p-6 border rounded bg-white shadow-sm space-y-4">
        <input
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleDetailsChange}
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleDetailsChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          disabled={detailsLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
        >
          {detailsLoading ? 'Updating...' : 'Save Details'}
        </button>
      </form>

      {/* Ložinka */}
      <form onSubmit={handlePasswordSubmit} className="p-6 border rounded bg-white shadow-sm space-y-4">
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          placeholder="Current Password"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          disabled={passwordLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
        >
          {passwordLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
