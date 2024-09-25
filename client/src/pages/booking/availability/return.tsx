/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

const initialFlights = [
  {
    id: 1,
    departure: { time: "09:05", code: "HAN" },
    arrival: { time: "11:15", code: "PQC" },
    duration: "2 hours 10 minutes",
    durationMinutes: 130,
    flightNumber: "VN 1237",
    airline: "Vietnam Airlines",
    economyPrice: 1670000,
    businessPrice: 5428000,
    seatsLeft: 4,
    stops: 0,
  },
  {
    id: 2,
    departure: { time: "11:05", code: "HAN" },
    arrival: { time: "13:20", code: "PQC" },
    duration: "2 hours 15 minutes",
    durationMinutes: 135,
    flightNumber: "VN 1239",
    airline: "Vietnam Airlines",
    economyPrice: 1670000,
    businessPrice: 5428000,
    seatsLeft: 6,
    stops: 0,
  },
  {
    id: 3,
    departure: { time: "05:00", code: "HAN" },
    arrival: { time: "09:30", code: "PQC" },
    duration: "4 hours 30 minutes",
    durationMinutes: 270,
    stopover: { code: "SGN", duration: "1 hour 15 minutes" },
    flightNumber: "VN 205",
    airline: "Vietnam Airlines",
    codeshare: { flightNumber: "VN 6101", airline: "Pacific Airlines" },
    economyPrice: 3015000,
    businessPrice: 6890000,
    seatsLeft: 6,
    stops: 1,
  },
];

const SelectFlightPage: React.FC = () => {
  // const router = useRouter();
  const [flights, setFlights] = useState(initialFlights);
  const [sortBy, setSortBy] = useState("departureTime");
  const [stopFilter, setStopFilter] = useState("all");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); 
  const [selectedFlight, setSelectedFlight] = useState(null);

  const sortFlights = (criteria: string) => {
    const sortedFlights = [...flights].sort((a, b) => {
      switch (criteria) {
        case "price":
          return a.economyPrice - b.economyPrice;
        case "departureTime":
          return a.departure.time.localeCompare(b.departure.time);
        case "duration":
          return a.durationMinutes - b.durationMinutes;
        default:
          return 0;
      }
    });
    setFlights(sortedFlights);
  };

  const filterFlights = (stops: string) => {
    if (stops === "all") {
      setFlights(initialFlights);
    } else {
      const filteredFlights = initialFlights.filter((flight) =>
        stops === "nonstop" ? flight.stops === 0 : flight.stops > 0
      );
      setFlights(filteredFlights);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    sortFlights(value);
  };

  const handleStopFilterChange = (value: string) => {
    setStopFilter(value);
    filterFlights(value);
  };

  const handleSelectFlight = (flight: any) => {
    setSelectedFlight(flight);
    setIsUpgradeModalOpen(true); 
  };

  const handleConfirmUpgrade = () => {
    console.log("Upgrade confirmed for flight:", selectedFlight);
    setIsUpgradeModalOpen(false);
    // router.push(`/checkout?flightId=${selectedFlight?.id}`);
  };

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
            <SelectItem value="nonstop">Non-stop</SelectItem>
            <SelectItem value="withstops">With stops</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {flights.map((flight) => (
        <Card key={flight.id} className="w-full">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 flex flex-col justify-between">
                {/* Flight details */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold">{flight.departure.time}</div>
                    <div className="text-sm text-muted-foreground">{flight.departure.code}</div>
                  </div>
                  <div className="text-center">
                    <Plane className="inline-block w-4 h-4 rotate-90" />
                    <div className="text-xs text-muted-foreground">
                      {flight.stops === 0 ? "Non-stop" : `${flight.stops} stops`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{flight.arrival.time}</div>
                    <div className="text-sm text-muted-foreground">{flight.arrival.code}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {flight.duration}
                </div>
                <div className="mt-2 text-sm">
                  <div>
                    {flight.flightNumber} Operated by {flight.airline}
                  </div>
                  {flight.codeshare && (
                    <div>
                      {flight.codeshare.flightNumber} Operated by {flight.codeshare.airline}
                    </div>
                  )}
                </div>
              </div>
              {/* Economy class selection */}
              <div
                className="bg-teal-800 text-white p-4 flex flex-col justify-between cursor-pointer"
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="text-lg font-bold">ECONOMY</div>
                <div className="text-2xl font-bold">from {flight.economyPrice.toLocaleString()} VND</div>
                <div className="text-sm">per passenger</div>
                <Button variant="secondary" className="mt-2">
                  Select
                </Button>
                <div className="mt-2 text-sm">{flight.seatsLeft} seats left</div>
              </div>
              {/* Business class selection */}
              <div
                className="bg-yellow-500 text-black p-4 flex flex-col justify-between cursor-pointer"
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="text-lg font-bold">BUSINESS</div>
                <div className="text-2xl font-bold">from {flight.businessPrice.toLocaleString()} VND</div>
                <div className="text-sm">per passenger</div>
                <Button variant="secondary" className="mt-2">
                  Select
                </Button>
                <div className="mt-2 text-sm">{flight.seatsLeft} seats left</div>
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