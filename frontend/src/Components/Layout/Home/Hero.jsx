import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative bg-gray-800 py-20 px-6 text-center overflow-hidden text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Unlock Your Next Great Read
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Discover handpicked books from every genre — curated just for you.
        </p>
        <Link to="/all-books">
          <button className="bg-indigo-700 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-800 transition duration-300">
            Discover Books
          </button>
        </Link>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:block opacity-10">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
          alt="Books"
          className="h-96 rounded-lg"
        />
      </div>
    </section>
  );
};



