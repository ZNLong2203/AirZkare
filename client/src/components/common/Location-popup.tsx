import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Airport } from "@/schemas/Airport"
import { Search, MapPin } from 'lucide-react'

interface LocationPopupProps {
  locations: Airport[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  isLoading: boolean
  isError: boolean
}

export function LocationPopup({
  locations,
  value,
  onChange,
  placeholder,
  isLoading,
  isError
}: LocationPopupProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)

  const filteredLocations = locations.filter(location =>
    location.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (airportId: string) => {
    onChange(airportId)
    setOpen(false)
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
  }

  if (isError) {
    return <div className="text-red-500">Error loading locations</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <MapPin className="mr-2 h-4 w-4" />
          {value ? locations.find(l => l.airport_id === value)?.location : placeholder}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {filteredLocations.map((location) => (
              <Button
                key={location.airport_id}
                variant="ghost"
                className="w-full justify-start font-normal mb-2 hover:bg-blue-50"
                onClick={() => handleSelect(location.airport_id)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location.location}
              </Button>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

