import React from 'react';
import { FaShieldAlt, FaMedkit, FaPlane } from 'react-icons/fa';

interface InsurancePackage {
  name: string;
  coverage: string;
  description: string;
  price: string;
}

const insurancePackages: InsurancePackage[] = [
  {
    name: 'Basic Package',
    coverage: '$2,000',
    description: 'Covers basic luggage and medical expenses during the trip.',
    price: '$50',
  },
  {
    name: 'Standard Package',
    coverage: '$4,000',
    description: 'Enhanced coverage for luggage and medical support while traveling.',
    price: '$100',
  },
  {
    name: 'Premium Package',
    coverage: '$8,000',
    description: 'Comprehensive coverage, including flight costs and medical expenses.',
    price: '$150',
  },
];

const InsurancePackages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-100">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-5xl font-extrabold text-center mb-16">
          Choose the Right Travel Insurance Package
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {insurancePackages.map((pkg, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex justify-center items-center shadow-lg">
                {index === 0 && <FaShieldAlt className="text-4xl" />}
                {index === 1 && <FaMedkit className="text-4xl" />}
                {index === 2 && <FaPlane className="text-4xl" />}
              </div>
              <h2 className="text-3xl font-semibold text-center mb-4 text-blue-700">
                {pkg.name}
              </h2>
              <p className="text-center text-lg text-gray-700 mb-4">
                Coverage: <span className="font-bold">{pkg.coverage}</span>
              </p>
              <p className="text-center text-gray-500 mb-6">{pkg.description}</p>
              <p className="text-center text-2xl font-bold text-indigo-800 mb-6">
                {pkg.price}
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
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

export default InsurancePackages;
