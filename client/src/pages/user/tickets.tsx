import axios from 'axios'
import API from '@/constants/api'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plane, Calendar, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ticket {
  id: string
  flightNumber: string
  departure: string
  arrival: string
  date: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

const tickets: Ticket[] = [
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
  },
  {
    id: '3',
    flightNumber: 'AZ9012',
    departure: 'Chicago (ORD)',
    arrival: 'Miami (MIA)',
    date: '2024-11-20',
    status: 'Cancelled'
  },
  {
    id: '4',
    flightNumber: 'AZ3456',
    departure: 'Seattle (SEA)',
    arrival: 'Denver (DEN)',
    date: '2024-12-05',
    status: 'Confirmed'
  },
  {
    id: '5',
    flightNumber: 'AZ7890',
    departure: 'Washington D.C. (IAD)',
    arrival: 'Las Vegas (LAS)',
    date: '2025-01-10',
    status: 'Pending'
  }
]

const MyTickets = () => {
  const token  = localStorage.getItem('token')
  // const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 4

  const filteredTickets = tickets.filter(ticket => 
    (ticket.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ticket.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ticket.arrival.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || ticket.status === statusFilter)
  )

  const indexOfLastTicket = currentPage * ticketsPerPage
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API.BOOKINGHISTORY}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true
          }
        })
        console.log(res.data.metadata)
        // setTickets(res.data.metadata)
      } catch (err) {
        console.log(err)
      }
    }
    fetchTickets()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
       <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by flight number, departure, or arrival"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 bg-white border-gray-200">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentTickets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentTickets.map(ticket => (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg">{ticket.flightNumber}</span>
                      </div>
                      <Badge variant="outline" className={`px-3 py-1 border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{ticket.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">From</div>
                        <div className="font-medium">{ticket.departure}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">To</div>
                        <div className="font-medium">{ticket.arrival}</div>
                      </div>
                    </div>

                    <Link 
                      href={`/tickets/${ticket.id}`}
                      className="block w-full text-center py-3 bg-gray-50 text-blue-600 font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No tickets found matching your criteria.</p>
          </div>
        )}

        {filteredTickets.length > ticketsPerPage && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.ceil(filteredTickets.length / ticketsPerPage) }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="h-9 w-9"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredTickets.length / ticketsPerPage)}
              variant="outline"
              size="icon"
              className="h-9 w-9"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default MyTickets