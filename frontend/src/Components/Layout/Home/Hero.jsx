import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Discover Your Next <span className="text-blue-600">Favorite Book</span>
          </h1>
          <p className="text-xl text-gray-600">
            Explore our curated collection of 50,000+ books. Find bestsellers, new releases, and personalized recommendations just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="/all-books"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-center font-medium transition-all duration-300 hover:shadow-lg"
            >
              Browse Collection
            </Link>

          </div>

        </div>
        <div className="md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            alt="Stack of books with a cozy reading atmosphere"
            className="rounded-xl shadow-xl w-full object-cover h-96"
          />

        </div>
      </div>
    </div>

  );
};