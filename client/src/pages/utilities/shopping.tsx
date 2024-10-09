import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: number;
}

const products: Product[] = [
  {
    name: 'Airline Branded T-shirt',
    description: 'High-quality T-shirt with the airline logo.',
    price: '$15',
    imageUrl: 'https://image.made-in-china.com/202f0j00CMQWLDBsbKpR/100-Cotton-190g-200g-210g-220g-T-Shirts-Mens-Plain-Dyed-Oversized-Short-Sleeves-T-Shirts-Blank-Man-T-Shirt-Eco-Friendly-Tee-Shirts.jpg',
    rating: 4.5,
  },
  {
    name: 'Premium Wine',
    description: 'High-quality wine from top brands.',
    price: '$30',
    imageUrl: 'https://bravofarms.com/cdn/shop/products/red-wine.jpg?v=1646253890',
    rating: 4.8,
  },
  {
    name: 'Noise-Cancelling Headphones',
    description: 'Noise-cancelling headphones for a comfortable flight.',
    price: '$50',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbBgeEwdV5B581gCBpj2CKCZKgIGGWSN8kXw&s',
    rating: 4.7,
  },
];

const InFlightShopping: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-indigo-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Elevate Your Journey with In-Flight Shopping
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-2 truncate">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-bold text-indigo-700">
                    {product.price}
                  </p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                <motion.button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InFlightShopping;