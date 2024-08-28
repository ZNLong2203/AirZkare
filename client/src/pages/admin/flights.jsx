import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SideBarAdmin from '@/components/SideBarAdmin';

const AdminFlights = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Flights</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                        <AiOutlinePlus className="mr-2" /> Add New Flight
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Flight Number</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Origin</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Destination</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Departure Time</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Arrival Time</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample flight data */}
                            {[
                                { id: 1, flightNumber: 'VN123', origin: 'Hanoi', destination: 'Ho Chi Minh City', departure: '08:00 AM', arrival: '10:00 AM' },
                                { id: 2, flightNumber: 'VN456', origin: 'Da Nang', destination: 'Hanoi', departure: '12:00 PM', arrival: '02:00 PM' },
                            ].map((flight) => (
                                <tr key={flight.id} className="border-t">
                                    <td className="px-4 py-2">{flight.flightNumber}</td>
                                    <td className="px-4 py-2">{flight.origin}</td>
                                    <td className="px-4 py-2">{flight.destination}</td>
                                    <td className="px-4 py-2">{flight.departure}</td>
                                    <td className="px-4 py-2">{flight.arrival}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button className="text-green-600 hover:text-green-800 flex items-center">
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 flex items-center">
                                                <AiOutlineDelete className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AdminFlights;