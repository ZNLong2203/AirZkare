import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { Passenger } from '@/schemas/Passenger';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import API from '@/constants/api';
import PassengerDetailsModal from '@/components/passenger/PassengerDetailsModal';
import Pagination from '@/components/common/Pagination'; 

const AdminPassengers = () => {
    const [allPassengers, setAllPassengers] = useState<Passenger[]>([]);
    const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const res = await axios.get(`${API.PASSENGER}`, {
                    withCredentials: true,
                });
                setAllPassengers(res.data.metadata.passengers);
                setTotalPages(res.data.metadata.totalPages); 
            } catch (error) {
                toast.error("Error fetching passengers");
            }
        };
        fetchPassengers();
    }, []);

    const handleDeletePassenger = async (user_id: string) => {
        try {
            await axios.delete(`${API.PASSENGER}/${user_id}`, {
                withCredentials: true,
            });
            toast.success("Passenger deleted successfully");
            setAllPassengers(allPassengers.filter((passenger) => passenger.user_id !== user_id));
        } catch (error) {
            toast.error("Error deleting passenger");
        }
    };

    const handleViewPassenger = async (user_id: string) => {
        try {
            const res = await axios.get(`${API.PASSENGER}/${user_id}`, {
                withCredentials: true,
            });
            const passenger: Passenger = {
                ...res.data.metadata,
                ...res.data.metadata.user
            }
            setSelectedPassenger(passenger);
            setIsModalOpen(true);
        } catch {
            toast.error("Error fetching passenger");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPassenger(null);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

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
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Role</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPassengers.map((passenger) => (
                                <tr key={passenger.user_id} className="border-t">
                                    <td className="px-4 py-2">{passenger.user_id}</td>
                                    <td className="px-4 py-2">{passenger.username}</td>
                                    <td className="px-4 py-2">{passenger.email}</td>
                                    <td className="px-4 py-2">{passenger.role}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewPassenger(passenger.user_id)}
                                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <AiOutlineEye className="mr-1" /> View
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 flex items-center"
                                                onClick={() => handleDeletePassenger(passenger.user_id)}
                                            >
                                                <AiOutlineDelete className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>

            <PassengerDetailsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                passenger={selectedPassenger as Passenger}
            />
        </div>
    );
};

export default AdminPassengers;
