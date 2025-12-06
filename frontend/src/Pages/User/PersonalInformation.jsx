import React, { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate, useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUpdateUserProfile } from '../../hooks/User';
import BackButton from '../../Components/common/BackButton';

const PersonalInformation = () => {
  const { profileData } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateUserProfile()

  const [originalValue, setOriginalValue] = useState({
    fullname: "",
    email: "",
    address: "",
    gender: "",
    ContactNumber: "",
    BirthDate: ""
  });
  const [formData, setFormData] = useState(originalValue);

  // Initialize form data from profile
  useEffect(() => {
    if (profileData) {
      const initialData = {
        fullname: profileData.fullname || "",
        email: profileData.email || "",
        address: profileData.address.street || "",
        gender: profileData.gender || "",
        ContactNumber: profileData.address.phone || "",
        BirthDate: profileData.BirthDate?.slice(0, 10) || ""
      };
      setFormData(initialData);
      setOriginalValue(initialData);
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          text: "Profile updated successfully!",
          confirmButtonColor: '#3b82f6'
        });
        setOriginalValue(formData);
        setIsEditing(false);
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          text: error.response?.data?.message || "Failed to update profile",
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  const handleCancel = () => {
    setFormData(originalValue);
    setIsEditing(false);
  };

  console.log("formdata", formData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton to="/profile/settings" text="Back to Settings" />

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden relative transition-all duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label="Edit profile"
            >
              <FaRegEdit />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Fields */}
          {[
            { name: 'fullname', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'ContactNumber', label: 'Contact Number', type: 'text' },
            { name: 'BirthDate', label: 'Birth Date', type: 'date' },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${isEditing
                  ? 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700'
                  : 'border-transparent bg-gray-100 dark:bg-zinc-700'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                disabled={!isEditing}
              />
            </div>
          ))}

          {/* Gender Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${isEditing
                ? 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700'
                : 'border-transparent bg-gray-100 dark:bg-zinc-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Address Textarea */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${isEditing
                ? 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700'
                : 'border-transparent bg-gray-100 dark:bg-zinc-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={3}
              disabled={!isEditing}
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;