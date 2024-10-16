/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import API from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import LoadingQuery from "@/components/common/LoadingQuery";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import { FlightWithDA } from "@/schemas/Flight";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plane } from "lucide-react";
import FlightInfoBar from "@/components/flight/FlightInfoBar";
// import { useRouter } from 'next/router';
import FlightUpgradeModal from "@/components/booking/FlightUpgradeModal";

const fetchFlights = async (params: any): Promise<FlightWithDA[]> => {
  const res = await axios.get(`${API.FLIGHT}`, { params });
  console.log("API response:", res.data);
  return res.data.metadata.flights;
};

const SelectFlightPage: React.FC = () => {
  // const router = useRouter();
  const {
    departure_come_airport,
    arrival_come_airport,
    departure_come_time,
    passengers,
  } = useFlightSearchStore();

  const [sortBy, setSortBy] = useState("departureTime");
  const [stopFilter, setStopFilter] = useState("all");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightWithDA | null>(
    null
  );

  // Build search parameters
  const searchParams = {
    page: "1",
    departure_airport: departure_come_airport,
    arrival_airport: arrival_come_airport,
    departure_time: departure_come_time?.toISOString() || "",
    passengers: passengers?.toString(),
  };
  
  // Fetch flights using useQuery
  const { data, isLoading, isError, error } = useQuery<FlightWithDA[], Error>({
    queryKey: ["flights_come", searchParams],
    queryFn: () => fetchFlights(searchParams), 
  });

  const flights = data || [];

  // Use useMemo to compute sorted and filtered flights
  const sortedFilteredFlights = useMemo(() => {
    let filteredFlights = [...flights];

    // Filter flights based on stops
    if (stopFilter === "non-stop") {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.type === "non-stop"
      );
    } else if (stopFilter === "connecting") {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.type === "connecting"
      );
    }

    // Sort flights based on selected criteria
    if (sortBy === "price") {
      filteredFlights.sort((a, b) => a.price_economy - b.price_economy);
    } else if (sortBy === "departureTime") {
      filteredFlights.sort(
        (a, b) =>
          new Date(a.departure_time).getTime() -
          new Date(b.departure_time).getTime()
      );
    } else if (sortBy === "duration") {
      filteredFlights.sort(
        (a, b) =>
          new Date(a.arrival_time).getTime() -
            new Date(a.departure_time).getTime() -
          (new Date(b.arrival_time).getTime() -
            new Date(b.departure_time).getTime())
      );
    }

    return filteredFlights;
  }, [flights, sortBy, stopFilter]);

  // Handlers
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleStopFilterChange = (value: string) => {
    setStopFilter(value);
  };

  const handleSelectFlight = (flight: FlightWithDA) => {
    setSelectedFlight(flight);
  };

  useEffect(() => {
    if (selectedFlight) {
      setIsUpgradeModalOpen(true);
    }
  }, [selectedFlight]);

  const handleConfirmUpgrade = () => {
    console.log("Upgrade confirmed for flight:", selectedFlight);
    setIsUpgradeModalOpen(false);
    // router.push(`/checkout?flightId=${selectedFlight?.flight_id}`);
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    toast.error(`Error fetching flights: ${error.message}`);
    return <ErrorMessage message={`Error fetching flights: ${error.message}`} />;
  }

  return (
    <div className="min-h-screen container mx-auto p-2 space-y-4">
      <FlightInfoBar />
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Select onValueChange={handleSortChange} value={sortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Lowest price</SelectItem>
            <SelectItem value="departureTime">Departure time</SelectItem>
            <SelectItem value="duration">Flight duration</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleStopFilterChange} value={stopFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Number of stops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All flights</SelectItem>
            <SelectItem value="non-stop">Non-stop</SelectItem>
            <SelectItem value="connecting">With stops</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sortedFilteredFlights.map((flight) => (
        <Card key={flight.flight_id} className="w-full">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 flex flex-col justify-between">
                {/* Flight details */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold">
                      {new Date(flight.departure_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.code}
                    </div>
                  </div>
                  <div className="text-center">
                    <Plane className="inline-block w-4 h-4 rotate-90" />
                    <div className="text-xs text-muted-foreground">
                      {flight.type === "non-stop"
                        ? "Non-stop"
                        : `${flight.type} stops`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {new Date(flight.arrival_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.airport_flight_departure_airportToairport.code}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(flight.arrival_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="mt-2 text-sm">
                  <div>
                    {flight.flight_id} Operated by {flight.airplane.name}
                  </div>
                </div>
              </div>
              {/* Economy class selection */}
              <div
                className="bg-teal-800 text-white p-4 flex flex-col justify-between cursor-pointer"
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="text-lg font-bold">ECONOMY</div>
                <div className="text-2xl font-bold">
                  from {flight.price_economy.toLocaleString()}$
                </div>
                <div className="text-sm">per passenger</div>
                <Button variant="secondary" className="mt-2">
                  Select
                </Button>
              </div>
              {/* Business class selection (if applicable) */}
              <div
                className="bg-yellow-500 text-black p-4 flex flex-col justify-between cursor-pointer"
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="text-lg font-bold">BUSINESS</div>
                <div className="text-2xl font-bold">
                  from {flight.price_business.toLocaleString()}$
                </div>
                <div className="text-sm">per passenger</div>
                <Button variant="secondary" className="mt-2">
                  Select
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {/* Flight Upgrade Modal */}
      <FlightUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
};

export default SelectFlightPage;
