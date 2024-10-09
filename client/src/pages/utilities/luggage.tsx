import React from 'react';
import { motion } from 'framer-motion';
import { Luggage, Scale, ShoppingBag } from 'lucide-react';

interface Package {
  name: string;
  weight: string;
  description: string;
  price: string;
  features: string[];
}

const baggagePackages: Package[] = [
  {
    name: 'Standard Package',
    weight: '33 lbs (15kg)',
    description: 'Ideal for short trips with an affordable price.',
    price: '$50',
    features: ['1 checked bag', 'Basic travel insurance', 'Standard check-in', 'Normal lounge access'],
  },
  {
    name: 'Premium Package',
    weight: '44 lbs (20kg)',
    description: 'Perfect for larger luggage for longer trips.',
    price: '$75',
    features: ['1 checked bag', 'Priority baggage handling', 'Extended travel insurance', 'Normal lounge access'],
  },
  {
    name: 'VIP Package',
    weight: '66 lbs (30kg)',
    description: 'Enjoy maximum space for your luggage with this premium option.',
    price: '$100',
    features: ['2 checked bags', 'Priority baggage handling', 'Comprehensive travel insurance', 'VIP lounge access'],
  },
];

const BaggagePackages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-indigo-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your Perfect Baggage Package
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {baggagePackages.map((pkg, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  {index === 0 && <Luggage className="w-10 h-10 text-white" />}
                  {index === 1 && <Scale className="w-10 h-10 text-white" />}
                  {index === 2 && <ShoppingBag className="w-10 h-10 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-center mb-4 text-indigo-900">
                  {pkg.name}
                </h2>
                <p className="text-center text-lg font-semibold text-indigo-700 mb-4">
                  Weight: {pkg.weight}
                </p>
                <p className="text-center text-gray-600 mb-6 truncate">{pkg.description}</p>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
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

export default BaggagePackages;