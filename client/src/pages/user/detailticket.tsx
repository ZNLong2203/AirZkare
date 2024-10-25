'use client'

import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Plane, Calendar, MapPin, Clock, User, CreditCard, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Ticket {
  id: string
  flightNumber: string
  departure: string
  arrival: string
  date: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  departureTime: string
  arrivalTime: string
  passenger: string
  seatNumber: string
  gate: string
  price: string
}

const tickets: Ticket[] = [
  {
    id: '1',
    flightNumber: 'AZ1234',
    departure: 'New York (JFK)',
    arrival: 'Los Angeles (LAX)',
    date: '2024-09-15',
    status: 'Confirmed',
    departureTime: '08:00 AM',
    arrivalTime: '11:30 AM',
    passenger: 'John Doe',
    seatNumber: '14A',
    gate: 'B22',
    price: '$350.00'
  },
  {
    id: '2',
    flightNumber: 'AZ5678',
    departure: 'Boston (BOS)',
    arrival: 'San Francisco (SFO)',
    date: '2024-10-01',
    status: 'Pending',
    departureTime: '10:15 AM',
    arrivalTime: '01:45 PM',
    passenger: 'Jane Smith',
    seatNumber: '22C',
    gate: 'C15',
    price: '$425.00'
  },
  {
    id: '3',
    flightNumber: 'AZ9012',
    departure: 'Chicago (ORD)',
    arrival: 'Miami (MIA)',
    date: '2024-11-20',
    status: 'Cancelled',
    departureTime: '02:30 PM',
    arrivalTime: '06:00 PM',
    passenger: 'Bob Johnson',
    seatNumber: '7F',
    gate: 'A10',
    price: '$275.00'
  },
  {
    id: '4',
    flightNumber: 'AZ3456',
    departure: 'Seattle (SEA)',
    arrival: 'Denver (DEN)',
    date: '2024-12-05',
    status: 'Confirmed',
    departureTime: '11:45 AM',
    arrivalTime: '03:15 PM',
    passenger: 'Alice Brown',
    seatNumber: '18D',
    gate: 'D8',
    price: '$300.00'
  },
  {
    id: '5',
    flightNumber: 'AZ7890',
    departure: 'Washington D.C. (IAD)',
    arrival: 'Las Vegas (LAS)',
    date: '2025-01-10',
    status: 'Pending',
    departureTime: '09:30 AM',
    arrivalTime: '11:45 AM',
    passenger: 'Charlie Wilson',
    seatNumber: '5B',
    gate: 'E12',
    price: '$375.00'
  }
]

export default function TicketDetails() {
  const router = useRouter()
  const { id } = router.query

  const ticket = tickets.find(t => t.id === id)

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-xl font-semibold">Ticket not found</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/my-tickets" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Tickets
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/my-tickets" passHref>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Tickets
          </Button>
        </Link>

        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                <Plane className="inline mr-2" />
                Flight {ticket.flightNumber}
              </CardTitle>
              <Badge variant="outline" className={statusColors[ticket.status]}>
                {ticket.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Departure</h3>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {ticket.departure}
                </p>
                <p className="flex items-center mt-1">
                  <Clock className="mr-2 h-4 w-4" />
                  {ticket.departureTime}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Arrival</h3>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {ticket.arrival}
                </p>
                <p className="flex items-center mt-1">
                  <Clock className="mr-2 h-4 w-4" />
                  {ticket.arrivalTime}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-2">Flight Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date: {ticket.date}
                </p>
                <p className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Passenger: {ticket.passenger}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Gate: {ticket.gate}
                </p>
                <p className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Price: {ticket.price}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg">
            <div className="w-full text-center">
              <p className="font-semibold">Seat Number</p>
              <p className="text-2xl font-bold mt-1">{ticket.seatNumber}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}