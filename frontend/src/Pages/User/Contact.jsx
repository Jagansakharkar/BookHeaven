import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/v1/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Left Info Panel */}
        <div className="bg-gradient-to-b from-blue-700 to-indigo-800 text-white p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-indigo-100">
              We're here to help with your orders, book suggestions, and more!
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <div>
              <h4 className="font-semibold">Email</h4>
              <p className="text-indigo-200">support@bookhub.com</p>
            </div>
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p className="text-indigo-200">+91 98765 43210</p>
            </div>
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-indigo-200">123, Book Street, Pune, India</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-10">
          <h3 className="text-2xl font-bold mb-6 text-gray-700">Send us a message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Order query / Feedback / Book request"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 w-full"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
