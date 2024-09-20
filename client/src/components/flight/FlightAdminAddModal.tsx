/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { FlightSchema, Flight } from '@/schemas/Flight';
import { Airport } from '@/schemas/Airport';
import { z } from 'zod';
import axios from 'axios';
import API from '@/constants/api';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FlightAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (flight: Flight) => void;
}

const FlightAddModal: React.FC<FlightAddModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        code: '',
        type: 'non-stop',
        price_business: '',
        price_economy: '',
        departure_airport: '',
        arrival_airport: '',
        departure_time: '',
        arrival_time: '',
        status: 'on-time',
    });
    const [airports, setAirports] = useState<Airport[]>([]);

    useEffect(() => {
        if(isOpen) {
            const fetchAirport = async() => {
                try {
                    const res = await axios.get(`${API.AIRPORT}`, {
                        withCredentials: true,
                    })
                    setAirports(res.data.metadata.airports);
                } catch(err) {
                    toast.error("Error fetching airplanes");
                }
            }
            fetchAirport();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        try {
            const validatedData = FlightSchema.parse({
                ...formData,
                price_business: parseFloat(formData.price_business),
                price_economy: parseFloat(formData.price_economy),
                departure_time: new Date(formData.departure_time),
                arrival_time: new Date(formData.arrival_time),
            });
            onSubmit(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error('Invalid form data');
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Flight</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">Flight Code</Label>
                        <Input
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Flight Code"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" value={formData.type} onValueChange={(value) => handleChange({ target: { name: 'type', value } } as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select flight type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="non-stop">Non-stop</SelectItem>
                                <SelectItem value="connecting">Connecting</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price_business">Business Price</Label>
                        <Input
                            id="price_business"
                            name="price_business"
                            type="number"
                            value={formData.price_business}
                            onChange={handleChange}
                            placeholder="Business Price"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price_economy">Economy Price</Label>
                        <Input
                            id="price_economy"
                            name="price_economy"
                            type="number"
                            value={formData.price_economy}
                            onChange={handleChange}
                            placeholder="Economy Price"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="departure_airport">Departure Airport</Label>
                        <Select name="departure_airport" value={formData.departure_airport} onValueChange={(value) => handleChange({ target: { name: 'departure_airport', value } } as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Departure Airport" />
                            </SelectTrigger>
                            <SelectContent>
                                {airports.map((airport) => (
                                    <SelectItem key={airport.code} value={airport.code}>
                                        {airport.name} ({airport.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="arrival_airport">Arrival Airport</Label>
                        <Select name="arrival_airport" value={formData.arrival_airport} onValueChange={(value) => handleChange({ target: { name: 'arrival_airport', value } } as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Arrival Airport" />
                            </SelectTrigger>
                            <SelectContent>
                                {airports.map((airport) => (
                                    <SelectItem key={airport.code} value={airport.code}>
                                        {airport.name} ({airport.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="departure_time">Departure Time</Label>
                        <Input
                            id="departure_time"
                            name="departure_time"
                            type="datetime-local"
                            value={formData.departure_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="arrival_time">Arrival Time</Label>
                        <Input
                            id="arrival_time"
                            name="arrival_time"
                            type="datetime-local"
                            value={formData.arrival_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" value={formData.status} onValueChange={(value) => handleChange({ target: { name: 'status', value } } as any)}>
                            <SelectTrigger>
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
                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Add Flight
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FlightAddModal;