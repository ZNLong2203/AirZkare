// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useMemo } from "react";
// import axios from "axios";
// import API from "@/constants/api";
// import { useQuery } from "@tanstack/react-query";
// import useFlightSearchStore from "@/store/useFlightSearchStore";
// import LoadingQuery from "@/components/common/LoadingQuery";
// import ErrorMessage from "@/components/common/ErrorMessageQuery";
// import { FlightWithDA } from "@/schemas/Flight";
// import { toast } from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Clock, Plane } from "lucide-react";
// import FlightInfoBar from "@/components/flight/FlightInfoBar";
// // import { useRouter } from 'next/router';
// import FlightUpgradeModal from "@/components/booking/FlightUpgradeModal";

// interface FlightComeResponse {
//   flights: FlightWithDA[];
//   totalPages: number;
// }

// const fetchFlights = async (params: string): Promise<FlightWithDA[]> => {
//   const res = await axios.get(`${API.FLIGHT}`, { params });
//   console.log(res.data.metadata.flights);
//   return res.data.metadata.flights;
// };

// const SelectFlightPage: React.FC = () => {
//   // const router = useRouter();
//   const {
//     departure_airport,
//     arrival_airport,
//     departure_time,
//     arrival_time,
//     passengers,
//   } = useFlightSearchStore();

//   const [sortBy, setSortBy] = useState("departureTime");
//   const [stopFilter, setStopFilter] = useState("all");
//   const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
//   const [selectedFlight, setSelectedFlight] = useState<FlightWithDA | null>(
//     null
//   );

//   // Build search parameters
//   const searchParams = {
//     page: "1",
//     departure_airport,
//     arrival_airport,
//     departure_time: departure_time?.toISOString() || "",
//     arrival_time: arrival_time?.toISOString() || "",
//     passengers,
//   }.toString();

//   // Fetch flights using useQuery
//   const { data, isLoading, isError } = useQuery<FlightWithDA[], Error>({
//     queryKey: ["flights_come", searchParams],
//     queryFn: () => fetchFlights(searchParams),
//   });

//   const flights = data || [];

//   // Use useMemo to compute sorted and filtered flights
//   const sortedFilteredFlights = useMemo(() => {
//     let filteredFlights = [...flights];

//     // Filter flights based on stops
//     if (stopFilter === "nonstop") {
//       filteredFlights = filteredFlights.filter((flight) => flight.stops === 0);
//     } else if (stopFilter === "withstops") {
//       filteredFlights = filteredFlights.filter((flight) => flight.stops > 0);
//     }

//     // Sort flights based on selected criteria
//     if (sortBy === "price") {
//       filteredFlights.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "departureTime") {
//       filteredFlights.sort(
//         (a, b) =>
//           new Date(a.departure_time).getTime() -
//           new Date(b.departure_time).getTime()
//       );
//     } else if (sortBy === "duration") {
//       filteredFlights.sort((a, b) => a.duration - b.duration);
//     }

//     return filteredFlights;
//   }, [flights, sortBy, stopFilter]);

//   // Handlers
//   const handleSortChange = (value: string) => {
//     setSortBy(value);
//   };

//   const handleStopFilterChange = (value: string) => {
//     setStopFilter(value);
//   };

//   const handleSelectFlight = (flight: FlightWithDA) => {
//     setSelectedFlight(flight);
//     setIsUpgradeModalOpen(true);
//   };

//   const handleConfirmUpgrade = () => {
//     console.log("Upgrade confirmed for flight:", selectedFlight);
//     setIsUpgradeModalOpen(false);
//     // router.push(`/checkout?flightId=${selectedFlight?.flight_id}`);
//   };

//   if (isLoading) return <LoadingQuery />;
//   if (isError) {
//     toast.error("Error fetching flights");
//     return <ErrorMessage message="Error fetching flights" />;
//   }

//   return (
//     <div className="min-h-screen container mx-auto p-2 space-y-4">
//       <FlightInfoBar />
//       <div className="flex flex-col sm:flex-row gap-4 mb-10">
//         <Select onValueChange={handleSortChange} value={sortBy}>
//           <SelectTrigger className="w-full sm:w-[180px]">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="price">Lowest price</SelectItem>
//             <SelectItem value="departureTime">Departure time</SelectItem>
//             <SelectItem value="duration">Flight duration</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select onValueChange={handleStopFilterChange} value={stopFilter}>
//           <SelectTrigger className="w-full sm:w-[180px]">
//             <SelectValue placeholder="Number of stops" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All flights</SelectItem>
//             <SelectItem value="nonstop">Non-stop</SelectItem>
//             <SelectItem value="withstops">With stops</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       {sortedFilteredFlights.map((flight) => (
//         <Card key={flight.flight_id} className="w-full">
//           <CardContent className="p-0">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 flex flex-col justify-between">
//                 {/* Flight details */}
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <div className="text-lg font-bold">
//                       {new Date(flight.departure_time).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       {flight.departureAirport.code}
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <Plane className="inline-block w-4 h-4 rotate-90" />
//                     <div className="text-xs text-muted-foreground">
//                       {flight.stops === 0
//                         ? "Non-stop"
//                         : `${flight.stops} stops`}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-lg font-bold">
//                       {new Date(flight.arrival_time).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       {flight.arrivalAirport.code}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
//                   <Clock className="w-4 h-4 mr-1" />
//                   {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
//                 </div>
//                 <div className="mt-2 text-sm">
//                   <div>
//                     {flight.flight_number} Operated by {flight.airline}
//                   </div>
//                 </div>
//               </div>
//               {/* Economy class selection */}
//               <div
//                 className="bg-teal-800 text-white p-4 flex flex-col justify-between cursor-pointer"
//                 onClick={() => handleSelectFlight(flight)}
//               >
//                 <div className="text-lg font-bold">ECONOMY</div>
//                 <div className="text-2xl font-bold">
//                   from {flight.price.toLocaleString()} VND
//                 </div>
//                 <div className="text-sm">per passenger</div>
//                 <Button variant="secondary" className="mt-2">
//                   Select
//                 </Button>
//                 <div className="mt-2 text-sm">
//                   {flight.seats_left} seats left
//                 </div>
//               </div>
//               {/* Business class selection (if applicable) */}
//               {/* Uncomment and modify if you have business class data */}
//               {/* <div
//                 className="bg-yellow-500 text-black p-4 flex flex-col justify-between cursor-pointer"
//                 onClick={() => handleSelectFlight(flight)}
//               >
//                 <div className="text-lg font-bold">BUSINESS</div>
//                 <div className="text-2xl font-bold">
//                   from {flight.businessPrice.toLocaleString()} VND
//                 </div>
//                 <div className="text-sm">per passenger</div>
//                 <Button variant="secondary" className="mt-2">
//                   Select
//                 </Button>
//                 <div className="mt-2 text-sm">{flight.seatsLeft} seats left</div>
//               </div> */}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       {/* Flight Upgrade Modal */}
//       <FlightUpgradeModal
//         isOpen={isUpgradeModalOpen}
//         onClose={() => setIsUpgradeModalOpen(false)}
//         onConfirmUpgrade={handleConfirmUpgrade}
//       />
//     </div>
//   );
// };

// export default SelectFlightPage;
