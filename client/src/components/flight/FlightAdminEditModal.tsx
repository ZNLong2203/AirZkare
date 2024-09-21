import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { CheckIcon, XIcon, PlaneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Flight, FlightSchema } from '@/schemas/Flight'

interface FlightEditModalProps {
  isOpen: boolean
  onClose: () => void
  flightData: Flight
  onSubmit: (flight: Flight) => void
}

export default function FlightEditModal({ isOpen, onClose, flightData, onSubmit }: FlightEditModalProps) {
    const [formData, setFormData] = useState<Flight>(flightData);

    useEffect(() => {
        setFormData(flightData)
    }, [flightData])

    const handleChange = (name: keyof Flight, value: string | number | Date) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        try {
        const validatedData = FlightSchema.parse({
            ...formData,
            price_business: parseFloat(formData.price_business.toString()),
            price_economy: parseFloat(formData.price_economy.toString()),
            departure_time: new Date(formData.departure_time),
            arrival_time: new Date(formData.arrival_time),
        })
        onSubmit(validatedData)
        onClose()
        toast.success('Flight updated successfully')
        } catch (error) {
        if (error instanceof z.ZodError) {
            toast.error('Invalid form data. Please check your inputs.')
        }
        }
    }

    if (!isOpen || !formData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
                <PlaneIcon className="mr-2 h-6 w-6" />
                Edit Flight
            </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                    Code
                </Label>
                <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                    Type
                </Label>
                <Select
                    onValueChange={(value) => handleChange('type', value)}
                    defaultValue={formData.type}
                >
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select flight type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="non-stop">Non-stop</SelectItem>
                    <SelectItem value="connecting">Connecting</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price_business" className="text-right">
                    Business Price
                </Label>
                <Input
                    id="price_business"
                    type="number"
                    value={formData.price_business}
                    onChange={(e) => handleChange('price_business', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price_economy" className="text-right">
                    Economy Price
                </Label>
                <Input
                    id="price_economy"
                    type="number"
                    value={formData.price_economy}
                    onChange={(e) => handleChange('price_economy', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Status
                </Label>
                <Select
                    onValueChange={(value) => handleChange('status', value)}
                    defaultValue={formData.status}
                >
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select flight status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="on-time">On-time</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departure_airport" className="text-right">
                    Departure
                </Label>
                <Input
                    id="departure_airport"
                    value={formData.departure_airport}
                    onChange={(e) => handleChange('departure_airport', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrival_airport" className="text-right">
                    Arrival
                </Label>
                <Input
                    id="arrival_airport"
                    value={formData.arrival_airport}
                    onChange={(e) => handleChange('arrival_airport', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departure_time" className="text-right">
                    Departure Time
                </Label>
                <Input
                    id="departure_time"
                    type="datetime-local"
                    value={formData.departure_time instanceof Date ? formData.departure_time.toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange('departure_time', e.target.value)}
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrival_time" className="text-right">
                    Arrival Time
                </Label>
                <Input
                    id="arrival_time"
                    type="datetime-local"
                    value={formData.arrival_time instanceof Date ? formData.arrival_time.toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange('arrival_time', e.target.value)}
                    className="col-span-3"
                />
                </div>
            </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={onClose}>
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
            </Button>
            <Button onClick={handleSubmit}>
                <CheckIcon className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}