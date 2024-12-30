import axiosInstance from '@/configs/axios-customize'
import API from '@/constants/api'
import toast from 'react-hot-toast'
import React, { useState } from 'react'
import Link from 'next/link'
import { Plane, Calendar, Search, ArrowRight, ArrowLeft, Ticket } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ErrorMessage from '@/components/common/ErrorMessageQuery'
import LoadingQuery from '@/components/common/LoadingQuery'

interface Ticket {
  id: string
  flightNumber: string
  departure: string
  arrival: string
  date: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

const fetchTickets = async () => {
  const res = await axiosInstance.get(`${API.BOOKINGHISTORY}`, {
    withCredentials: true
  })
  return res.data.metadata
}

const MyTickets = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 6

  const {
    data,
    error,
    isError,
    isLoading
  } = useQuery<Ticket[], Error>({
    queryKey: ['tickets'],
    queryFn: () => fetchTickets()
  })

  const tickets = data || []

  const filteredTickets = tickets.filter((ticket: Ticket) =>
    (ticket?.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.departure?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.arrival?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || ticket?.status === statusFilter)
  )

  const indexOfLastTicket = currentPage * ticketsPerPage
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const getStatusStyle = (status: string) => {
    switch (status) {
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

  if (isLoading) return <LoadingQuery />
  if (isError) {
    console.error(error)
    toast.error('Error fetching tickets')
    return <ErrorMessage message='Error fetching tickets' />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage and view your flight bookings</p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by flight number, departure, or arrival"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px] h-12 bg-white border-gray-200">
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
          </CardContent>
        </Card>

        {currentTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTickets.map((ticket: Ticket) => (
              <Card key={ticket?.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="font-semibold text-lg">{ticket?.flightNumber}</span>
                      </div>
                      <Badge variant="outline" className={`px-3 py-1 text-sm font-medium border ${getStatusStyle(ticket?.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : '')}`}>
                        {ticket?.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : ''}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{ticket?.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">From</div>
                        <div className="font-semibold text-gray-800">{ticket?.departure}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">To</div>
                        <div className="font-semibold text-gray-800">{ticket?.arrival}</div>
                      </div>
                    </div>

                    <Link
                      href={`/user/booking-details/${ticket?.id}`}
                      className="block w-full text-center py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No tickets found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}

        {filteredTickets.length > ticketsPerPage && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.ceil(filteredTickets.length / ticketsPerPage) }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="h-10 w-10"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredTickets.length / ticketsPerPage)}
              variant="outline"
              size="icon"
              className="h-10 w-10"
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
