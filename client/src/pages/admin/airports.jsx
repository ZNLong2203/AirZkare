import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import API from '@/constants/api';
import SideBarAdmin from '@/components/SideBarAdmin';
import AirportAddModal from '@/components/airport/AirportAddModal';
import AirportEditModal from '@/components/airport/AirportEditModal';

const AdminAirports = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allAirports, setAllAirports] = useState([]);
    const [currentAirport, setCurrentAirport] = useState(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const res = await axios.get(`${API.AIRPORT}`);
                setAllAirports(res.data.metadata);
            } catch (err) {
                toast.error("Error fetching airports");
            }
        };
        fetchAirports();
    }, [shouldFetch]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (airport) => {
        setCurrentAirport(airport);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAddAirport = async (airport) => {
        try {
            await axios.post(`${API.AIRPORT}`, airport);
            toast.success("Airport added successfully");
            setShouldFetch(prev => !prev);
            closeAddModal();
        } catch (err) {
            toast.error("Error adding airport");
        }
    };

    const handleEditAirport = async (updatedAirport) => {
        try {
            await axios.patch(`${API.AIRPORT}/${updatedAirport.airport_id}`, updatedAirport);
            toast.success("Airport edited successfully");
            setShouldFetch(prev => !prev);
            closeEditModal();
        } catch (err) {
            toast.error("Error editing airport");
        }
    };

    const handleDeleteAirport = async (airport_id) => {
        try {
            await axios.delete(`${API.AIRPORT}/${airport_id}`);
            toast.success("Airport deleted successfully");
            setShouldFetch(prev => !prev);
        } catch (err) {
            toast.error("Error deleting airport");
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Airports</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                        onClick={openAddModal}
                    >
                        <AiOutlinePlus className="mr-2" /> Add New Airport
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Code</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Airport Name</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Location</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAirports.map((airport) => (
                                <tr key={airport.airport_id} className="border-t">
                                    <td className="px-4 py-2">{airport.code}</td>
                                    <td className="px-4 py-2">{airport.name}</td>
                                    <td className="px-4 py-2">{airport.location}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-green-600 hover:text-green-800 flex items-center"
                                                onClick={() => openEditModal(airport)}
                                            >
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800 flex items-center"
                                                onClick={() => handleDeleteAirport(airport.airport_id)}
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
            </main>

            {/* Add and Edit Modals */}
            <AirportAddModal 
                isOpen={isAddModalOpen} 
                onClose={closeAddModal} 
                onSubmit={handleAddAirport} 
            />
            <AirportEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                airportData={currentAirport}
                onSubmit={handleEditAirport}
            />
        </div>
    );
};

export default AdminAirports;
