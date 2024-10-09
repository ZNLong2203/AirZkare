import React from 'react';
import { Shield, Stethoscope, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-indigo-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your Perfect Travel Shield
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insurancePackages.map((pkg, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  {index === 0 && <Shield className="w-8 h-8 text-white" />}
                  {index === 1 && <Stethoscope className="w-8 h-8 text-white" />}
                  {index === 2 && <Plane className="w-8 h-8 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-center mb-4 text-indigo-900">
                  {pkg.name}
                </h2>
                <p className="text-center text-lg font-semibold text-indigo-700 mb-4">
                  Coverage: {pkg.coverage}
                </p>
                <p className="text-center text-gray-600 mb-6">{pkg.description}</p>
                <p className="text-center text-3xl font-bold text-indigo-900 mb-6">
                  {pkg.price}
                </p>
                <div className="text-center">
                  <motion.button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select Package
                  </motion.button>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsurancePackages;