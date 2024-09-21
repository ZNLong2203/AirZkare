import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { Flight, FlightWithDA, FlightWithoutId } from '@/schemas/Flight';
import API from '@/constants/api';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import FlightAddModal from '@/components/flight/FlightAdminAddModal';
import FlightEditModal from '@/components/flight/FlightAdminEditModal';
import Pagination from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingQuery';
import ErrorMessage from '@/components/common/ErrorMessageQuery';

interface FlightResponse {
  flights: FlightWithDA[];
  totalPages: number;
}

const fetchFlights = async (page: number): Promise<FlightResponse> => {
  const res = await axios.get(`${API.FLIGHT}?page=${page}`, { withCredentials: true });
  return res.data.metadata;
};

const addFlight = async (flight: FlightWithoutId): Promise<Flight> => {
  const res = await axios.post(`${API.FLIGHT}`, flight, { withCredentials: true });
  return res.data;
};

const editFlight = async (flight: Flight): Promise<Flight> => {
  const res = await axios.put(`${API.FLIGHT}/${flight.flight_id}`, flight, {
    withCredentials: true,
  });
  return res.data;
};

const deleteFlight = async (flight_id: string): Promise<void> => {
  await axios.delete(`${API.FLIGHT}/${flight_id}`, { withCredentials: true });
};

const AdminFlights: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isLoading,
  } = useQuery<FlightResponse, Error>({
    queryKey: ['flights', currentPage],
    queryFn: () => fetchFlights(currentPage),
  });

  const totalPages = data?.totalPages || 1;
  const allFlights = data?.flights || [];

  const addFlightMutation = useMutation<Flight, Error, FlightWithoutId>({
    mutationFn: addFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight added successfully');
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error('Error adding flight');
    },
  });

  const editFlightMutation = useMutation<Flight, Error, Flight>({
    mutationFn: editFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight edited successfully');
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error('Error editing flight');
    },
  });

  const deleteFlightMutation = useMutation<void, Error, string>({
    mutationFn: deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting flight');
    },
  });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (flight: Flight) => {
    setCurrentFlight(flight);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentFlight(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    console.error(error);
    return <ErrorMessage message="Error fetching flights." />;
  }

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
                <tr key={flight.flight_id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{flight.code}</td>
                  <td className="px-4 py-2 capitalize">{flight.type}</td>
                  <td className="px-4 py-2">${flight.price_business}</td>
                  <td className="px-4 py-2">${flight.price_economy}</td>
                  <td className="px-4 py-2">
                    {flight.airport_flight_departure_airportToairport?.name}
                  </td>
                  <td className="px-4 py-2">
                    {flight.airport_flight_arrival_airportToairport?.name}
                  </td>
                  <td className="px-4 py-2 capitalize">{flight.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-4">
                      <button
                        className="text-green-600 hover:text-green-800 flex items-center"
                        onClick={() => openEditModal(flight)}
                      >
                        <AiOutlineEdit className="mr-1" /> Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 flex items-center"
                        onClick={() => deleteFlightMutation.mutate(flight.flight_id)}
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

        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </main>

      {/* Add Flight Modal */}
      <FlightAddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={(flightData: FlightWithoutId) => addFlightMutation.mutate(flightData)}
      />

      {/* Edit Flight Modal */}
      {currentFlight && (
        <FlightEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          flightData={currentFlight}
          onSubmit={(updatedFlight: Flight) => editFlightMutation.mutate(updatedFlight)}
        />
      )}
    </div>
  );
};

export default AdminFlights;
