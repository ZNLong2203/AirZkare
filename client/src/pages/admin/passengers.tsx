import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { Passenger } from '@/schemas/Passenger';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import API from '@/constants/api';
import PassengerDetailsModal from '@/components/passenger/PassengerDetailsModal';
import Pagination from '@/components/common/Pagination';
import ErrorMessage from '@/components/common/ErrorMessageQuery';
import LoadingQuery from '@/components/common/LoadingQuery';

interface PassengerResponse {
  passengers: Passenger[];
  totalPages: number;
}

const fetchPassengers = async (page: number): Promise<PassengerResponse> => {
  const res = await axios.get(`${API.PASSENGER}?page=${page}`, {
    withCredentials: true,
  });
  return res.data.metadata;
};

const fetchPassengerDetails = async (user_id: string): Promise<Passenger> => {
  const res = await axios.get(`${API.PASSENGER}/${user_id}`, {
    withCredentials: true,
  });
  return {
    ...res.data.metadata,
    ...res.data.metadata.user,
  };
};

const deletePassenger = async (user_id: string): Promise<void> => {
  await axios.delete(`${API.PASSENGER}/${user_id}`, {
    withCredentials: true,
  });
};

const AdminPassengers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isLoading,
  } = useQuery<PassengerResponse, Error>({
    queryKey: ['passengers', currentPage],
    queryFn: () => fetchPassengers(currentPage),
  });

  const totalPages = data?.totalPages || 1;
  const allPassengers = data?.passengers || [];

  const deletePassengerMutation = useMutation<void, Error, string>({
    mutationFn: deletePassenger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
      toast.success('Passenger deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting passenger');
    },
  });

  const {
    data: selectedPassenger,
  } = useQuery<Passenger, Error>({
    queryKey: ['passenger', selectedPassengerId],
    queryFn: () => fetchPassengerDetails(selectedPassengerId!),
    enabled: !!selectedPassengerId,
  });

  const handleDeletePassenger = (user_id: string) => {
    deletePassengerMutation.mutate(user_id);
  };

  const handleViewPassenger = (user_id: string) => {
    setSelectedPassengerId(user_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPassengerId(null);
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    console.error(error);
    toast.error('Error fetching passengers');
    return <ErrorMessage message="Error fetching passengers." />;
  }

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
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Customer ID
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-medium">
                  Actions
                </th>
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
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </main>

      {/* Passenger Details Modal */}
      {selectedPassenger && (
        <PassengerDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          passenger={selectedPassenger}
        />
      )}
    </div>
  );
};

export default AdminPassengers;
