import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { Flight } from '@/schemas/Flight';
import API from '@/constants/api';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import FlightAddModal from '@/components/flight/FlightAdminAddModal';
import FlightEditModal from '@/components/flight/FlightAdminEditModal';
import Pagination from '@/components/common/Pagination'; 

const AdminFlights: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allFlights, setAllFlights] = useState<Flight[]>([]);
    const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch all flights from API
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await axios.get(`${API.FLIGHT}?page=${currentPage}`, {
                    withCredentials: true,
                });
                setAllFlights(res.data.metadata.flights);
                setTotalPages(res.data.metadata.totalPages);
            } catch (err) {
                toast.error("Error fetching flights");
            }
        };
        fetchFlights();
    }, [shouldFetch, currentPage]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    
    const openEditModal = (flight: Flight) => {
        setCurrentFlight(flight);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleAddFlight = async (flight: Flight) => {
        try {
            await axios.post(`${API.FLIGHT}`, flight, {
                withCredentials: true,
            });
            toast.success("Flight added successfully");
            setShouldFetch(prev => !prev);
            closeAddModal();
        } catch (err) {
            toast.error("Error adding flight");
        }
    };

    const handleEditFlight = async (updatedFlight: Flight) => {
        try {
            await axios.put(`${API.FLIGHT}/${updatedFlight.flight_id}`, updatedFlight, {
                withCredentials: true,
            });
            toast.success("Flight edited successfully");
            setShouldFetch(prev => !prev);
            closeEditModal();
        } catch (err) {
            toast.error("Error editing flight");
        }
    };

    const handleDeleteFlight = async (flight_id: string) => {
        try {
            await axios.delete(`${API.FLIGHT}/${flight_id}`, {
                withCredentials: true,
            });
            toast.success("Flight deleted successfully");
            setShouldFetch(prev => !prev);
        } catch (err) {
            toast.error("Error deleting flight");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Flights</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                        onClick={openAddModal}
                    >
                        <AiOutlinePlus className="mr-2" /> Add New Flight
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Code</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Type</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Business Price</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Economy Price</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Departure</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Arrival</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Status</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allFlights.map((flight) => (
                                <tr key={flight.flight_id} className="border-t">
                                    <td className="px-4 py-2">{flight.code}</td>
                                    <td className="px-4 py-2 capitalize">{flight.type}</td>
                                    <td className="px-4 py-2">${flight.price_business}</td>
                                    <td className="px-4 py-2">${flight.price_economy}</td>
                                    <td className="px-4 py-2">{flight.departure_airport}</td>
                                    <td className="px-4 py-2">{flight.arrival_airport}</td>
                                    <td className="px-4 py-2 capitalize">{flight.status}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-green-600 hover:text-green-800 flex items-center"
                                                onClick={() => openEditModal(flight)}
                                            >
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 flex items-center"
                                                onClick={() => handleDeleteFlight(flight.flight_id)}
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

            <FlightAddModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={(flight: Flight) => handleAddFlight(flight)}
            />

            <FlightEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                flightData={currentFlight as Flight}
                onSubmit={(flight: Flight) => handleEditFlight(flight)}
            />
        </div>
    );
};

export default AdminFlights;
