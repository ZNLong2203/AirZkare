import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SideBarAdmin from '@/components/SideBarAdmin';
import API from '@/constants/api';

const AdminPassengers = () => {
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const response = await axios.get(`${API.ADMIN_PASSENGERS}`);
                setPassengers(response.data.metadata);
            } catch (error) {
                toast.error("Error fetching passengers");
            }
        };
        fetchPassengers();
    }, []);

    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Passengers</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                        <AiOutlinePlus className="mr-2" /> Add New Customer
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Customer ID</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Phone</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((passenger) => (
                                <tr key={passenger.user_id} className="border-t">
                                    <td className="px-4 py-2">{passenger.user_id}</td>
                                    <td className="px-4 py-2">{passenger.username}</td>
                                    <td className="px-4 py-2">{passenger.email}</td>
                                    <td className="px-4 py-2">{passenger.passenger.phone}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button className="text-green-600 hover:text-green-800 flex items-center">
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 flex items-center">
                                                <AiOutlineDelete className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AdminPassengers;
