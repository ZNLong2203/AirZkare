import React from 'react';
import { FaSuitcase, FaWeightHanging, FaShoppingBag } from 'react-icons/fa';

interface Package {
  name: string;
  weight: string;
  description: string;
  price: string;
}

const baggagePackages: Package[] = [
  {
    name: 'Standard Package',
    weight: '33 lbs (15kg)',
    description: 'Ideal for short trips with an affordable price.',
    price: '$50',
  },
  {
    name: 'Premium Package',
    weight: '44 lbs (20kg)',
    description: 'Perfect for larger luggage for longer trips.',
    price: '$75',
  },
  {
    name: 'VIP Package',
    weight: '66 lbs (30kg)',
    description: 'Enjoy maximum space for your luggage with this premium option.',
    price: '$100',
  },
];

const BaggagePackages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-5xl font-extrabold text-center mb-16">
          Choose the Right Baggage Package for You
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {baggagePackages.map((pkg, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex justify-center items-center shadow-lg">
                {index === 0 && <FaSuitcase className="text-4xl" />}
                {index === 1 && <FaWeightHanging className="text-4xl" />}
                {index === 2 && <FaShoppingBag className="text-4xl" />}
              </div>
              <h2 className="text-3xl font-semibold text-center mb-4 text-indigo-700">
                {pkg.name}
              </h2>
              <p className="text-center text-lg text-gray-700 mb-4">
                Weight: <span className="font-bold">{pkg.weight}</span>
              </p>
              <p className="text-center text-gray-500 mb-6 truncate">{pkg.description}</p>
              <p className="text-center text-2xl font-bold text-indigo-800 mb-6">
                {pkg.price}
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300">
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaggagePackages;
