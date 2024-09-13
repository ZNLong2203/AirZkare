import React, { useState } from "react";
import {
  FaSuitcase,
  FaShoppingCart,
  // FaHotel,
  FaShieldAlt,
  FaEllipsisH,
  FaPlane,
} from "react-icons/fa";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { useRouter } from "next/router";
import { SelectRangeEventHandler } from "react-day-picker";

interface Destination {
  name: string;
  date: string;
  price: string;
  image: string;
}

interface IndexProps {
  className?: string;
}

const Index: React.FC<IndexProps> = ({ className }) => {
  const router = useRouter();
  const [date, setDate] = useState<DateRange>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const destinations: Destination[] = [
    {
      name: "TP. Hồ Chí Minh đến Hà Nội",
      date: "23/09/2024",
      price: "1,540,000 VND",
      image:
        "https://cdn-images.vtv.vn/Uploaded/lanchi/2013_09_19/10-hinh-anh-dac-trung-cua-ha-noi-0.jpg",
    },
    {
      name: "Hà Nội đến TP. Hồ Chí Minh",
      date: "29/09/2024",
      price: "1,540,000 VND",
      image:
        "https://vietair.com.vn/Media/Images/bieu-tuong-nuoc-nhat-2.jpg?p=1&w=412",
    },
    {
      name: "TP. Hồ Chí Minh đến Đà Nẵng",
      date: "10/11/2024",
      price: "1,167,000 VND",
      image: "https://airtour.vn/wp-content/uploads/2019/02/eiffel.jpg",
    },
    {
      name: "Hà Nội đến Đà Nẵng",
      date: "27/10/2024",
      price: "1,153,000 VND",
      image: "https://www.immica.org/uploads/images/hinh-anh-nuoc-my%20(2).jpg",
    },
  ];

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
            onClick={() => router.push("/book")}
          >
            <FaPlane className="text-blue-500 text-3xl pt-1" />
            <h1 className="text-blue-500 text-2xl font-bold">Booking Flight</h1>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="mt-8 w-full flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col sm:flex-row justify-around items-center w-5/6 max-w-4xl">
          <div className="flex flex-col mb-4 sm:mb-0">
            <label className="text-gray-700 font-semibold mb-2">Departure</label>
            <input
              type="text"
              placeholder="Ha Noi"
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col mb-4 sm:mb-0">
            <label className="text-gray-700 font-semibold mb-2">Arrival</label>
            <input
              type="text"
              placeholder="Paris"
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className={cn("grid gap-2", className)}>
            <label className="text-gray-700 font-semibold">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
          <Button className="p-6 mt-6">
            Search
          </Button>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="mt-8 w-full flex justify-center">
        <div className="flex space-x-4 bg-gray-100 py-2 px-4 rounded-lg shadow-lg">
          <button 
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push('/utilities/luggage')}
          >
            <FaSuitcase className="text-xl" />
            <span>Luggage</span>
          </button>
          <button 
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push('/utilities/shopping')}
          >
            <FaShoppingCart className="text-xl" />
            <span>Shopping</span>
          </button>
          <button 
            className="text-blue-600 font-semibold flex items-center space-x-2"
            onClick={() => router.push('/utilities/insurance')}
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

      {/* Destinations Section */}
      <section className="w-full max-w-7xl py-12 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {destinations.map((destination) => (
          <div
            key={destination.name}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                style={{ objectFit: "cover" }}
                className="w-full h-full"
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {destination.name}
              </h2>
              <p className="text-sm text-gray-600">{destination.date}</p>
              <p className="text-lg text-blue-500 font-semibold mt-2">
                {destination.price}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Index;
