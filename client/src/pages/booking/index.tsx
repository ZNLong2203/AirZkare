import React from 'react';
import { FaPlane, FaCalendarAlt, FaUsers, FaSuitcase } from 'react-icons/fa';

const Booking = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex flex-col items-center justify-center">
      <header className="w-full text-white text-center py-10">
        <h1 className="text-5xl font-bold">Book Your Flight</h1>
        <p className="mt-4 text-lg">Experience the World with Ease</p>
      </header>
      
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-10 my-10">
        <div className="text-center mb-10">
          <FaPlane className="text-blue-500 text-7xl mx-auto" />
        </div>

        <form className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">From</label>
              <input 
                type="text" 
                placeholder="City or Airport"
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-gray-700 font-medium">To</label>
              <input 
                type="text" 
                placeholder="City or Airport"
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Departure</label>
              <div className="relative mt-2">
                <FaCalendarAlt className="absolute top-4 left-3 text-gray-400" />
                <input 
                  type="date" 
                  className="p-3 w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-gray-700 font-medium">Return</label>
              <div className="relative mt-2">
                <FaCalendarAlt className="absolute top-4 left-3 text-gray-400" />
                <input 
                  type="date" 
                  className="p-3 w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Passengers</label>
              <div className="relative mt-2">
                <FaUsers className="absolute top-4 left-3 text-gray-400" />
                <input 
                  type="number" 
                  placeholder="1"
                  className="p-3 w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-gray-700 font-medium">Class</label>
              <select 
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Baggage</label>
            <div className="relative mt-2">
              <FaSuitcase className="absolute top-4 left-3 text-gray-400" />
              <input 
                type="number" 
                placeholder="0"
                className="p-3 w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
