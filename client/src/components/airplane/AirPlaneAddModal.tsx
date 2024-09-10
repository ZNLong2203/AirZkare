import { useState, FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface AirplaneAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (airplane: { name: string; model: string; total_business: number; total_economy: number }) => void;
}

const AirplaneAddModal: FC<AirplaneAddModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [airplaneName, setAirplaneName] = useState('');
    const [airplaneModel, setAirplaneModel] = useState('');
    const [totalBusiness, setTotalBusiness] = useState<number>(0);
    const [totalEconomy, setTotalEconomy] = useState<number>(0);

    const handleSubmit = () => {
        onSubmit({ 
            name: airplaneName, 
            model: airplaneModel, 
            total_business: totalBusiness, 
            total_economy: totalEconomy 
        });
        setAirplaneName('');
        setAirplaneModel('');
        setTotalBusiness(0);
        setTotalEconomy(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Airplane</h2>
                    <button onClick={onClose}>
                        <AiOutlineClose className="text-2xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airplane Name</label>
                        <input 
                            type="text" 
                            value={airplaneName}
                            onChange={(e) => setAirplaneName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input 
                            type="text" 
                            value={airplaneModel}
                            onChange={(e) => setAirplaneModel(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Class Seats (Number must be divisible by 4)</label>
                        <input 
                            type="number" 
                            value={totalBusiness}
                            onChange={(e) => setTotalBusiness(parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Economy Class Seats (Number must be divisible by 6)</label>
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
                        Add Airplane
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AirplaneAddModal;
