import { PrismaClientInstance } from "../db/PrismaClient";
import moment from "moment";

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

            // const totalVisitorsDeparture = airport.flight_flight_departure_airportToairport.reduce((count, flight) => {
            //     return count + flight.flight_seat.filter(seat => seat.is_booked === true).length;
            // }, 0);

            return {
                location: airport.location,
                totalVisitors: totalVisitorsArrival
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
                departureTime: flight.departure_time,
                numPassengers: flight.flight_seat.filter(seat => seat.is_booked === true).length
            };
        });

        // Map the number of passengers per month
        const passengersPerMonth = numPassengersPerFlight.reduce((acc, flightData) => {
            const month = moment(flightData.departureTime).format('MMM');  
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += flightData.numPassengers;
            return acc;
        }, {} as Record<string, number>);

        const result = Object.entries(passengersPerMonth).map(([month, numPassengers]) => {
            return {
                month,
                numPassengers
            };
        });

        result.sort((a, b) => {
            const monthA = moment(a.month, 'MMM');
            const monthB = moment(b.month, 'MMM');
            return monthA.month() - monthB.month();
        });

        return result;
    } 
}

export default DashboardService;
