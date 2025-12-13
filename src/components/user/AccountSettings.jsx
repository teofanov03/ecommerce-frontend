import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext'; // Adjust path as necessary

const AccountSettings = () => {
    // Get user data and login/logout functions from context
    const { user, login, logout } = useAuthContext();

    // State for basic details update (Name and Email)
    const [userDetails, setUserDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [detailsLoading, setDetailsLoading] = useState(false);

    // State for password update
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);


    // --- Handlers for User Details Form ---

    const handleDetailsChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setDetailsLoading(true);

        if (!userDetails.name || !userDetails.email) {
             toast.error("Name and email are required.");
             setDetailsLoading(false);
             return;
        }

        try {
            // 💡 API Call to update user details
            await axiosInstance.patch('/auth/update-details', userDetails);

            // You might need to update the context state here to reflect changes immediately
            // Since we are not saving the whole updated user object in response, a simple success toast is used.
            toast.success("Details updated successfully! Please re-login if changes are not reflected.");
            
        } catch (error) {
            console.error("Update failed:", error);
            const message = error.response?.data?.message || 'Failed to update details.';
            toast.error(message);
        } finally {
            setDetailsLoading(false);
        }
    };


    // --- Handlers for Password Form ---

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            setPasswordLoading(false);
            return;
        }

        try {
            // 💡 API Call to update password
            await axiosInstance.patch('/auth/update-password', passwordData);

            toast.success("Password changed successfully! Please log in with your new password.");
            
            // Critical step: Force logout after password change for security
            logout(); 

        } catch (error) {
            console.error("Password update failed:", error);
            console.error("Error response:", error.response?.data);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update password. Check your current password.';
            toast.error(errorMessage);
        } finally {
            setPasswordLoading(false);
            // Clear fields regardless of success/fail
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
        }
    };


    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>

            {/* User Details Form */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h3 className="text-xl font-medium mb-4">Personal Details</h3>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={userDetails.name} 
                            onChange={handleDetailsChange} 
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={userDetails.email} 
                            onChange={handleDetailsChange} 
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={detailsLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {detailsLoading ? 'Updating...' : 'Save Details'}
                    </button>
                </form>
            </div>

            {/* Password Update Form */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h3 className="text-xl font-medium mb-4">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input 
                            type="password" 
                            name="currentPassword" 
                            value={passwordData.currentPassword} 
                            onChange={handlePasswordChange} 
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={passwordData.newPassword} 
                            onChange={handlePasswordChange} 
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={passwordData.confirmPassword} 
                            onChange={handlePasswordChange} 
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={passwordLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;