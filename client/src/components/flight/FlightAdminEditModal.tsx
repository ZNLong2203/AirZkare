import React, { useState, useEffect } from 'react';
import { Flight, FlightSchema } from '@/schemas/Flight';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

interface FlightEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    flightData: Flight;
    onSubmit: (flight: Flight) => void;
}

const FlightEditModal: React.FC<FlightEditModalProps> = ({ isOpen, onClose, flightData, onSubmit }) => {
    const [formData, setFormData] = useState(flightData);

    useEffect(() => {
        setFormData(flightData);
    }, [flightData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        try {
            const validatedData = FlightSchema.parse({
                ...formData,
                price_business: parseFloat(formData.price_business.toString()),
                price_economy: parseFloat(formData.price_economy.toString()),
                departure_time: new Date(formData.departure_time),
                arrival_time: new Date(formData.arrival_time),
            });
            onSubmit(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error('Invalid form data');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl mb-4">Edit Flight</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Flight Code"
                        className="border p-2 rounded"
                    />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="non-stop">Non-stop</option>
                        <option value="connecting">Connecting</option>
                    </select>
                    <input
                        type="number"
                        name="price_business"
                        value={formData.price_business}
                        onChange={handleChange}
                        placeholder="Business Price"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        name="price_economy"
                        value={formData.price_economy}
                        onChange={handleChange}
                        placeholder="Economy Price"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="departure_airport"
                        value={formData.departure_airport}
                        onChange={handleChange}
                        placeholder="Departure Airport"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="arrival_airport"
                        value={formData.arrival_airport}
                        onChange={handleChange}
                        placeholder="Arrival Airport"
                        className="border p-2 rounded"
                    />
                    <input
                        type="datetime-local"
                        name="departure_time"
                        value={new Date(formData.departure_time).toISOString().substring(0, 16)}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="datetime-local"
                        name="arrival_time"
                        value={new Date(formData.arrival_time).toISOString().substring(0, 16)}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="on-time">On-time</option>
                        <option value="delayed">Delayed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightEditModal;
