import React, { useState, useEffect } from "react"
import axiosInstance from "@/configs/axios-customize"
import API from "@/constants/api"
import { toast } from "react-hot-toast"
import {
  FaSuitcase,
  FaShoppingCart,
  FaShieldAlt,
  FaEllipsisH,
  FaPlane,
  FaUsers,
} from "react-icons/fa"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, CreditCard, AlertCircle, ArrowRightLeft } from 'lucide-react'
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { Airport } from "@/schemas/Airport"
import useFlightSearchStore from "@/store/useFlightSearchStore"
import LoadingQuery from "@/components/common/LoadingQuery"
import ErrorMessage from "@/components/common/ErrorMessageQuery"
import { useRouter } from "next/router"
import { SelectRangeEventHandler } from "react-day-picker"
import { LocationPopup } from "@/components/common/Location-popup"

interface AirportResponse {
  airports: Airport[]
  totalPages: number
}

interface PopularRoute {
  name: string
  image: string
}

interface IndexProps {
  className?: string
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
]

const fetchAirports = async (): Promise<AirportResponse> => {
  const res = await axiosInstance.get(`${API.AIRPORT}`, { withCredentials: true })
  return res.data.metadata
}

const Index: React.FC<IndexProps> = () => {
  const router = useRouter()
  const setFlightSearch = useFlightSearchStore((state) => state.setFlightSearch)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })
  const [departureId, setDepartureId] = useState<string>("")
  const [arrivalId, setArrivalId] = useState<string>("")
  const [passengers, setPassengers] = useState<number>(1)

  useEffect(() => {
    const token = router.query.token as string
    const user_id = router.query.user_id as string
    const expire = router.query.expire as string
    const role = router.query.role as string
    if (token) {
      localStorage.setItem("token", token)
      localStorage.setItem("user_id", user_id)
      localStorage.setItem("role", role)
      localStorage.setItem("expire", expire)
      router.push("/").then(() => {
        window.location.reload()
      })
    }
  }, [router.query.token, router])

  const handleSwapLocations = () => {
    const temp = departureId
    setDepartureId(arrivalId)
    setArrivalId(temp)
  }

  const { data, isError, isLoading } = useQuery<AirportResponse, Error>({
    queryKey: ["airports"],
    queryFn: () => fetchAirports(),
  })

  const allAirports = data?.airports || []

  if (isLoading) return <LoadingQuery />
  if (isError) {
    toast.error('Error fetching airports')
    return <ErrorMessage message='Error fetching airports' />
  }

  const handleSearchFlights = () => {
    if (!departureId || !arrivalId || !date?.from) {
      toast.error("Please fill in all fields")
      return
    }
  
    const departure = allAirports.find(a => a.airport_id === departureId)
    const arrival = allAirports.find(a => a.airport_id === arrivalId)

    if (!departure || !arrival) {
      toast.error("Invalid departure or arrival location")
      return
    }

    const flightSearchData = {
      departure_come_airport: {
        airport_id: departure.airport_id,
        name: departure.location,
        code: departure.code,
        location: departure.location,
      },
      arrival_come_airport: {
        airport_id: arrival.airport_id,
        name: arrival.location,
        code: arrival.code,
        location: arrival.location,
      },
      departure_time: date.from,
      type: "roundTrip",
      passengers,
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
    }
  
    if (date.to) {
      flightSearchData.departure_return_airport = {
        airport_id: arrival.airport_id,
        name: arrival.location,
        code: arrival.code,
        location: arrival.location,
      }
      flightSearchData.arrival_return_airport = {
        airport_id: departure.airport_id,
        name: departure.location,
        code: departure.code,
        location: departure.location,
      }
      flightSearchData.arrival_time = date.to
    }
  
    setFlightSearch(flightSearchData)
    router.push("/booking/availability/come")
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full relative overflow-hidden">
        <div className="relative w-full h-96">
          <Image
            src="/AirlineBanner.jpg"
            alt="Airline Banner"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            className="rounded-b-3xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 mix-blend-overlay rounded-b-3xl" />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8 drop-shadow-md">Book your flight today and explore the world</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/booking")}
          >
            <FaPlane className="mr-2" />
            Book Now
          </Button>
        </div>
      </header>

      {/* Search Section */}
      <section className="mt-[-4rem] w-full flex justify-center z-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-end">
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="departure" className="text-sm font-medium text-gray-700">
                Departure
              </Label>
              <LocationPopup
                locations={allAirports}
                value={departureId}
                onChange={setDepartureId}
                placeholder="Select Departure"
                isLoading={isLoading}
                isError={isError}
              />
            </div>
            <div className="flex items-center justify-center lg:col-span-1">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 p-2 hover:bg-blue-50 transition-all duration-300"
                onClick={handleSwapLocations}
              >
                <ArrowRightLeft className="h-6 w-6 text-blue-500" />
              </Button>
            </div>
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="arrival" className="text-sm font-medium text-gray-700">
                Arrival
              </Label>
              <LocationPopup
                locations={allAirports}
                value={arrivalId}
                onChange={setArrivalId}
                placeholder="Select Arrival"
                isLoading={isLoading}
                isError={isError}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
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
                    fromDate={new Date()}
                    selected={date}
                    onSelect={setDate as SelectRangeEventHandler}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">
                Passengers
              </Label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Select value={passengers.toString()} onValueChange={(value) => setPassengers(Number(value))}>
                  <SelectTrigger id="passengers" className="pl-10">
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
          </div>
          <div className="mt-6">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
              onClick={handleSearchFlights}
              disabled={isLoading || isError}
            >
              {isLoading ? "Loading..." : "Search Flights"}
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="mt-12 w-full flex justify-center">
        <div className="flex flex-wrap justify-center space-x-4 bg-white py-4 px-8 rounded-full shadow-lg">
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2 hover:text-blue-800 transition-all duration-300 my-2"
            onClick={() => router.push("/utilities/luggage")}
          >
            <FaSuitcase className="text-xl" />
            <span>Luggage</span>
          </button>
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2 hover:text-blue-800 transition-all duration-300 my-2"
            onClick={() => router.push("/utilities/shopping")}
          >
            <FaShoppingCart className="text-xl" />
            <span>Shopping</span>
          </button>
          <button
            className="text-blue-600 font-semibold flex items-center space-x-2 hover:text-blue-800 transition-all duration-300 my-2"
            onClick={() => router.push("/utilities/insurance")}
          >
            <FaShieldAlt className="text-xl" />
            <span>Insurance</span>
          </button>
          <button className="text-blue-600 font-semibold flex items-center space-x-2 hover:text-blue-800 transition-all duration-300 my-2">
            <FaEllipsisH className="text-xl" />
            <span>Other</span>
          </button>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="w-full px-4 my-16">
        <h2 className="text-4xl font-bold text-center mb-8">Popular Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularRoutes.map((route) => (
            <div
              key={route.name}
              className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={route.image}
                  alt={route.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{route.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-semibold mb-2">
              Best Price Guarantee
            </h3>
            <p className="text-gray-600">
              We offer unbeatable deals. Find a lower price elsewhere? We&apos;ll match it!
            </p>
          </div>
          <div className="text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-semibold mb-2">
              Easy Refunds & Changes
            </h3>
            <p className="text-gray-600">
              Plans change? No worries. We offer hassle-free refunds and flight changes.
            </p>
          </div>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-semibold mb-2">Travel Safety Updates</h3>
            <p className="text-gray-600">
              Stay informed with real-time updates on travel safety and regulations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index

