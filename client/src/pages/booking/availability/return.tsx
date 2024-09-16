import React, { useState } from 'react';
import { FaPlaneDeparture, FaBusinessTime } from 'react-icons/fa';
import { GiPriceTag } from 'react-icons/gi';

interface Flight {
  id: number;
  departureTime: string;
  arrivalTime: string;
  priceEconomy: number;
  priceBusiness: number;
}

const SelectFlightPage: React.FC = () => {
  const flights: Flight[] = [
    {
      id: 1,
      departureTime: '08:00 AM',
      arrivalTime: '10:30 AM',
      priceEconomy: 150,
      priceBusiness: 350,
    },
    {
      id: 2,
      departureTime: '12:00 PM',
      arrivalTime: '02:30 PM',
      priceEconomy: 180,
      priceBusiness: 380,
    },
    {
      id: 3,
      departureTime: '04:00 PM',
      arrivalTime: '06:30 PM',
      priceEconomy: 200,
      priceBusiness: 400,
    },
  ];

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleFlightSelection = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  return (
    <div className="min-h-screen container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Select Your Return Flight</h2>
      <div className="grid grid-cols-1 gap-4">
        {flights.map(flight => (
          <div 
            key={flight.id} 
            className={`p-4 border rounded-lg ${selectedFlight?.id === flight.id ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
            onClick={() => handleFlightSelection(flight)}
          >
            <div className="flex justify-between items-center">
              <div>
                <FaPlaneDeparture className="inline-block text-xl mr-2" />
                <span className="text-lg font-semibold">Departure: {flight.departureTime}</span>
                <span className="block text-gray-500">Arrival: {flight.arrivalTime}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <GiPriceTag className="inline-block text-lg mr-2 text-green-500" />
                  <span className="text-green-500 font-bold">${flight.priceEconomy} (Economy)</span>
                </div>
                <div className="flex items-center mt-2">
                  <FaBusinessTime className="inline-block text-lg mr-2 text-blue-500" />
                  <span className="text-blue-500 font-bold">${flight.priceBusiness} (Business)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedFlight && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Selected Flight:</h3>
          <p>Departure Time: {selectedFlight.departureTime}</p>
          <p>Arrival Time: {selectedFlight.arrivalTime}</p>
          <p>Price: {selectedFlight.priceEconomy} (Economy) / {selectedFlight.priceBusiness} (Business)</p>
        </div>
      )}
    </div>
  );
};

export default SelectFlightPage;
