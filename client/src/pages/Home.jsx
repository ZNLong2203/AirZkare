import React from 'react';
import { FaPlane } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex flex-col items-center justify-center">
      <header className="w-full text-white text-center py-10">
        <h1 className="text-5xl font-bold">Book Your Flight</h1>
        <p className="mt-4 text-lg">Experience the World with Ease</p>
      </header>
      
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8 my-10">
        <div className="text-center mb-8">
          <FaPlane className="text-blue-500 text-6xl mx-auto" />
        </div>

        <form className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">From</label>
              <input 
                type="text" 
                placeholder="City or Airport"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-gray-700 font-medium">To</label>
              <input 
                type="text" 
                placeholder="City or Airport"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Departure</label>
              <input 
                type="date" 
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-gray-700 font-medium">Return</label>
              <input 
                type="date" 
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            Search Flights
          </button>
        </form>
      </div>

      <footer className="w-full text-center text-white py-6">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
