"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/configs/axios-customize";
import API from "@/constants/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import ErrorMessage from "@/components/common/ErrorMessageQuery";
import LoadingQuery from "@/components/common/LoadingQuery";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
// import { useTheme } from "next-themes"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Airport {
  airport_id: string;
  name: string;
  location: string;
}

interface Airplane {
  airplane_id: string;
  name: string;
  model: string;
}

interface Flight {
  flight_id: string;
  code: string;
  airport_flight_arrival_airportToairport: Airport;
  airport_flight_departure_airportToairport: Airport;
  departure_time: string;
  status: string;
  airplane: Airplane;
}

interface Passenger {
  flight_seat: {
    flight: Flight;
  }[];
}

interface BookingPassenger {
  passenger: Passenger;
}

interface Payment {
  payment_id: string;
  amount: number;
  method: string;
}

interface BookingDetails {
  booking_id: string;
  status: "pending" | "confirmed" | "cancelled";
  time: string;
  type: "oneWay" | "roundTrip";
  payment: Payment[];
  booking_passenger: BookingPassenger[];
}

const fetchBookingDetails = async (
  booking_id: string
): Promise<BookingDetails> => {
  const res = await axiosInstance.get(`${API.BOOKING}/${booking_id}`, {
    withCredentials: true,
  });
  return res.data.metadata;
};

const downloadPDF = () => {
  const element = document.getElementById("booking-details-pdf");
  if (!element) {
    console.error("Element with ID 'booking-details-pdf' not found!");
    return;
  }

  document.body.classList.add("printing");

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#F9FAFB",
    ignoreElements: (el) => {
      return el.classList && el.classList.contains("no-pdf");
    },  
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 200) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }    

    pdf.save("booking-details.pdf");
    document.body.classList.remove("printing");
  }).catch((error) => {
    console.error("Error generating PDF:", error);
    document.body.classList.remove("printing");
  });
};

const BookingDetails = () => {
  const params = useParams();
  const booking_id = params?.id as string;
  const { data, error, isError, isLoading } = useQuery<BookingDetails, Error>({
    queryKey: ["bookingDetails", booking_id],
    queryFn: () => fetchBookingDetails(booking_id),
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) return <LoadingQuery />;
  if (isError) return <ErrorMessage message={error.message} />;

  const outboundFlight =
    data?.booking_passenger[0]?.passenger.flight_seat[0]?.flight;
  const returnFlight =
    data?.booking_passenger[0]?.passenger.flight_seat[1]?.flight;

  return (
    <div
      id="booking-details-pdf"
      className="bg-gray-50 min-h-screen p-4 md:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl flex items-center gap-2">
                <Plane className="h-8 w-8" />
                Booking Details
              </CardTitle>
              <Badge
                variant="outline"
                className={`capitalize text-sm px-3 py-1 ${getStatusStyle(
                  data?.status || "pending"
                )}`}
              >
                {data?.status}
              </Badge>
            </div>
            <p className="text-blue-100 mt-2 text-lg">
              {data?.type === "roundTrip" ? "Round Trip" : "One Way"} Flight
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Booking Information
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Booking Date:</span>{" "}
                    {data?.time ? new Date(data.time).toLocaleString() : ""}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Booking ID:</span>{" "}
                    {data?.booking_id}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Payment:</span> $
                    {((data?.payment[0]?.amount ?? 0) / 100).toFixed(2)} (
                    {data?.payment[0]?.method})
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Passenger Information
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      Number of Passengers:
                    </span>{" "}
                    {data?.booking_passenger.length}
                  </p>
                  {/* Add more passenger details here if available */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {outboundFlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ArrowRight className="h-6 w-6" />
                  Outbound Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FlightDetails flight={outboundFlight} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {returnFlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ArrowLeft className="h-6 w-6" />
                  Return Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FlightDetails flight={returnFlight} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mt-8 no-print"
        >
          <Button
            onClick={downloadPDF}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white no-pdf"
          >
            Download Booking Details as PDF
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FlightDetails = ({ flight }: { flight: Flight }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700";
      case "delayed":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900 dark:text-rose-100 dark:border-rose-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-lg">
          <Plane className="h-6 w-6 text-blue-500" />
          <span className="font-semibold">Flight Number:</span> {flight.code}
        </p>
        <Badge
          variant="outline"
          className={`capitalize text-sm px-3 py-1 ${getStatusStyle(
            flight.status
          )}`}
        >
          {flight.status}
        </Badge>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-lg">Departure:</span>
          </p>
          <p className="ml-7 text-lg">
            {flight.airport_flight_departure_airportToairport.name}
          </p>
          <p className="ml-7 text-gray-600 dark:text-gray-400">
            {flight.airport_flight_departure_airportToairport.location}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-lg">Arrival:</span>
          </p>
          <p className="ml-7 text-lg">
            {flight.airport_flight_arrival_airportToairport.name}
          </p>
          <p className="ml-7 text-gray-600 dark:text-gray-400">
            {flight.airport_flight_arrival_airportToairport.location}
          </p>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">Departure Time:</span>{" "}
          {new Date(flight.departure_time).toLocaleString()}
        </p>
        <div>
          <p className="font-semibold text-lg mb-2">Airplane Details:</p>
          <p className="ml-7">
            {flight.airplane.name} ({flight.airplane.model})
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
