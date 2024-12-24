import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from "@/configs/axios-customize";
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AirportResponse {
  airports: Airport[];
  totalPages: number;
}

const fetchAirports = async (page: number): Promise<AirportResponse> => {
  const res = await axiosInstance.get(`${API.AIRPORT}?page=${page}`, { withCredentials: true });
  return res.data.metadata;
}

const addAirport = async (airport: Omit<Airport, 'airport_id'>): Promise<Airport> => {
  const res = await axiosInstance.post(`${API.AIRPORT}`, airport, { withCredentials: true });
  return res.data;
}

const editAirport = async (airport: Airport): Promise<Airport> => {
  const res = await axiosInstance.patch(`${API.AIRPORT}/${airport.airport_id}`, airport, { withCredentials: true });
  return res.data;
}

const deleteAirport = async (airport_id: string): Promise<void> => {
  await axiosInstance.delete(`${API.AIRPORT}/${airport_id}`, { withCredentials: true });
}

const AdminAirports = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAirport, setCurrentAirport] = useState<Airport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
  const filteredAirports = useMemo(() => {
    const allAirports = data?.airports || [];
    return allAirports.filter(airport => 
      airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.airports, searchTerm]);

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
    setCurrentAirport(null);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    console.error(error);
    toast.error('Error fetching airports');
    return <ErrorMessage message='Error fetching airports' />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Airports</h1>
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <AiOutlinePlus className="mr-2" /> Add New Airport
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Airports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search airports by code, name, or location..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Airport List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Airport Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAirports.map((airport) => (
                  <TableRow key={airport.airport_id}>
                    <TableCell>{airport.code}</TableCell>
                    <TableCell>{airport.name}</TableCell>
                    <TableCell>{airport.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={() => openEditModal(airport)}
                        >
                          <AiOutlineEdit className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => deleteAirportMutation.mutate(airport.airport_id)}
                        >
                          <AiOutlineDelete className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAirports.length === 0 && (
              <div className="text-center mt-4 text-gray-500">
                No airports found matching your search.
              </div>
            )}

          </CardContent>
        </Card>
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