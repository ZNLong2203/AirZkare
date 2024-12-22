'use client'

import React, { useState } from 'react';
import { Plane, MapPin, Clock, DollarSign, Info, Users } from 'lucide-react';
import { FlightWithDA } from '@/schemas/Flight';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SeatMap from './FlightAdminSeatingChart';

interface FlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightData: FlightWithDA;
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  isOpen,
  onClose,
  flightData,
}) => {
  const [showSeatMap, setShowSeatMap] = useState(false);

  if (!isOpen || !flightData) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on-time': return 'bg-green-500';
      case 'delayed': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[900px] p-0">
        <div className="flex h-full">
          {/* Flight Details Section */}
          <div className={`flex-1 p-6 ${showSeatMap ? 'border-r border-gray-200' : ''}`}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Plane className="h-6 w-6 text-blue-500" />
                  Flight Details
                </DialogTitle>
                <Badge 
                  variant="secondary"
                  className={`${getStatusColor(flightData.status)} text-white`}
                >
                  {flightData.status}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              {/* Flight Info Card */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Info className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Flight Code:</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">{flightData.code}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Plane className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Type:</span>
                    </div>
                    <span className="capitalize">{flightData.type}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Price Info Card */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Business Class:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ${flightData.price_business.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Economy Class:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ${flightData.price_economy.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Route Info Card */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Departure Airport</p>
                        <p className="text-gray-600">
                          {flightData.airport_flight_departure_airportToairport?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Arrival Airport</p>
                        <p className="text-gray-600">
                          {flightData.airport_flight_arrival_airportToairport?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Info Card */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Departure Time</p>
                        <p className="text-gray-600">
                          {formatDate(flightData.departure_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Arrival Time</p>
                        <p className="text-gray-600">
                          {formatDate(flightData.arrival_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowSeatMap(!showSeatMap)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {showSeatMap ? 'Hide Seat Map' : 'View Seat Map'}
              </Button>
              <Button variant="default" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          {/* Seat Map Section */}
          {showSeatMap && (
            <div className="flex-1 border-l border-gray-200 p-6">
              <SeatMap flightData={flightData} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlightDetailsModal;