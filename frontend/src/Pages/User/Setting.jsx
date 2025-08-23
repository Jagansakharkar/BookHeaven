import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Loader from "../../Components/common/Loader";
import BackButton from '../../Components/common/BackButton';
import { useGetUserInfo } from '../../hooks/User';

const Setting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal-info');
  const { data: profileData, isLoading, isError, error } = useGetUserInfo();

  // Handle error state
  if (isError) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.message || 'Failed to load profile data',
      confirmButtonColor: '#3b82f6'
    });
    navigate('/profile'); // Redirect back to profile on error
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'address-contact', label: 'Address & Contact' },
    { id: 'account-security', label: 'Account Security' },
    { id: 'notification-setting', label: 'Notifications' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <BackButton to="/profile" text='Back to Profile' />
      </div>

      {/* Main heading */}
      <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
      <p className="text-zinc-400 mb-8">Manage your personal information and preferences</p>

      {/* Settings navigation */}
      <div className="mb-8">
        <nav className="flex overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1 backdrop-blur-sm border border-zinc-700">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={tab.id}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Content area */}
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-lg overflow-hidden p-6">
        {profileData ? (
          <Outlet context={{ profileData }} />
        ) : (
          <div className="text-center py-12 text-zinc-400">
            No profile data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;