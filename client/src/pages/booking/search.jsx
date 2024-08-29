import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

const flights = [
  {
    id: 1,
    airline: 'VIETRAVEL AIRLINES',
    flightNumber: 'VU780',
    departureTime: '17:05',
    arrivalTime: '19:15',
    duration: '02:10',
    price: '508,000 VND',
    seatsLeft: 2,
  },
  {
    id: 2,
    airline: 'VIETJET',
    flightNumber: 'VJ172',
    departureTime: '12:10',
    arrivalTime: '14:20',
    duration: '02:10',
    price: '590,000 VND',
    seatsLeft: 3,
  },
  {
    id: 3,
    airline: 'BAMBOO',
    flightNumber: 'QH202',
    departureTime: '05:25',
    arrivalTime: '07:35',
    duration: '02:10',
    price: '789,000 VND',
    seatsLeft: 4,
  },
  {
    id: 4,
    airline: 'VNA',
    flightNumber: 'VN248',
    departureTime: '13:00',
    arrivalTime: '15:15',
    duration: '02:15',
    price: '1,069,000 VND',
    seatsLeft: 11,
  },
];

export default function FlightSearch() {
  const [selectedFilters, setSelectedFilters] = useState({
    airline: 'all',
    nonStop: true,
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const filteredFlights = flights.filter(
    (flight) =>
      (selectedFilters.airline === 'all' || flight.airline === selectedFilters.airline) &&
      (selectedFilters.nonStop ? flight.duration === '02:10' : true)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Tìm Chuyến Bay</h1>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Từ</label>
              <input type="text" value="Hồ Chí Minh (SGN)" disabled className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Đến</label>
              <input type="text" value="Hà Nội (HAN)" disabled className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Ngày đi</label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">Tìm Chuyến Bay</button>
        </div>

        <div className="flex mt-8">
          <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Lọc Chuyến Bay</h2>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="nonStop"
                  checked={selectedFilters.nonStop}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                Bay thẳng
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Hãng chuyến chở</label>
              <select
                name="airline"
                value={selectedFilters.airline}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Hiển thị tất cả</option>
                <option value="VIETRAVEL AIRLINES">Vietravel Airlines</option>
                <option value="VIETJET">VietJet</option>
                <option value="BAMBOO">Bamboo</option>
                <option value="VNA">VNA</option>
              </select>
            </div>
          </div>

          <div className="w-3/4 pl-8">
            <h2 className="text-lg font-semibold mb-4">Chuyến bay một chiều Hồ Chí Minh (SGN) - Hà Nội (HAN)</h2>
            {filteredFlights.length === 0 ? (
              <p>Không có chuyến bay nào phù hợp với bộ lọc.</p>
            ) : (
              <ul>
                {filteredFlights.map((flight) => (
                  <li key={flight.id} className="mb-4 p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-start">
                        <p className="text-lg font-semibold">{flight.departureTime}</p>
                        <p className="text-sm text-gray-500">SGN</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-500">{flight.duration}</p>
                        <FaAngleDown className="text-gray-500" />
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-semibold">{flight.arrivalTime}</p>
                        <p className="text-sm text-gray-500">HAN</p>
                      </div>
                      <div className="ml-6">
                        <button className="px-4 py-2 border rounded-lg flex items-center text-blue-500 border-blue-500">
                          Chi tiết <FaAngleDown className="ml-2" />
                        </button>
                      </div>
                      <div className="ml-6">
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                          Còn {flight.seatsLeft} hạng ghế khác
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{flight.price}</p>
                      </div>
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Chọn</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
