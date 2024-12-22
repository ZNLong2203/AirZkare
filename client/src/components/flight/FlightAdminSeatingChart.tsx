'use client'

import React from 'react';
import { FlightWithDA } from '@/schemas/Flight';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SeatMapProps {
  flightData: FlightWithDA;
}

const SeatMap: React.FC<SeatMapProps> = ({ flightData }) => {
  const { airplane, flight_seat } = flightData;

  const renderSeats = () => {
    const seatMap = new Map(flight_seat.map(seat => [seat.seat.number, seat]));
    const rows = Math.max(...flight_seat.map(seat => parseInt(seat.seat.number.slice(0, -1))));
    const businessRows = Math.ceil(airplane.total_business / 4);

    const seats = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      const isBusinessRow = row <= businessRows;
      const columns = isBusinessRow ? 'ABCD' : 'ABCDEF';

      // Add row number
      rowSeats.push(
        <div key={`row-number-${row}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 font-medium">
          {row}
        </div>
      );

      for (const col of columns) {
        const seatNumber = `${row}${col}`;
        const seat = seatMap.get(seatNumber);
        if (seat) {
          const isBooked = seat.is_booked;
          const seatClass = seat.seat.class;
          rowSeats.push(
            <div
              key={seatNumber}
              className={`
                w-10 h-10 m-1 rounded-lg flex items-center justify-center text-sm font-medium
                transition-all duration-200 hover:scale-105 cursor-pointer
                ${isBooked 
                  ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                  : seatClass === 'business'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                    : 'bg-green-100 text-green-700 border-2 border-green-200'
                }
              `}
              role="button"
              aria-label={`Seat ${seatNumber}, ${seatClass} class, ${isBooked ? 'booked' : 'available'}`}
            >
              {seatNumber}
            </div>
          );
        } else {
          rowSeats.push(<div key={seatNumber} className="w-10 h-10 m-1" />);
        }
        if ((isBusinessRow && col === 'B') || (!isBusinessRow && col === 'C')) {
          rowSeats.push(<div key={`${row}-aisle1`} className="w-6" />);
        }
      }
      seats.push(
        <div key={`row-${row}`} className="flex items-center justify-center">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Seat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div 
            className="max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg"
            role="group" 
            aria-label="Airplane seat map"
          >
            {renderSeats()}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                Business Class (A-D)
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                Economy Class (A-F)
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                Booked
              </Badge>
            </div>

            <div className="flex justify-center gap-8 text-sm text-gray-600">
              <div>Total Business Seats: {airplane.total_business}</div>
              <div>Total Economy Seats: {airplane.total_economy}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatMap;