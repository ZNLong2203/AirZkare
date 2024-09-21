import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { Airplane } from '@/schemas/Airplane'
import API from '@/constants/api';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import AirplaneAddModal from '@/components/airplane/AirPlaneAdminAddModal';
import AirplaneEditModal from '@/components/airplane/AirPlaneAdminEditModal';
import Pagination from '@/components/common/Pagination'; 

const AdminAirplane: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allAirplanes, setAllAirplanes] = useState<Airplane[]>([]);
    const [currentAirplane, setCurrentAirplane] = useState<Airplane | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAirplanes = async () => {
            try {
                const res = await axios.get(`${API.AIRPLANE}?page=${currentPage}`, {
                    withCredentials: true,
                });
                setAllAirplanes(res.data.metadata.airplanes); 
                setTotalPages(res.data.metadata.totalPages); 
            } catch (err) {
                toast.error("Error fetching airplanes");
            }
        };
        fetchAirplanes();
    }, [shouldFetch, currentPage]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (airplane: Airplane) => {
        setCurrentAirplane(airplane);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAddAirplane = async (airplane: Airplane) => {
        try {
            await axios.post(`${API.AIRPLANE}`, airplane, {
                withCredentials: true,
            });
            toast.success("Airplane added successfully");
            setShouldFetch(prev => !prev);
            closeAddModal();
        } catch (err) {
            toast.error("Error adding airplane");
        }
    };

    const handleEditAirplane = async (updatedAirplane: Airplane) => {
        try {
            await axios.put(`${API.AIRPLANE}/${updatedAirplane.airplane_id}`, updatedAirplane, {
                withCredentials: true,
            });
            toast.success("Airplane edited successfully");
            setShouldFetch(prev => !prev);
            closeEditModal();
        } catch (err) {
            toast.error("Error editing airplane");
        }
    };

    const handleDeleteAirplane = async (airplane_id: string) => {
        try {
            await axios.delete(`${API.AIRPLANE}/${airplane_id}`, {
                withCredentials: true,
            });
            toast.success("Airplane deleted successfully");
            setShouldFetch(prev => !prev);
        } catch (err) {
            toast.error("Error deleting airplane");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Airplanes</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                        onClick={openAddModal}
                    >
                        <AiOutlinePlus className="mr-2" /> Add New Airplane
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Model</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Business Class</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Economy Class</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAirplanes.map((airplane) => (
                                <tr key={airplane.airplane_id} className="border-t">
                                    <td className="px-4 py-2">{airplane.name}</td>
                                    <td className="px-4 py-2">{airplane.model}</td>
                                    <td className="px-4 py-2">{airplane.total_business} seats</td>
                                    <td className="px-4 py-2">{airplane.total_economy} seats</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-green-600 hover:text-green-800 flex items-center"
                                                onClick={() => openEditModal(airplane)}
                                            >
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 flex items-center"
                                                onClick={() => handleDeleteAirplane(airplane.airplane_id)}
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
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </div>
            </main>

            <AirplaneAddModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={(airplane: { name: string; model: string; total_business: number; total_economy: number }) =>
                    handleAddAirplane(airplane as Airplane)
                }
            />

            <AirplaneEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                airplaneData={currentAirplane as {
                    airplane_id: string;
                    name: string;
                    model: string;
                    total_business: number;
                    total_economy: number;
                }}
                onSubmit={(airplane: {
                    airplane_id: string;
                    name: string;
                    model: string;
                    total_business: number;
                    total_economy: number;
                }) => handleEditAirplane(airplane as Airplane)}
            />
        </div>
    );
};

export default AdminAirplane;
