import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { Airplane } from '@/schemas/Airplane';
import API from '@/constants/api';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import AirplaneAddModal from '@/components/airplane/AirPlaneAdminAddModal';
import AirplaneEditModal from '@/components/airplane/AirPlaneAdminEditModal';
import Pagination from '@/components/common/Pagination';
import ErrorMessage from '@/components/common/ErrorMessageQuery';
import LoadingQuery from '@/components/common/LoadingQuery';

interface AirplaneResponse {
  airplanes: Airplane[];
  totalPages: number;
}

const fetchAirplanes = async (page: number): Promise<AirplaneResponse> => {
  const res = await axios.get(`${API.AIRPLANE}?page=${page}`, { withCredentials: true });
  return res.data.metadata;
};

const addAirplane = async (airplane: Omit<Airplane, 'airplane_id'>): Promise<Airplane> => {
  const res = await axios.post(`${API.AIRPLANE}`, airplane, { withCredentials: true });
  return res.data;
};

const editAirplane = async (airplane: Airplane): Promise<Airplane> => {
  const res = await axios.put(`${API.AIRPLANE}/${airplane.airplane_id}`, airplane, { withCredentials: true });
  return res.data;
};

const deleteAirplane = async (airplane_id: string): Promise<void> => {
  await axios.delete(`${API.AIRPLANE}/${airplane_id}`, { withCredentials: true });
};

const AdminAirplane: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAirplane, setCurrentAirplane] = useState<Airplane | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isLoading,
  } = useQuery<AirplaneResponse, Error>({
    queryKey: ['airplanes', currentPage],
    queryFn: () => fetchAirplanes(currentPage),
  });

  const totalPages = data?.totalPages || 1;
  const allAirplanes = data?.airplanes || [];

  const addAirplaneMutation = useMutation<Airplane, Error, Omit<Airplane, 'airplane_id'>>({
    mutationFn: addAirplane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airplanes'] });
      toast.success('Airplane added successfully');
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error('Error adding airplane');
    },
  });

  const editAirplaneMutation = useMutation<Airplane, Error, Airplane>({
    mutationFn: editAirplane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airplanes'] });
      toast.success('Airplane edited successfully');
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error('Error editing airplane');
    },
  });

  const deleteAirplaneMutation = useMutation<void, Error, string>({
    mutationFn: deleteAirplane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airplanes'] });
      toast.success('Airplane deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting airplane');
    },
  });

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
    setCurrentAirplane(null);
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    console.error(error);
    toast.error('Error fetching airplanes');
    return <ErrorMessage message='Error fetching airplanes' />;
  }

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
                        onClick={() => deleteAirplaneMutation.mutate(airplane.airplane_id)}
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

      {/* Add Airplane Modal */}
      <AirplaneAddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={(airplaneData: Omit<Airplane, 'airplane_id'>) =>
          addAirplaneMutation.mutate(airplaneData)
        }
      />

      {/* Edit Airplane Modal */}
      {currentAirplane && (
        <AirplaneEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          airplaneData={currentAirplane}
          onSubmit={(updatedAirplane: Airplane) => editAirplaneMutation.mutate(updatedAirplane)}
        />
      )}
    </div>
  );
};

export default AdminAirplane;
