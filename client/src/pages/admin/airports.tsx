import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from "axios";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { Airport } from '@/schemas/Airport';
import API from "@/constants/api";
import SideBarAdmin from "@/components/common/SideBarAdmin";
import AirportAddModal from "@/components/airport/AirportAdminAddModal";
import AirportEditModal from "@/components/airport/AirportAdminEditModal";
import Pagination from "@/components/common/Pagination";
import ErrorMessage from '@/components/common/ErrorMessageQuery';
import LoadingQuery from '@/components/common/LoadingQuery';

interface AirportResponse {
  airports: Airport[];
  totalPages: number;
}

const fetchAirports = async (page: number): Promise<AirportResponse> => {
  const res = await axios.get(`${API.AIRPORT}?page=${page}`, { withCredentials: true });
  return res.data.metadata;
}

const addAirport = async (airport: Omit<Airport, 'airport_id'>): Promise<Airport> => {
  const res = await axios.post(`${API.AIRPORT}`, airport, { withCredentials: true });
  return res.data;
}

const editAirport = async (airport: Airport): Promise<Airport> => {
  const res = await axios.patch(`${API.AIRPORT}/${airport.airport_id}`, airport, { withCredentials: true });
  return res.data;
}

const deleteAirport = async (airport_id: string): Promise<void> => {
  await axios.delete(`${API.AIRPORT}/${airport_id}`, { withCredentials: true });
}

const AdminAirports = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAirport, setCurrentAirport] = useState<Airport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isLoading,
  } = useQuery<AirportResponse, Error>({
    queryKey: ['airports', currentPage],
    queryFn: () => fetchAirports(currentPage)
  })

  const totalPages = data?.totalPages || 1;
  const allAirports = data?.airports || [];

  const addAirportMutation = useMutation<Airport, Error, Omit<Airport, 'airport_id'>>({
    mutationFn: addAirport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport added successfully');
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error('Error adding airport');
    },
  })

  const editAirportMutation = useMutation<Airport, Error, Airport>({
    mutationFn: editAirport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport edited successfully');
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error('Error editing airport');
    },
  });

  const deleteAirportMutation  = useMutation<void, Error, string>({
    mutationFn: deleteAirport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      toast.success('Airport deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting airport');
    },
  })

  const openAddModal = () => {
    setIsAddModalOpen(true);
  }
    
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  }

  const openEditModal = (airport: Airport) => {
    setCurrentAirport(airport);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  }

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    console.error(error);
    toast.error('Error fetching airports');
    return <ErrorMessage message='Error fetching airports' />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SideBarAdmin />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-700">
            Manage Airports
          </h1>
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
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Airport Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Location
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Actions
                </th>
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
                        onClick={() => deleteAirportMutation.mutate(airport.airport_id)}
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

      <AirportAddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={(airportData: Omit<Airport, 'airport_id'>) =>
          addAirportMutation.mutate(airportData)
        }
      />
      
      {currentAirport && (
        <AirportEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          airportData={currentAirport}
          onSubmit={(updatedAirport: Airport) => editAirportMutation.mutate(updatedAirport)}
        />
      )}
    </div>
  );
}

export default AdminAirports;
