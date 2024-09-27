import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import axios from 'axios';
import API from '@/constants/api';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { CheckIcon, XIcon, PlaneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Flight, FlightSchema } from '@/schemas/Flight';
import { Airport } from '@/schemas/Airport';
import { Airplane } from '@/schemas/Airplane';

interface FlightEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightData: Flight;
  onSubmit: (flight: Flight) => void;
}

const FlightEditModal = ({ isOpen, onClose, flightData, onSubmit }: FlightEditModalProps) => {
  const [formData, setFormData] = useState<Flight>(flightData);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await axios.get(`${API.AIRPORT}`, {
          withCredentials: true,
        });
        setAirports(res.data.metadata.airports);
      } catch (err) {
        toast.error('Error fetching airports');
      }
    };
    fetchAirports();
  }, []);

  useEffect(() => {
    const fetchAirplanes = async () => {
      try {
        const res = await axios.get(`${API.AIRPLANE}`, {
          withCredentials: true,
        });
        setAirplanes(res.data.metadata.airplanes);
      } catch (err) {
        toast.error('Error fetching airplanes');
      }
    };
    fetchAirplanes();
  }, []);

  useEffect(() => {
    setFormData(flightData);
  }, [flightData]);

  const handleChange = (name: keyof Flight, value: string | number | Date) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    try {
      const validatedData = FlightSchema.parse({
        ...formData,
        price_business: parseFloat(formData.price_business.toString()),
        price_economy: parseFloat(formData.price_economy.toString()),
        departure_time: new Date(moment(formData.departure_time).format('YYYY-MM-DD HH:mm:ss')),
        arrival_time: new Date(moment(formData.arrival_time).format('YYYY-MM-DD HH:mm:ss')),
      });
      onSubmit(validatedData);
      onClose();
      toast.success('Flight updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Invalid form data. Please check your inputs.');
      }
    }
  };

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
                Flight Code
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
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departure_airport" className="text-right">
                Departure Airport
              </Label>
              <Select
                onValueChange={(value) => handleChange('departure_airport', value)}
                defaultValue={formData.departure_airport}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select departure airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.airport_id} value={airport.airport_id}>
                      {airport.name} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arrival_airport" className="text-right">
                Arrival Airport
              </Label>
              <Select
                onValueChange={(value) => handleChange('arrival_airport', value)}
                defaultValue={formData.arrival_airport}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select arrival airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.airport_id} value={airport.airport_id}>
                      {airport.name} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="airplane" className="text-right">
                Airplane
              </Label>
              <Select
                onValueChange={(value) => handleChange('airplane_id', value)}
                defaultValue={formData.airplane_id}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select airplane" />
                </SelectTrigger>
                <SelectContent>
                  {airplanes.map((airplane) => (
                    <SelectItem key={airplane.airplane_id} value={airplane.airplane_id}>
                      {airplane.name} ({airplane.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departure_time" className="text-right">
                Departure Time
              </Label>
              <Input
                id="departure_time"
                type="datetime-local"
                value={moment(formData.departure_time).format('YYYY-MM-DDTHH:mm')}
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
                value={moment(formData.arrival_time).format('YYYY-MM-DDTHH:mm')}
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
  );
};

export default FlightEditModal;
