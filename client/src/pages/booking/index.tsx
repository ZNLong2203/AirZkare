import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon, Users } from 'lucide-react';

import axiosInstance from "@/configs/axios-customize";
import API from "@/constants/api";
import { Airport } from "@/schemas/Airport";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import LoadingQuery from "@/components/common/LoadingQuery";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationPopup } from "@/components/common/Location-popup";

interface AirportResponse {
  airports: Airport[];
  totalPages: number;
}

const fetchAirports = async () => {
  const res = await axiosInstance.get(`${API.AIRPORT}`, { withCredentials: true });
  return res.data.metadata;
}

const FlightBooking = () => {
  const router = useRouter();
  const setFlightSearch = useFlightSearchStore((state) => state.setFlightSearch);
  
  const [tripType, setTripType] = useState("roundTrip");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
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

    const originAirport = allAirports.find(a => a.airport_id === origin);
    const destinationAirport = allAirports.find(a => a.airport_id === destination);

    if (!originAirport || !destinationAirport) {
      toast.error("Invalid airport selection");
      return;
    }

    const flightSearchData = {
      departure_come_airport: {
        airport_id: originAirport.airport_id,
        name: originAirport.location,
        code: originAirport.code,
        location: originAirport.location,
      },
      arrival_come_airport: {
        airport_id: destinationAirport.airport_id,
        name: destinationAirport.location,
        code: destinationAirport.code,
        location: destinationAirport.location,
      },
      departure_time: departDate,
      type: tripType,
      passengers: Number(passengers),
      departure_return_airport: {
        airport_id: "",
        name: "",
        code: "",
        location: "",
      },
      arrival_return_airport: {
        airport_id: "",
        name: "",
        code: "",
        location: "",
      },
      arrival_time: null as Date | null,
    };
  
    if (tripType === "roundTrip") {
      flightSearchData.departure_return_airport = {
        airport_id: destinationAirport.airport_id,
        name: destinationAirport.location,
        code: destinationAirport.code,
        location: destinationAirport.location,
      };
      flightSearchData.arrival_return_airport = {
        airport_id: originAirport.airport_id,
        name: originAirport.location,
        code: originAirport.code,
        location: originAirport.location,
      };
      flightSearchData.arrival_time = returnDate || null;
    }
  
    setFlightSearch(flightSearchData);
    router.push(`/booking/availability/come`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4 pt-20">
        {/* Hero Section */}
        <div className="relative h-80 rounded-lg overflow-hidden shadow-2xl mb-10">
          <Image
            src="/ZkareLogo.png"
            alt="Airplane in the sky"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-5xl font-bold mb-4">Discover Your Next Journey</h1>
            <p className="text-xl">Book your flight today and embark on a new adventure</p>
          </div>
        </div>

        {/* Flight Booking Form */}
        <Card className="w-full max-w-4xl mx-auto mt-10 shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-3xl font-bold">Book Your Flight</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Origin Field */}
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <LocationPopup
                    locations={allAirports}
                    value={origin}
                    onChange={setOrigin}
                    placeholder="Select Origin"
                    isLoading={isLoading}
                    isError={isError}
                  />
                </div>

                {/* Destination Field */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <LocationPopup
                    locations={allAirports}
                    value={destination}
                    onChange={setDestination}
                    placeholder="Select Destination"
                    isLoading={isLoading}
                    isError={isError}
                  />
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <Button type="submit" className="w-full text-lg py-6">
                Search Flights
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Information Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Flexible Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enjoy peace of mind with our flexible booking options. Change your travel dates without fees.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our customer support team is available round the clock to assist you with any queries.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Best Price Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Find a lower price? We&apos;ll match it and give you an additional 10% off your booking.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FlightBooking;
