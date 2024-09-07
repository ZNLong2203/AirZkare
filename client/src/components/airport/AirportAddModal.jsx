import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const AirportAddModal = ({ isOpen, onClose, onSubmit }) => {
    const [airportName, setAirportName] = useState('');
    const [airportCode, setAirportCode] = useState('');
    const [airportLocation, setAirportLocation] = useState('');

    const handleSubmit = () => {
        onSubmit({ code: airportCode, name: airportName, location: airportLocation });
        setAirportName('');
        setAirportCode('');
        setAirportLocation('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Airport</h2>
                    <button onClick={onClose}>
                        <AiOutlineClose className="text-2xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airport Code</label>
                        <input 
                            type="text" 
                            value={airportCode}
                            onChange={(e) => setAirportCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airport Name</label>
                        <input 
                            type="text" 
                            value={airportName}
                            onChange={(e) => setAirportName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input 
                            type="text" 
                            value={airportLocation}
                            onChange={(e) => setAirportLocation(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Add Airport
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AirportAddModal;
