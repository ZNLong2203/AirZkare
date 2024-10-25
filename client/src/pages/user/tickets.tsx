'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plane, Calendar, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function MyTickets() {
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

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">My Tickets</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by flight number, departure, or arrival"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-2 rounded-md shadow-md border-gray-300 focus:ring-primary focus:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by Status" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTickets.map(ticket => (
              <Card key={ticket.id} className="transition-transform transform hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold text-primary">
                    <Plane className="inline mr-2" />
                    {ticket.flightNumber}
                  </CardTitle>
                  <Badge variant="outline" className={`py-1 px-3 rounded-full text-sm ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-2">
                    <p className="text-muted-foreground flex items-center">
                      <Calendar className="mr-2" />
                      {ticket.date}
                    </p>
                    <p className="font-medium">
                      From: <span className="text-muted-foreground">{ticket.departure}</span>
                    </p>
                    <p className="font-medium">
                      To: <span className="text-muted-foreground">{ticket.arrival}</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/tickets/${ticket.id}`} passHref>
                    <Button variant="outline" className="w-full mt-2">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>No tickets found matching your criteria.</p>
          </div>
        )}

        {filteredTickets.length > ticketsPerPage && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            {Array.from({ length: Math.ceil(filteredTickets.length / ticketsPerPage) }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredTickets.length / ticketsPerPage)}
              variant="outline"
              size="icon"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
