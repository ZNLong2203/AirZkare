import React, { useState, useEffect } from "react";
import {
  FaSuitcase,
  FaShoppingCart,
  // FaHotel,
  FaShieldAlt,
  FaEllipsisH,
  FaExchangeAlt,
  FaPlane,
} from "react-icons/fa";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Star, CreditCard, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { SelectRangeEventHandler } from "react-day-picker";

interface PopularRoute {
  name: string;
  image: string;
}

interface IndexProps {
  className?: string;
}

const popularRoutes: PopularRoute[] = [
  {
    name: "Madrid",
    image: "/Madrid.jfif",
  },
  {
    name: "Oslo",
    image: "/Oslo.jfif",
  },
  {
    name: "Paris",
    image: "/Paris.jpg",
  },
  {
    name: "Germany",
    image: "/Germany.jfif",
  },
];

const Index: React.FC<IndexProps> = () => {
  const router = useRouter();
  const [date, setDate] = useState<DateRange>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [departure, setDeparture] = useState("Ha Noi");
  const [arrival, setArrival] = useState("Paris");

  const handleSwapLocations = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  useEffect(() => {
    const token = router.query.token as string;
    const user_id = router.query.user_id as string;
    const expire = router.query.expire as string;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("expire", expire);
      router.push("/").then(() => {
        window.location.reload();
      });
    }
  }, [router.query.token, router]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full">
        <div className="relative w-full h-72">
          <Image
            src="/AirlineBanner.jpg"
            alt="Airline Banner"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            className="rounded-b-lg shadow-lg"
          />
        </div>

        <div className="relative flex justify-center mt-[-40px]">
          <div
            className="bg-white rounded-full shadow-lg px-8 py-2 flex items-center space-x-4 cursor-pointer"
            onClick={() => router.push("/booking")}
          >
            <FaPlane className="text-blue-500 text-3xl pt-1" />
            <h1 className="text-blue-500 text-2xl font-bold">Booking Flight</h1>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="mt-8 w-full flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-5/6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Departure
              </label>
              <div className="relative">
                <FaPlane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="pl-10"
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">
                Arrival
              </label>
              <div className="relative">
                <FaPlane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="pl-10"
                  placeholder="Enter city"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-8 transform translate-x-1/2 -translate-y-1/2 rounded-full"
                onClick={handleSwapLocations}
              >
                <FaExchangeAlt className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {/* <CalendarIcon className="h-4 w-4" /> */}
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate as SelectRangeEventHandler}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 flex items-end">
              <Button
                className="w-full"
                onClick={() => router.push("/booking/availability/come")}
              >
                Search Flights
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="mt-8 w-full flex justify-center">
        <div className="flex space-x-4 bg-gray-100 py-2 px-4 rounded-lg shadow-lg">
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push("/utilities/luggage")}
          >
            <FaSuitcase className="text-xl" />
            <span>Luggage</span>
          </button>
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push("/utilities/shopping")}
          >
            <FaShoppingCart className="text-xl" />
            <span>Shopping</span>
          </button>
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push("/utilities/insurance")}
          >
            <FaShieldAlt className="text-xl" />
            <span>Insurance</span>
          </button>
          <button className="text-blue-600 font-semibold flex items-center space-x-2">
            <FaEllipsisH className="text-xl" />
            <span>Other</span>
          </button>
        </div>
      </section>

      <h2 className="text-3xl font-bold m-10">Popular Routes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {popularRoutes.map((route) => (
          <div
            key={route.name}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-56 w-44">
              <Image
                src={route.image}
                alt={route.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-xl font-semibold">{route.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold mb-2">
            Guarantee of the best price
          </h3>
          <p className="text-gray-600">
            We offer only the best deals, if you find the same flight cheaper
            elsewhere, contact us!
          </p>
        </div>
        <div className="text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold mb-2">
            Refunds & cancellations
          </h3>
          <p className="text-gray-600">
            Your flight got cancelled? We have you covered with our instant
            refund services.
          </p>
        </div>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold mb-2">Covid-19 information</h3>
          <p className="text-gray-600">
            Read about all the travel restrictions due to covid-19 that may
            affect your flight.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
