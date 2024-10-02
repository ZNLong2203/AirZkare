import { useState } from "react";
import axios from "axios";
import API from "@/constants/api";
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { Airport } from "@/schemas/Airport";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import LoadingQuery from "@/components/common/LoadingQuery";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, CalendarIcon, Users } from "lucide-react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter } from "next/router";

interface AirportResponse {
  airports: Airport[];
  totalPages: number;
}

const fetchAirports = async () => {
  const res = await axios.get(`${API.AIRPORT}`, { withCredentials: true });
  return res.data.metadata;
}

const FlightBooking = () => {
  const router = useRouter();
  const setFlightSearch = useFlightSearchStore((state) => state.setFlightSearch);
  const [tripType, setTripType] = useState("roundTrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState("1");

  const { data, isError, isLoading } = useQuery<AirportResponse, Error>({
    queryKey: ["airports"],
    queryFn: () => fetchAirports(),
  });

  const allAirports = data?.airports || [];

  if (isLoading) return <LoadingQuery />;
  if (isError) {
    toast.error('Error fetching airports');
    return <ErrorMessage message='Error fetching airports' />;
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin || !destination || !departDate) {
      toast.error("Please fill in all fields");
      return;
    }

    if(tripType === "roundTrip") {
      setFlightSearch({
        departure_come_airport: origin,
        arrival_come_airport: destination,
        departure_come_time: departDate,

        departure_return_airport: destination,
        arrival_return_airport: origin,
        departure_return_time: returnDate,

        type: tripType,
        passengers,
      });
    } else {
      setFlightSearch({
        departure_come_airport: origin,
        arrival_come_airport: destination,
        departure_come_time: departDate,
        
        type: tripType,
        passengers,
      });
    }

    router.push(`/booking/availability/come`);
  };

  return (
    <div className="min-h-screen container mx-auto p-4 mt-20">
      {/* Hero Section */}
      <div className="relative h-64 rounded-md overflow-hidden">
        <Image
          src="/ZkareLogo.png"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white">
            Discover Your Next Journey
          </h1>
        </div>
      </div>

      {/* Flight Booking Form */}
      <Card className="w-full max-w-4xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Book a Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <RadioGroup
              defaultValue="roundTrip"
              onValueChange={setTripType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roundTrip" id="roundTrip" />
                <Label htmlFor="roundTrip">Round Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneWay" id="oneWay" />
                <Label htmlFor="oneWay">One Way</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin Field */}
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <div className="relative">
                  <Plane className="absolute left-2 top-3 h-4 w-4 opacity-50 ml-2" />
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="origin" className="pl-10">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAirports.map((airport) => (
                        <SelectItem key={airport.airport_id} value={airport.airport_id}>
                          {airport.location}, ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Destination Field */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <Plane className="absolute left-2 top-3 h-4 w-4 opacity-50 ml-2" />
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination" className="pl-10">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAirports.map((airport) => (
                        <SelectItem key={airport.airport_id} value={airport.airport_id}>
                          {airport.location}, ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departDate">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !departDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departDate ? format(departDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departDate}
                      onSelect={setDepartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {tripType === "roundTrip" && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !returnDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Passengers Field */}
            <div className="space-y-2">
              <Label htmlFor="passengers">Number of Passengers</Label>
              <div className="relative">
                <Users className="absolute left-2 top-3 h-4 w-4 opacity-50 ml-2" />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger id="passengers" className="pl-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Search Flights
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FlightBooking;
