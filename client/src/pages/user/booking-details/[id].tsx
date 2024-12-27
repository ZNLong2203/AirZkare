"use client"

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/configs/axios-customize'
import API from '@/constants/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, Calendar, MapPin, Clock } from 'lucide-react'
import ErrorMessage from '@/components/common/ErrorMessageQuery'
import LoadingQuery from '@/components/common/LoadingQuery'
import { useParams } from 'next/navigation'

interface Airport {
  airport_id: string
  name: string
  location: string
}

interface Airplane {
  airplane_id: string
  name: string
  model: string
}

interface Flight {
  flight_id: string
  code: string
  airport_flight_arrival_airportToairport: Airport
  airport_flight_departure_airportToairport: Airport
  departure_time: string
  status: string
  airplane: Airplane
}

interface Passenger {
  flight_seat: {
    flight: Flight
  }[]
}

interface BookingPassenger {
  passenger: Passenger
}

interface BookingDetails {
  booking_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  time: string
  booking_passenger: BookingPassenger[]
}

const fetchBookingDetails = async (booking_id: string): Promise<BookingDetails> => {
  const res = await axiosInstance.get(`${API.BOOKING}/${booking_id}`, {
    withCredentials: true
  })
  return res.data.metadata
}

const BookingDetails = () => {
  const params = useParams();
  const booking_id = params?.id as string;
  const { data, error, isError, isLoading } = useQuery<BookingDetails, Error>({
    queryKey: ['bookingDetails', booking_id],
    queryFn: () => fetchBookingDetails(booking_id)
  })

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (isLoading) return <LoadingQuery />
  if (isError) return <ErrorMessage message={error.message} />

  const flight = data?.booking_passenger[0]?.passenger.flight_seat[0]?.flight

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Plane className="h-6 w-6" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Booking Date:</span> {data?.time ? new Date(data.time).toLocaleString() : ''}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Booking ID:</span> {data?.booking_id}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span> 
                  <Badge variant="outline" className={`capitalize ${getStatusStyle(data?.status || 'pending')}`}>
                    {data?.status}
                  </Badge>
                </p>
              </div>
            </div>
            {flight && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Flight Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Flight Number:</span> {flight.code}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Departure:</span> {flight.airport_flight_departure_airportToairport.location} ({flight.airport_flight_departure_airportToairport.name})
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Arrival:</span> {flight.airport_flight_arrival_airportToairport.location} ({flight.airport_flight_arrival_airportToairport.name})
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Departure Time:</span> {new Date(flight.departure_time).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Flight Status:</span> 
                    <Badge variant="outline" className={`capitalize ${getStatusStyle(flight.status)}`}>
                      {flight.status}
                    </Badge>
                  </p>
                </div>
              </div>
            )}
          </div>
          {flight && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Airplane Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Airplane Name:</span> {flight.airplane.name}</p>
                <p><span className="font-medium">Model:</span> {flight.airplane.model}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingDetails

