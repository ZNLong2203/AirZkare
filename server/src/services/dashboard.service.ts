import { PrismaClientInstance } from "../db/PrismaClient";

const prisma = PrismaClientInstance();

class DashboardService {
    public async getPieChartData(): Promise<object> {
        const airports = await prisma.airport.findMany({
            include: {
                flight_flight_departure_airportToairport: {
                    include: {
                        flight_seat: {
                            include: {
                                passenger: true,
                            }
                        }
                    }
                },
                flight_flight_arrival_airportToairport: {
                    include: {
                        flight_seat: {
                            include: {
                                passenger: true, 
                            }
                        }
                    }
                }
            }
        });

        const numVisitorsPerLocation = airports.map(airport => {
            const totalVisitorsArrival = airport.flight_flight_arrival_airportToairport.reduce((count, flight) => {
                return count + flight.flight_seat.filter(seat => seat.is_booked === true).length;
            }, 0);

            const totalVisitorsDeparture = airport.flight_flight_departure_airportToairport.reduce((count, flight) => {
                return count + flight.flight_seat.filter(seat => seat.is_booked === true).length;
            }, 0);

            return {
                location: airport.location,
                totalVisitors: totalVisitorsArrival + totalVisitorsDeparture
            };
        });

        return numVisitorsPerLocation;
    }

    public async getLineChartData(): Promise<object> {
        const flights = await prisma.flight.findMany({
            include: {
                flight_seat: {
                    include: {
                        passenger: true,
                    }
                }
            }
        });

        const numPassengersPerFlight = flights.map(flight => {
            return {
                flightNumber: flight.flight_id,
                numPassengers: flight.flight_seat.filter(seat => seat.is_booked === true).length
            };
        });

        return numPassengersPerFlight;
    } 
}

export default DashboardService;
