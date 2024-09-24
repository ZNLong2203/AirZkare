import { useState, useMemo } from 'react'
import { MdAirplanemodeActive, MdAirlineSeatReclineNormal, MdFlightTakeoff, MdFlightLand } from "react-icons/md"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Plane, Cloud, MapPin } from 'lucide-react'

interface Seat {
  id: number
  class: 'Business' | 'Economy'
  reserved: boolean
  label: string
}

const seats: Seat[] = [
  { id: 1, class: 'Business', reserved: false, label: '1A' },
  { id: 2, class: 'Business', reserved: false, label: '1B' },
  { id: 3, class: 'Business', reserved: true, label: '1C' },
  { id: 4, class: 'Business', reserved: false, label: '1D' },
  { id: 7, class: 'Business', reserved: false, label: '2A' },
  { id: 8, class: 'Business', reserved: true, label: '2B' },
  { id: 9, class: 'Business', reserved: false, label: '2C' },
  { id: 10, class: 'Business', reserved: false, label: '2D' },
  { id: 13, class: 'Economy', reserved: false, label: '3A' },
  { id: 14, class: 'Economy', reserved: false, label: '3B' },
  { id: 15, class: 'Economy', reserved: false, label: '3C' },
  { id: 16, class: 'Economy', reserved: false, label: '3D' },
  { id: 17, class: 'Economy', reserved: true, label: '3E' },
  { id: 18, class: 'Economy', reserved: false, label: '3F' },
  { id: 19, class: 'Economy', reserved: false, label: '4A' },
  { id: 20, class: 'Economy', reserved: false, label: '4B' },
  { id: 21, class: 'Economy', reserved: false, label: '4C' },
  { id: 22, class: 'Economy', reserved: false, label: '4D' },
  { id: 23, class: 'Economy', reserved: false, label: '4E' },
  { id: 24, class: 'Economy', reserved: false, label: '4F' },
]

const BookingSeat = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  const handleSeatSelection = (seat: Seat) => {
    if (!seat.reserved) {
      setSelectedSeats((prev) =>
        prev.includes(seat.id)
          ? prev.filter((id) => id !== seat.id)
          : [...prev, seat.id]
      )
    }
  }

  const selectedClasses = useMemo(() => {
    const classes = new Set(selectedSeats.map(id => seats.find(seat => seat.id === id)?.class))
    if (classes.size === 2) return 'Mixed'
    return classes.values().next().value || ''
  }, [selectedSeats])

  const renderSeats = (seatClass: 'Business' | 'Economy') =>
    seats
      .filter((seat) => seat.class === seatClass)
      .map((seat) => (
        <TooltipProvider key={seat.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleSeatSelection(seat)}
                variant={seat.reserved ? "secondary" : selectedSeats.includes(seat.id) ? "default" : "outline"}
                className={`w-12 h-12 p-0 ${
                  seat.class === 'Business' 
                    ? 'bg-amber-100 hover:bg-amber-200' 
                    : 'bg-emerald-100 hover:bg-emerald-200'
                } ${seat.reserved ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : ''} 
                  ${selectedSeats.includes(seat.id) ? 'bg-primary text-primary-foreground' : ''}`}
                disabled={seat.reserved}
              >
                <div className="flex flex-col items-center">
                  {seat.reserved ? (
                    <MdAirlineSeatReclineNormal className="text-gray-500" />
                  ) : (
                    <MdAirplanemodeActive className={selectedSeats.includes(seat.id) ? "text-primary-foreground" : "text-primary"} />
                  )}
                  <span className="text-xs mt-1">{seat.label}</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{seat.reserved ? 'Reserved' : `${seat.class} Class - Seat ${seat.label}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary text-primary-foreground py-8 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-center">Select Your Seats</h1>
          <p className="text-xl text-center">Choose your perfect spot for a comfortable journey</p>
        </div>
        <Plane className="absolute top-1/2 left-0 transform -translate-y-1/2 text-primary-foreground/20 w-32 h-32" />
        <Cloud className="absolute top-1/4 right-10 text-primary-foreground/20 w-24 h-24" />
        <Cloud className="absolute bottom-1/4 left-1/4 text-primary-foreground/20 w-16 h-16" />
      </div>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex gap-6">
          <Card className="w-3/4 shadow-lg">
            <CardHeader className="bg-secondary">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MdFlightTakeoff className="text-2xl" />
                  <span>HAN</span>
                </div>
                <div className="h-px w-16 bg-secondary-foreground/50"></div>
                <div className="flex items-center space-x-2">
                  <span>SGN</span>
                  <MdFlightLand className="text-2xl" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Flight Details</h2>
                <p className="text-gray-600">Flight VN123 • Boeing 787 • 2h 5m</p>
              </div>
              <Separator className="my-4" />
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Class</h2>
                    <div className="grid grid-cols-4 gap-4 mb-6 justify-items-center">
                      {renderSeats('Business')}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Economy Class</h2>
                    <div className="grid grid-cols-6 gap-4">
                      {renderSeats('Economy')}
                    </div>
                  </div>
                </div>
              </ScrollArea>
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
          <Card className="w-1/4 shadow-lg">
            <CardHeader className="bg-secondary">
              <CardTitle className="text-secondary-foreground">Selected Seats</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {selectedSeats.map((id) => {
                    const seat = seats.find(s => s.id === id)
                    return (
                      <div key={id} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                        <span>{seat?.label}</span>
                        <Badge variant="outline">{seat?.class}</Badge>
                      </div>
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
                >
                  Proceed to Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bg-secondary text-secondary-foreground py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span className="text-lg">Popular Destinations</span>
          </div>
          <div className="flex space-x-4">
            <Badge variant="outline" className="text-lg py-2 px-4">Paris</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">Tokyo</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">New York</Badge>
            <Badge variant="outline" className="text-lg py-2 px-4">Sydney</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSeat