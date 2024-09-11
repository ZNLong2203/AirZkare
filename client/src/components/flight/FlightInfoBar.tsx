import { FaPlaneDeparture, FaPlaneArrival, FaUser } from 'react-icons/fa';

const FlightInfoBar: React.FC = () => {
  return (
    <div className="bg-gray-100 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Departure and Arrival Points */}
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-sm font-bold">HAN</span>
            <FaPlaneDeparture className="inline-block mx-2 text-blue-500" />
            <span className="text-sm">Hà Nội</span>
          </div>
          <div>
            <span className="text-sm font-bold">PQC</span>
            <FaPlaneArrival className="inline-block mx-2 text-blue-500" />
            <span className="text-sm">Phú Quốc</span>
          </div>
        </div>

        {/* Flight Dates */}
        <div className="flex space-x-8">
          <div>
            <span className="block text-gray-500 text-sm">Chuyến đi</span>
            <span className="font-semibold">Thứ 7, 21 thg 9</span>
          </div>
          <div>
            <span className="block text-gray-500 text-sm">Chuyến về</span>
            <span className="font-semibold">Thứ 6, 27 thg 9</span>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="flex items-center space-x-2">
          <FaUser className="text-gray-500" />
          <span>2 Hành khách</span>
        </div>

        {/* Button for modifying */}
        <div>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            Thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightInfoBar;
