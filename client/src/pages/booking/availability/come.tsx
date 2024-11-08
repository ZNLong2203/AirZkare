/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Clock, Plane, ArrowRight, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import axios from "axios";
import API from "@/constants/api";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import LoadingQuery from "@/components/common/LoadingQuery";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import { FlightWithDA } from "@/schemas/Flight";
import FlightInfoBar from "@/components/flight/FlightInfoBar";
import FlightUpgradeModal from "@/components/booking/ClassChoosing";

const fetchFlights = async (params: any): Promise<FlightWithDA[]> => {
  const res = await axios.get(`${API.FLIGHT}`, { params });
  return res.data.metadata.flights;
};

const SeatRibbon: React.FC<{ seats: number; type: 'economy' | 'business' }> = ({ seats, type }) => {
  const bgColor = type === 'economy' ? 'bg-teal-600' : 'bg-yellow-600';
  const textColor = type === 'economy' ? 'text-white' : 'text-black';

  return (
    <div className={`absolute top-0 right-0 ${bgColor} ${textColor} py-1 px-3 text-xs font-semibold rounded-bl-md`}>
      {seats} seats left
    </div>
  );
};

const FlightDuration: React.FC<{ departure: string; arrival: string }> = ({ departure, arrival }) => {
  const getDuration = (dep: string, arr: string) => {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4 mr-1" />
      {getDuration(departure, arrival)}
    </div>
  );
};

const SelectFlightPage = () => {
  const router = useRouter();
  const setFlightSearch = useFlightSearchStore((state) => state.setFlightSearch);
  const {
    departure_come_airport,
    arrival_come_airport,
    departure_come_time,
    type,
    passengers,
  } = useFlightSearchStore();

  const departureAirportid = departure_come_airport?.airport_id;
  const arrivalAirportid = arrival_come_airport?.airport_id;

  const [sortBy, setSortBy] = useState("departureTime");
  const [stopFilter, setStopFilter] = useState("all");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightWithDA | null>(null);

  const searchParams = {
    page: "1",
    departure_airport: departureAirportid,
    arrival_airport: arrivalAirportid,
    departure_time: departure_come_time?.toISOString() || "",
    passengers: passengers?.toString(),
  };
  
  const { data, isLoading, isError, error } = useQuery<FlightWithDA[], Error>({
    queryKey: ["flights_come", searchParams],
    queryFn: () => fetchFlights(searchParams), 
  });

  const flights = data || [];

  const sortedFilteredFlights = useMemo(() => {
    let filteredFlights = [...flights];

    if (stopFilter === "non-stop") {
      filteredFlights = filteredFlights.filter((flight) => flight.type === "non-stop");
    } else if (stopFilter === "connecting") {
      filteredFlights = filteredFlights.filter((flight) => flight.type === "connecting");
    }
  
    if (sortBy === "price_economy") {
      filteredFlights.sort((a, b) => a.price_economy - b.price_economy);
    } else if (sortBy === "price_business") {
      filteredFlights.sort((a, b) => a.price_business - b.price_business);
    } else if (sortBy === "departureTime") {
      filteredFlights.sort(
        (a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      );
    } else if (sortBy === "duration") {
      filteredFlights.sort(
        (a, b) =>
          new Date(a.arrival_time).getTime() -
          new Date(a.departure_time).getTime() -
          (new Date(b.arrival_time).getTime() - new Date(b.departure_time).getTime())
      );
    }
  
    return filteredFlights;
  }, [flights, sortBy, stopFilter]);
  

  const handleSortChange = (value: string) => setSortBy(value);
  const handleStopFilterChange = (value: string) => setStopFilter(value);
  const handleSelectFlight = (flight: FlightWithDA) => setSelectedFlight(flight);

  useEffect(() => {
    localStorage.removeItem("flightSearchState");
  }, []);  

  useEffect(() => {
    if (selectedFlight) {
      setIsUpgradeModalOpen(true);
    }
  }, [selectedFlight]);

  const handleBusiness = (flight_id: string) => {
    setIsUpgradeModalOpen(false);
    setFlightSearch({ 
      class_come: "business",
      airplane_come: selectedFlight?.airplane,
      flight_come: selectedFlight ?? undefined,
      flight_come_id: flight_id, 
      total_price: (selectedFlight?.price_business ?? 0) * passengers,
    });
    if(type === "oneWay") {
      router.push(`/booking/passengerdetails?${selectedFlight?.flight_id}`);
    } else {
      router.push(`/booking/availability/return`);
    }
  };

  const handleKeepEconomy = (flight_id: string) => {
    setIsUpgradeModalOpen(false);
    setFlightSearch({ 
      class_come: "economy",
      airplane_come: selectedFlight?.airplane,
      flight_come: selectedFlight ?? undefined,
      flight_come_id: flight_id, 
      total_price: (selectedFlight?.price_economy ?? 0) * passengers,
    });
    if(type === "oneWay") {
      router.push(`/booking/passengerdetails?${selectedFlight?.flight_id}`);
    } else {
      router.push(`/booking/availability/return`);
    }
  }

  const handleClose = () => {
    setSelectedFlight(null);
    setIsUpgradeModalOpen(false);
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    toast.error(`Error fetching flights: ${error.message}`);
    return <ErrorMessage message={`Error fetching flights: ${error.message}`} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        <FlightInfoBar />
         {/* Flight Type and Route Information */}
         <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full p-2">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Departure Flight</h2>
                <p className="text-gray-600">Select your outbound flight</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-lg text-gray-700">
              <span className="font-semibold">{departure_come_airport?.location}</span>
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">{arrival_come_airport?.location}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select onValueChange={handleSortChange} value={sortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_economy">Lowest Economy Price</SelectItem>
              <SelectItem value="price_business">Lowest Business Price</SelectItem>
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

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sortedFilteredFlights.map((flight) => (
            <motion.div
              key={flight.flight_id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    {/* Flight Information */}
                    <div className="p-6 bg-white flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {new Date(flight.departure_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.airport_flight_departure_airportToairport.code}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Plane className="text-gray-400 w-6 h-6 rotate-90" />
                        <div className="text-xs text-gray-500 mt-1">
                          {flight.type === "non-stop" ? "Non-stop" : `${flight.type} stops`}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {new Date(flight.arrival_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.airport_flight_arrival_airportToairport.code}
                        </div>
                      </div>
                    </div>
                    {/* Airplane Code, Duration, and Additional Info */}
                    <div className="p-6 bg-white border-l border-gray-200 flex flex-col justify-center">
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">{flight.code}</span> operated by {flight.airplane.name}
                      </div>
                      <FlightDuration departure={flight.departure_time.toString()} arrival={flight.arrival_time.toString()} />
                      <div className="mt-4 text-xs text-gray-400">
                        <div className="mb-1">Aircraft: {flight.airplane.model}</div>
                        <div>In-flight entertainment available</div>
                      </div>
                    </div>
                    {/* Economy Class */}
                    <div
                      className="bg-teal-700 text-white p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 hover:bg-teal-800 relative"
                      onClick={() => handleSelectFlight(flight)}
                    >
                      <SeatRibbon seats={flight.availableEconomySeats} type="economy" />
                      <div className="text-lg font-semibold mb-2">ECONOMY</div>
                      <div className="text-3xl font-bold mb-1">
                        {flight.price_economy.toLocaleString()} VND
                      </div>
                      <div className="text-sm mb-4">per passenger</div>
                      <Button variant="secondary" className="w-full">
                        Select <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    {/* Business Class */}
                    <div
                      className="bg-yellow-500 text-black p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 hover:bg-yellow-700 relative"
                      onClick={() => handleBusiness(flight.flight_id)}
                    >
                      <SeatRibbon seats={flight.availableBusinessSeats} type="business" />
                      <div className="text-lg font-semibold mb-2">BUSINESS</div>
                      <div className="text-3xl font-bold mb-1">
                        {flight.price_business.toLocaleString()} VND
                      </div>
                      <div className="text-sm mb-4">per passenger</div>
                      <Button variant="secondary" className="w-full">
                        Select <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <FlightUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={handleClose}
          onConfirmUpgrade={() => selectedFlight && handleBusiness(selectedFlight.flight_id)}
          onKeepCurrent={() => selectedFlight && handleKeepEconomy(selectedFlight.flight_id)}
          flightEconomyPrice={selectedFlight?.price_economy}
          flightBusinessPrice={selectedFlight?.price_business}
        />
      </div>
    </div>
  );
}

export default SelectFlightPage;