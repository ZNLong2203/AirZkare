import React from 'react';

interface Product {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const products: Product[] = [
  {
    name: 'Airline Branded T-shirt',
    description: 'High-quality T-shirt with the airline logo.',
    price: '$15',
    imageUrl: 'https://image.made-in-china.com/202f0j00CMQWLDBsbKpR/100-Cotton-190g-200g-210g-220g-T-Shirts-Mens-Plain-Dyed-Oversized-Short-Sleeves-T-Shirts-Blank-Man-T-Shirt-Eco-Friendly-Tee-Shirts.jpg', // Replace with actual image URL
  },
  {
    name: 'Premium Wine',
    description: 'High-quality wine from top brands.',
    price: '$30',
    imageUrl: 'https://bravofarms.com/cdn/shop/products/red-wine.jpg?v=1646253890', 
  },
  {
    name: 'Noise-Cancelling Headphones',
    description: 'Noise-cancelling headphones for a comfortable flight.',
    price: '$50',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbBgeEwdV5B581gCBpj2CKCZKgIGGWSN8kXw&s', 
  },
];

const InFlightShopping: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-orange-100">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-5xl font-extrabold text-center mb-16">
          In-Flight Shopping
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
              <h2 className="text-3xl font-semibold text-center mb-4 text-orange-700 truncate">
                {product.name}
              </h2>
              <p className="text-center text-gray-700 mb-4 truncate">{product.description}</p>
              <p className="text-center text-2xl font-bold text-indigo-800 mb-6">
                {product.price}
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-700 transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InFlightShopping;
