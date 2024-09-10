import React, { useState, useEffect, FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface AirplaneEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    airplaneData: {
        airplane_id: string;
        name: string;
        model: string;
        total_business: number;
        total_economy: number;
    };
    onSubmit: (data: { airplane_id: string; name: string; model: string; total_business: number; total_economy: number }) => void;
}

const AirplaneEditModal: FC<AirplaneEditModalProps> = ({ isOpen, onClose, airplaneData, onSubmit }) => {
    const [name, setName] = useState('');
    const [model, setModel] = useState('');
    const [totalBusiness, setTotalBusiness] = useState<number>(0);
    const [totalEconomy, setTotalEconomy] = useState<number>(0);

    useEffect(() => {
        if (airplaneData) {
            setName(airplaneData.name);
            setModel(airplaneData.model);
            setTotalBusiness(airplaneData.total_business);
            setTotalEconomy(airplaneData.total_economy);
        }
    }, [airplaneData]);

    const handleSubmit = () => {
        onSubmit({
            airplane_id: airplaneData.airplane_id,
            name,
            model,
            total_business: totalBusiness,
            total_economy: totalEconomy,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Airplane</h2>
                    <button onClick={onClose}>
                        <AiOutlineClose className="text-2xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airplane Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Class Seats</label>
                        <input
                            type="number"
                            value={totalBusiness}
                            onChange={(e) => setTotalBusiness(parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Economy Class Seats</label>
                        <input
                            type="number"
                            value={totalEconomy}
                            onChange={(e) => setTotalEconomy(parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AirplaneEditModal;
