import React, { useEffect, useState } from 'react';
import { FaPlane, FaTicketAlt, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch user tickets from API or local storage
    const userTickets = [
      {
        id: '1',
        flightNumber: 'AZ1234',
        departure: 'New York (JFK)',
        arrival: 'Los Angeles (LAX)',
        date: '2024-09-15',
        status: 'Confirmed'
      },
      {
        id: '2',
        flightNumber: 'AZ5678',
        departure: 'Boston (BOS)',
        arrival: 'San Francisco (SFO)',
        date: '2024-10-01',
        status: 'Pending'
      }
    ];

    setTickets(userTickets);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">My Tickets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-600 flex items-center">
                  <FaPlane className="mr-2" />
                  {ticket.flightNumber}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.status === 'Confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {ticket.date}
                </p>
                <p className="mt-2 text-gray-800">
                  <span className="font-semibold">From:</span> {ticket.departure}
                </p>
                <p className="mt-1 text-gray-800">
                  <span className="font-semibold">To:</span> {ticket.arrival}
                </p>
              </div>
              <Link 
                href={`/tickets/${ticket.id}`} 
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                  View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
