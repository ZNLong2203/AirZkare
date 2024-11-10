import React from 'react';
import { FlightWithDA } from '@/schemas/Flight';

interface SeatMapProps {
  flightData: FlightWithDA;
}

const SeatMap: React.FC<SeatMapProps> = ({ flightData }) => {
  const { airplane, flight_seat } = flightData;

  const renderSeats = () => {
    const seatMap = new Map(flight_seat.map(seat => [seat.seat.number, seat]));
    const rows = Math.max(...flight_seat.map(seat => parseInt(seat.seat.number.slice(0, -1))));
    const businessRows = Math.ceil(airplane.total_business / 4); // 4 seats per row in business class

    const seats = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      const isBusinessRow = row <= businessRows;
      const columns = isBusinessRow ? 'ABCD' : 'ABCDEF';

      for (const col of columns) {
        const seatNumber = `${row}${col}`;
        const seat = seatMap.get(seatNumber);
        if (seat) {
          const isBooked = seat.is_booked;
          const seatClass = seat.seat.class;
          rowSeats.push(
            <div
              key={seatNumber}
              className={`w-8 h-8 m-1 rounded-sm flex items-center justify-center text-xs font-bold
                ${isBooked ? 'bg-red-500 text-white' : seatClass === 'business' ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'}`}
              role="img"
              aria-label={`Seat ${seatNumber}, ${seatClass} class, ${isBooked ? 'booked' : 'available'}`}
            >
              {seatNumber}
            </div>
          );
        } else {
          rowSeats.push(<div key={seatNumber} className="w-8 h-8 m-1" />);
        }
        if ((isBusinessRow && col === 'B') || (!isBusinessRow && col === 'C')) {
          rowSeats.push(<div key={`${row}-aisle1`} className="w-8" />);
        }
      }
      if (!isBusinessRow) {
        // Add extra space on the right for economy to center it with business class
        rowSeats.unshift(<div key={`${row}-spacer-left`} className="w-8" />);
        rowSeats.push(<div key={`${row}-spacer-right`} className="w-8" />);
      }
      seats.push(
        <div key={`row-${row}`} className="flex justify-center">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Seat Map</h3>
      <div className="flex flex-col items-center" role="group" aria-label="Airplane seat map">
        {renderSeats()}
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2" aria-hidden="true"></div>
          <span>Available Business (A-D)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2" aria-hidden="true"></div>
          <span>Available Economy (A-F)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2" aria-hidden="true"></div>
          <span>Booked</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p>Total Business Seats: {airplane.total_business}</p>
        <p>Total Economy Seats: {airplane.total_economy}</p>
      </div>
    </div>
  );
};

export default SeatMap;