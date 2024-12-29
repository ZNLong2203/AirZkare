import moment from "moment"
import { format } from "date-fns"
import { useState } from "react"
import { Plane, User, CalendarDays, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import useFlightSearchStore from "@/store/useFlightSearchStore"
import { Airport } from "@/schemas/Airport"

function AirportInfo({ code, name, icon }: { code?: string; name?: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <span className="text-sm font-bold">{code}</span>
        <span className="text-sm text-muted-foreground ml-2">{name}</span>
      </div>
    </div>
  )
}

function DateInfo({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center space-x-2">
      <CalendarDays className="h-5 w-5 text-muted-foreground" />
      <div>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{date}</span>
      </div>
    </div>
  )
}

const FlightInfoBar = () => {
  const {
    departure_come_airport,
    arrival_come_airport,
    departure_time,
    arrival_time,
    passengers,
    type,
    setFlightSearch,
    saveToLocalStorage
  } = useFlightSearchStore((state) => state)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editedFlightInfo, setEditedFlightInfo] = useState({
    departure_come_airport,
    arrival_come_airport,
    departure_time,
    arrival_time,
    passengers,
    type
  })

  type FlightInfoValue = Airport | Date | number | 'oneWay' | 'roundTrip';
  const handleInputChange = (field: string, value: FlightInfoValue | undefined) => {
    if (value === undefined) return;
    setEditedFlightInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setFlightSearch(editedFlightInfo)
    saveToLocalStorage()
    setIsDialogOpen(false)
  }

  const airportOptions: Airport[] = [
    { airport_id: "1", code: "JFK", name: "John F. Kennedy International Airport", location: "New York" },
    { airport_id: "2", code: "LAX", name: "Los Angeles International Airport", location: "Los Angeles" },
    { airport_id: "3", code: "LHR", name: "London Heathrow Airport", location: "London" },
    // Add more airport options as needed
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 mb-10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <AirportInfo
              code={departure_come_airport?.code}
              name={departure_come_airport?.name}
              icon={<Plane className="h-5 w-5 rotate-45" />}
            />
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <AirportInfo
              code={arrival_come_airport?.code}
              name={arrival_come_airport?.name}
              icon={<Plane className="h-5 w-5 -rotate-45" />}
            />
          </div>

          <div className="flex space-x-4">
            <DateInfo label="Departure" date={moment(departure_time).format('ddd, MMM D')} />
            {arrival_time && (
              <DateInfo label="Return" date={moment(arrival_time).format('ddd, MMM D')} />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{passengers} Passenger{parseInt(passengers.toString()) !== 1 ? 's' : ''}</span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Flight Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departure" className="text-right">
                    Departure
                  </Label>
                  <Select
                    value={editedFlightInfo.departure_come_airport.airport_id}
                    onValueChange={(value) => handleInputChange('departure_come_airport', airportOptions.find(airport => airport.airport_id === value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select departure airport" />
                    </SelectTrigger>
                    <SelectContent>
                      {airportOptions.map((airport) => (
                        <SelectItem key={airport.airport_id} value={airport.airport_id}>
                          {airport.code} - {airport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="arrival" className="text-right">
                    Arrival
                  </Label>
                  <Select
                    value={editedFlightInfo.arrival_come_airport.airport_id}
                    onValueChange={(value) => handleInputChange('arrival_come_airport', airportOptions.find(airport => airport.airport_id === value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select arrival airport" />
                    </SelectTrigger>
                    <SelectContent>
                      {airportOptions.map((airport) => (
                        <SelectItem key={airport.airport_id} value={airport.airport_id}>
                          {airport.code} - {airport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departureDate" className="text-right">
                    Departure
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`col-span-3 justify-start text-left font-normal ${
                          !editedFlightInfo.departure_time && "text-muted-foreground"
                        }`}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {editedFlightInfo.departure_time ? format(editedFlightInfo.departure_time, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedFlightInfo.departure_time || undefined}
                        onSelect={(date) => handleInputChange('departure_time', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {editedFlightInfo.type === 'roundTrip' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="returnDate" className="text-right">
                      Return
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`col-span-3 justify-start text-left font-normal ${
                            !editedFlightInfo.arrival_time && "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {editedFlightInfo.arrival_time ? format(editedFlightInfo.arrival_time, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editedFlightInfo.arrival_time || undefined}
                          onSelect={(date) => handleInputChange('arrival_time', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="passengers" className="text-right">
                    Passengers
                  </Label>
                  <Input
                    id="passengers"
                    type="number"
                    value={editedFlightInfo.passengers}
                    onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Trip Type</Label>
                  <RadioGroup
                    value={editedFlightInfo.type}
                    onValueChange={(value) => handleInputChange('type', value as 'oneWay' | 'roundTrip')}
                    className="col-span-3 flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oneWay" id="oneWay" />
                      <Label htmlFor="oneWay">One Way</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="roundTrip" id="roundTrip" />
                      <Label htmlFor="roundTrip">Round Trip</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default FlightInfoBar

