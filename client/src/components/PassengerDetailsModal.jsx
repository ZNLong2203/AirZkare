import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdPerson } from 'react-icons/md';

const PassengerDetailsModal = ({ isOpen, onClose, passenger }) => {
    if (!isOpen || !passenger) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ease-out">
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all sm:max-w-lg w-full p-6 animate-fade-in-up">
                <div className="absolute top-0 right-0 p-2">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                    >
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                <div className="text-center mb-4">
                    <MdPerson size={40} className="text-blue-500 mx-auto" />
                    <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-4">Passenger Details</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">ID:</span>
                        <span className="text-gray-600">{passenger.user_id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Name:</span>
                        <span className="text-gray-600">{passenger.username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Email:</span>
                        <span className="text-gray-600">{passenger.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Phone:</span>
                        <span className="text-gray-600">{passenger.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Age:</span>
                        <span className="text-gray-600">{passenger.age}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Gender:</span>
                        <span className="text-gray-600">{passenger.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">City:</span>
                        <span className="text-gray-600">{passenger.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Country:</span>
                        <span className="text-gray-600">{passenger.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Nationality:</span>
                        <span className="text-gray-600">{passenger.nationality}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700">Membership:</span>
                        <span className="text-gray-600">{passenger.membership}</span>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PassengerDetailsModal;
