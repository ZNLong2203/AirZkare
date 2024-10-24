import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";

const prisma = PrismaClientInstance();

class DashboardService {
    public async getPieChartData(): Promise<object> {
        const airports = await prisma.airport.findMany({
            include: {
                flight_flight_arrival_airportToairport: {
                    include: {
                        flight_seat: {
                            include: {
                                booking_flight: {
                                    include: {
                                        booking: {
                                            include: { user: true }, 
                                        },
                                    }
                                }
                            }
                        }
                    },
                },
                flight_flight_departure_airportToairport: {
                    include: {
                        flight_seat: {
                            include: {
                                booking_flight: {
                                    include: {
                                        booking: {
                                            include: { user: true }, 
                                        },
                                    }
                                }
                            }
                        }
                    },
                },
            }
        })

        const numVisitorsPerLocation = airports.map(airport => {
            const totalVisitorsArrival = airport.flight_flight_arrival_airportToairport.reduce((count, flight) => {
              return count + flight.flight_seat.reduce((seatCount, seat) => {
                return seatCount + seat.booking_flight.filter(bookingFlight => bookingFlight.booking.status === 'confirmed').length;
              }, 0);
            }, 0);
      
            const totalVisitorsDeparture = airport.flight_flight_departure_airportToairport.reduce((count, flight) => {
              return count + flight.flight_seat.reduce((seatCount, seat) => {
                return seatCount + seat.booking_flight.filter(bookingFlight => bookingFlight.booking.status === 'confirmed').length;
              }, 0);
            }, 0);
      
            return {
              location: airport.location,
              totalVisitors: totalVisitorsArrival + totalVisitorsDeparture
            };
        });   
      
        return numVisitorsPerLocation;
    }
}

export default DashboardService;