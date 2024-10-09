import React, { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

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
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPassengers = useMemo(() => {
    return allPassengers.filter(passenger => 
      passenger.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPassengers, searchTerm]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <AiOutlinePlus className="mr-2" /> Add New Customer
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search passengers by name, email, or ID..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPassengers.map((passenger) => (
                <tr key={passenger.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{passenger.user_id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{passenger.username}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{passenger.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{passenger.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleViewPassenger(passenger.user_id)}
                      >
                        <AiOutlineEye className="mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeletePassenger(passenger.user_id)}
                      >
                        <AiOutlineDelete className="mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPassengers.length === 0 && (
          <div className="text-center mt-4 text-gray-500">
            No passengers found matching your search.
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </main>

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