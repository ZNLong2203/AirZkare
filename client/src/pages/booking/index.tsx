import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function FlightBooking() {
  const [tripType, setTripType] = useState("roundTrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the flight search API here
    console.log("Searching for flights with the following information:", {
      tripType,
      origin,
      destination,
      departDate,
      returnDate,
      passengers,
    });
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
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <div className="relative">
                  <Plane className="absolute left-2 top-3 h-4 w-4 opacity-50 ml-2" />
                  <Input
                    id="origin"
                    placeholder="City or Airport"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <Plane className="absolute left-2 top-3 h-4 w-4 opacity-50 ml-2" />
                  <Input
                    id="destination"
                    placeholder="City or Airport"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

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