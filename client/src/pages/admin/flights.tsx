import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { Flight, FlightWithDA, FlightWithoutId } from "@/schemas/Flight";
import API from "@/constants/api";
import SideBarAdmin from "@/components/common/SideBarAdmin";
import FlightAddModal from "@/components/flight/FlightAdminAddModal";
import FlightEditModal from "@/components/flight/FlightAdminEditModal";
import FlightDetailsModal from "@/components/flight/FlightAdminViewModal";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "@/components/common/LoadingQuery";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

interface FlightResponse {
  flights: FlightWithDA[];
  totalPages: number;
}

const fetchFlights = async (page: number): Promise<FlightResponse> => {
  const res = await axios.get(`${API.FLIGHT}?page=${page}`, {
    withCredentials: true,
  });
  return res.data.metadata;
};

const addFlight = async (flight: FlightWithoutId): Promise<Flight> => {
  const res = await axios.post(`${API.FLIGHT}`, flight, {
    withCredentials: true,
  });
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentFlightWithDA, setCurrentFlightWithDA] =
    useState<FlightWithDA | null>(null);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data, error, isError, isLoading } = useQuery<FlightResponse, Error>({
    queryKey: ["flights", currentPage],
    queryFn: () => fetchFlights(currentPage),
  });

  const totalPages = data?.totalPages || 1;
  const filteredFlights = useMemo(() => {
    const allFlights = data?.flights || [];
    return allFlights.filter(
      (flight) =>
        flight.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airplane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airport_flight_departure_airportToairport?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        flight.airport_flight_arrival_airportToairport?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        flight.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.flights, searchTerm]);

  const addFlightMutation = useMutation<Flight, Error, FlightWithoutId>({
    mutationFn: addFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Flight added successfully");
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error("Error adding flight");
    },
  });

  const editFlightMutation = useMutation<Flight, Error, Flight>({
    mutationFn: editFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Flight edited successfully");
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error("Error editing flight");
    },
  });

  const deleteFlightMutation = useMutation<void, Error, string>({
    mutationFn: deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Flight deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting flight");
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

  const openViewModal = (flight: FlightWithDA) => {
    setCurrentFlightWithDA(flight);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentFlightWithDA(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    console.error(error);
    return <ErrorMessage message="Error fetching flights." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Flights</h1>
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <AiOutlinePlus className="mr-2" /> Add New Flight
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search flights by code, airplane, airports, or status..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flight List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Airplane</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow key={flight.flight_id}>
                    <TableCell className="font-medium">{flight.code}</TableCell>
                    <TableCell>{flight.airplane.name}</TableCell>
                    <TableCell className="capitalize">{flight.type}</TableCell>
                    <TableCell>{flight.airport_flight_departure_airportToairport?.name}</TableCell>
                    <TableCell>{flight.airport_flight_arrival_airportToairport?.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={() => openViewModal(flight)}
                        >
                          <AiOutlineEye className="mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={() => openEditModal(flight)}
                        >
                          <AiOutlineEdit className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => deleteFlightMutation.mutate(flight.flight_id)}
                        >
                          <AiOutlineDelete className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredFlights.length === 0 && (
              <div className="text-center mt-4 text-gray-500">
                No flights found matching your search.
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

      <FlightAddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={(flightData: FlightWithoutId) =>
          addFlightMutation.mutate(flightData)
        }
      />

      {currentFlight && (
        <FlightEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          flightData={currentFlight}
          onSubmit={(updatedFlight: Flight) =>
            editFlightMutation.mutate(updatedFlight)
          }
        />
      )}

      {currentFlightWithDA && (
        <FlightDetailsModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          flightData={currentFlightWithDA}
        />
      )}
    </div>
  );
};

export default AdminFlights;