import axios from 'axios'
import toast from 'react-hot-toast'
import API from '@/constants/api'
import useFlightSearchStore from '@/store/useFlightSearchStore'
import { useStore } from '@/store/useStore'
import { useState, useMemo, useEffect } from 'react'
import { MdAirplanemodeActive, MdAirlineSeatReclineNormal, MdFlightTakeoff, MdFlightLand } from "react-icons/md"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Plane, Cloud, MapPin, Info } from 'lucide-react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

interface Seat {
  flight_seat_id: string;
  flight_id: string;
  passenger_id: string | null;
  seat_id: string;
  is_booked: boolean;
  seat: {
    seat_id: string;
    airplane_id: string;
    number: string;
    class: 'business' | 'economy';
  };
}

const SeatSelecting = () => {
  const router = useRouter()
  const { token } = useStore((state) => state)
  const { 
    departure_return_airport, 
    arrival_return_airport, 
    class_return,
    passengers, 
    flight_come_id, 
    flight_return_id, 
    type } = useFlightSearchStore((state) => state)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const departureCode = departure_return_airport.code
  const arrivalCode = arrival_return_airport.code

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`${API.FLIGHT}/${flight_return_id}/seat`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
        setSeats(res.data.metadata)
      } catch(error) {
        toast.error('Failed to fetch seats')
      }
    }
    fetchSeats()
  }, [])

  const sortedSeats = seats.sort((a, b) => {
    const [aRow, aCol] = [parseInt(a.seat.number.slice(0, -1)), a.seat.number.slice(-1)]
    const [bRow, bCol] = [parseInt(b.seat.number.slice(0, -1)), b.seat.number.slice(-1)]
    if (aRow === bRow) {
      return aCol.localeCompare(bCol) 
    }
    return aRow - bRow 
  })

  const handleSeatSelection = (seat: Seat) => {
    if (!seat.is_booked && seat.seat.class === class_return) {
      setSelectedSeats((prev) => {
        if (prev.includes(seat.flight_seat_id)) {
          return prev.filter((id) => id !== seat.flight_seat_id)
        } else if (prev.length < passengers) {
          return [...prev, seat.flight_seat_id]
        }
        return prev
      })
    }
  }

  const selectedClasses = useMemo(() => {
    const classes = new Set(selectedSeats.map(id => seats.find(seat => seat.flight_seat_id === id)?.seat.class))
    if (classes.size === 2) return 'Mixed'
    return classes.values().next().value || ''
  }, [selectedSeats, seats])

  const handleCheckout = async () => {
    try {
      await axios.post(`${API.BOOKING}/flight`, {
        flight_come_id,
        flight_return_id,
        flight_type: type,
        seats_return_id: selectedSeats
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      router.push('/payment')
    } catch (error) {
      toast.error('Failed to proceed to checkout')
    }
    console.log(selectedSeats)
  }

  const renderSeats = (seatClass: 'business' | 'economy') =>
    sortedSeats
      .filter((seat) => seat.seat.class === seatClass)
      .map((seat) => (
        <TooltipProvider key={seat.flight_seat_id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleSeatSelection(seat)}
                  variant={seat.is_booked ? "secondary" : selectedSeats.includes(seat.flight_seat_id) ? "default" : "outline"}
                  className={`w-12 h-12 p-0 ${
                    seat.seat.class === 'business' 
                      ? 'bg-amber-100 hover:bg-amber-200' 
                      : 'bg-emerald-100 hover:bg-emerald-200'
                  } ${seat.is_booked ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : ''} 
                    ${selectedSeats.includes(seat.flight_seat_id) ? 'bg-primary text-primary-foreground' : ''}`}
                  disabled={seat.is_booked}
                >
                  <div className="flex flex-col items-center">
                    {seat.is_booked ? (
                      <MdAirlineSeatReclineNormal className="text-gray-500" />
                    ) : (
                      <MdAirplanemodeActive className={selectedSeats.includes(seat.flight_seat_id) ? "text-primary-foreground" : "text-primary"} />
                    )}
                    <span className="text-xs mt-1">{seat.seat.number}</span>
                  </div>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{seat.is_booked ? 'Reserved' : `${seat.seat.class.charAt(0).toUpperCase() + seat.seat.class.slice(1)} Class - Seat ${seat.seat.number}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div 
        className="bg-primary text-primary-foreground py-12 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-center">Select Your Seats</h1>
          <p className="text-xl text-center">Choose your perfect spot for a comfortable journey</p>
        </div>
        <Plane className="absolute top-1/2 left-0 transform -translate-y-1/2 text-primary-foreground/20 w-32 h-32" />
        <Cloud className="absolute top-1/4 right-10 text-primary-foreground/20 w-24 h-24" />
        <Cloud className="absolute bottom-1/4 left-1/4 text-primary-foreground/20 w-16 h-16" />
      </motion.div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <motion.div 
          className="mb-8 bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            {['Search', 'Choose flight', 'Passenger details', 'Choose seat', 'Payment'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-12 h-12 ${index <= 3 ? 'bg-indigo-500' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white font-bold mb-2 transition-all duration-300 ease-in-out transform hover:scale-110`}>
                  {index + 1}
                </div>
                <span className={`text-sm text-center ${index === 3 ? 'font-bold text-indigo-600' : 'text-gray-600'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </motion.div>

        <div className="flex gap-6 flex-col lg:flex-row">
          <motion.div 
            className="w-full lg:w-3/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg h-full">
              <CardHeader className="bg-secondary">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MdFlightTakeoff className="text-2xl" />
                    <span>{departureCode}</span>
                  </div>
                  <div className="h-px w-16 bg-secondary-foreground/50"></div>
                  <div className="flex items-center space-x-2">
                    <span>{arrivalCode}</span>
                    <MdFlightLand className="text-2xl" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100vh-300px)] overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-gray-800">Return Flight Seats</h2>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">Flight Details</h2>
                  <p className="text-gray-600">Flight VN123 • Boeing 787 • 2h 5m</p>
                  <p className="text-gray-600">Passengers: {passengers}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Class</h2>
                    <div className="grid grid-cols-4 gap-4 mb-4 justify-items-center">
                      {renderSeats('business')}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Economy Class</h2>
                    <div className="grid grid-cols-6 gap-4 justify-items-center">
                      {renderSeats('economy')}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                    <span className="text-gray-700">Business</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                    <span className="text-gray-700">Economy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-gray-700">Reserved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="w-full lg:w-1/4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-lg sticky top-4">
              <CardHeader className="bg-secondary">
                <CardTitle className="text-secondary-foreground">Selected Seats</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="space-y-2">
                    {selectedSeats.map((id) => {
                      const seat = seats.find(s => s.flight_seat_id === id)
                      return (
                        <motion.div 
                          key={id} 
                          className="flex justify-between items-center p-2 bg-secondary/20 rounded"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{seat?.seat.number}</span>
                          <Badge variant="outline">{seat?.seat.class}</Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Seats:</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Class:</span>
                    <Badge variant="secondary">
                      {selectedClasses === 'Mixed' ? 'Business & Economy' : selectedClasses}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={selectedSeats.length === 0}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <motion.div 
        className="bg-secondary text-secondary-foreground py-12 px-4 mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span className="text-lg">Popular Destinations</span>
          </div>
          <div className="flex flex-wrap justify-center  gap-4">
            <Badge variant="outline" className="text-lg py-2 px-4">Paris</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">Tokyo</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">New York</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">Sydney</Badge>
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="fixed bottom-4 right-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full bg-white shadow-lg">
                <Info className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Need help? Click for assistance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  )
}

export default SeatSelecting