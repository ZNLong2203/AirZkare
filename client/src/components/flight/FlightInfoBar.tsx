import moment from "moment"
import { useState } from "react"
import { Plane, User, CalendarDays, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useFlightSearchStore from "@/store/useFlightSearchStore"

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
    departure_come_time,

    departure_return_time,

    passengers,
  } = useFlightSearchStore((state) => state)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            <DateInfo label="Departure" date={ moment(departure_come_time).format('dddd, MMMM D')} />
            {departure_return_time && (
              <DateInfo label="Return" date={moment(departure_return_time).format('dddd, MMMM D')} />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{passengers} Passenger{parseInt(passengers) !== 1 ? 's' : ''}</span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Flight Details</DialogTitle>
              </DialogHeader>
              {/* Add your edit form here */}
              <p>Edit form content goes here.</p>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default FlightInfoBar
