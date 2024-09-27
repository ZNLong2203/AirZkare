import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { PlaneIcon } from 'lucide-react';
import { FlightWithDA } from '@/schemas/Flight'; 

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
  if (!isOpen || !flightData) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ease-out">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all sm:max-w-lg w-full p-6 animate-fade-in-up">
        <div className="absolute top-0 right-0 p-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="text-center mb-4">
          <PlaneIcon size={40} className="text-blue-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-4">
            Flight Details
          </h2>
        </div>

        <div className="space-y-4">
          {/* Flight Code */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Flight Code:</span>
            <span className="text-gray-600">{flightData.code}</span>
          </div>

          {/* Type */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Type:</span>
            <span className="text-gray-600 capitalize">{flightData.type}</span>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Status:</span>
            <span className="text-gray-600 capitalize">{flightData.status}</span>
          </div>

          {/* Business Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Business Price:</span>
            <span className="text-gray-600">${flightData.price_business}</span>
          </div>

          {/* Economy Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Economy Price:</span>
            <span className="text-gray-600">${flightData.price_economy}</span>
          </div>

          {/* Departure Airport */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Departure Airport:</span>
            <span className="text-gray-600">
              {flightData.airport_flight_departure_airportToairport?.name}
            </span>
          </div>

          {/* Arrival Airport */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Arrival Airport:</span>
            <span className="text-gray-600">
              {flightData.airport_flight_arrival_airportToairport?.name}
            </span>
          </div>

          {/* Departure Time */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Departure Time:</span>
            <span className="text-gray-600">
              {new Date(flightData.departure_time).toLocaleString()}
            </span>
          </div>

          {/* Arrival Time */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Arrival Time:</span>
            <span className="text-gray-600">
              {new Date(flightData.arrival_time).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
