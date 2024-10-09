import React, { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAirplanes = useMemo(() => {
    return allAirplanes.filter(airplane => 
      airplane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airplane.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAirplanes, searchTerm]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <AiOutlinePlus className="mr-2" /> Add New Airplane
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search airplanes by name or model..."
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Class</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Economy Class</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAirplanes.map((airplane) => (
                <tr key={airplane.airplane_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{airplane.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{airplane.model}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{airplane.total_business} seats</td>
                  <td className="px-4 py-2 whitespace-nowrap">{airplane.total_economy} seats</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => {
                          setCurrentAirplane(airplane);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <AiOutlineEdit className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => deleteAirplaneMutation.mutate(airplane.airplane_id)}
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

        {filteredAirplanes.length === 0 && (
          <div className="text-center mt-4 text-gray-500">
            No airplanes found matching your search.
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

      <AirplaneAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(airplaneData: Omit<Airplane, 'airplane_id'>) =>
          addAirplaneMutation.mutate(airplaneData)
        }
      />

      {currentAirplane && (
        <AirplaneEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentAirplane(null);
          }}
          airplaneData={currentAirplane}
          onSubmit={(updatedAirplane: Airplane) => editAirplaneMutation.mutate(updatedAirplane)}
        />
      )}
    </div>
  );
};

export default AdminAirplane;