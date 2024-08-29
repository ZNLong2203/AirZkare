import { useState } from 'react';
import { MdAirplanemodeActive } from "react-icons/md";

const seats = [
  { id: 1, class: 'Business', reserved: false, label: '1A' },
  { id: 2, class: 'Business', reserved: false, label: '1B' },
  { id: 3, class: 'Business', reserved: true, label: '1C' },
  { id: 4, class: 'Business', reserved: false, label: '1D' },
  { id: 5, class: 'Business', reserved: false, label: '1E' },
  { id: 6, class: 'Business', reserved: false, label: '1F' },
  { id: 7, class: 'Business', reserved: false, label: '2A' },
  { id: 8, class: 'Business', reserved: true, label: '2B' },
  { id: 9, class: 'Business', reserved: false, label: '2C' },
  { id: 10, class: 'Business', reserved: false, label: '2D' },
  { id: 11, class: 'Business', reserved: false, label: '2E' },
  { id: 12, class: 'Business', reserved: false, label: '2F' },
  { id: 13, class: 'Economy', reserved: false, label: '3A' },
  { id: 14, class: 'Economy', reserved: false, label: '3B' },
  { id: 15, class: 'Economy', reserved: false, label: '3C' },
  { id: 16, class: 'Economy', reserved: false, label: '3D' },
  { id: 17, class: 'Economy', reserved: true, label: '3E' },
  { id: 18, class: 'Economy', reserved: false, label: '3F' },
  { id: 19, class: 'Economy', reserved: false, label: '4A' },
  { id: 20, class: 'Economy', reserved: false, label: '4B' },
  { id: 21, class: 'Economy', reserved: false, label: '4C' },
  { id: 22, class: 'Economy', reserved: false, label: '4D' },
  { id: 23, class: 'Economy', reserved: false, label: '4E' },
  { id: 24, class: 'Economy', reserved: false, label: '4F' },
];

const SelectSeat = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatSelection = (seat) => {
    if (!seat.reserved) {
      setSelectedSeats((prev) =>
        prev.includes(seat.id)
          ? prev.filter((id) => id !== seat.id)
          : [...prev, seat.id]
      );
    }
  };

  const renderSeats = (seatClass) =>
    seats
      .filter((seat) => seat.class === seatClass)
      .map((seat) => (
        <button
          key={seat.id}
          onClick={() => handleSeatSelection(seat)}
          className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-colors duration-300 ${
            seat.reserved
              ? 'bg-red-300 cursor-not-allowed'
              : selectedSeats.includes(seat.id)
              ? 'bg-green-500 border-green-700 text-white'
              : 'bg-white hover:bg-blue-500 hover:border-blue-700 hover:text-white'
          }`}
          disabled={seat.reserved}
        >
          <div className="flex flex-col items-center">
            <MdAirplanemodeActive />
            <span className="text-xs mt-1">{seat.label}</span>
          </div>
        </button>
      ));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-white pt-10">Select Seat</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Class</h2>
          <div className="grid grid-cols-6 gap-4 mb-6">
            {renderSeats('Business')}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Economy Class</h2>
          <div className="grid grid-cols-6 gap-4">
            {renderSeats('Economy')}
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Selected Seat</p>
              <p className="text-lg font-semibold">
                {selectedSeats.map((id) => ` ${seats.find(seat => seat.id === id).label}`)}
              </p>
            </div>
            <span className="inline-block bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full">
              {selectedSeats.length > 0 && seats.find(seat => seat.id === selectedSeats[0]).class}
            </span>
          </div>
          <button
            className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300"
            disabled={selectedSeats.length === 0}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectSeat;
