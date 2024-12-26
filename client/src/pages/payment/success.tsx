import axiosInstance from "@/configs/axios-customize"
import API from "@/constants/api"
import toast from "react-hot-toast"
// import useFlightSearchStore from "@/store/useFlightSearchStore"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, FileText } from "lucide-react"
import { useRouter } from "next/router"

const PaymentConfirmation = () => {
  const router = useRouter()

  let paymentData = null;
  if (typeof window !== "undefined") {
      const paymentDataString = localStorage.getItem("flightSearchState");
      paymentData = paymentDataString ? JSON.parse(paymentDataString) : null;
  }

  useEffect(() => {
    const fetchSuccess = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search)
        const sessionId = queryParams.get("session_id")
        const payment = queryParams.get("payment")

        if(payment == "stripe") {
          await axiosInstance.post(`${API.PAYMENTSTRIPE}/success?session_id=${sessionId}`, { paymentData }, 
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          )
        } else if (payment == "zalopay") {
          await axiosInstance.post(`${API.PAYMENTZALOPAY}/success?session_id=${sessionId}`, { paymentData }, 
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              }
            })
        }
      } catch(err) {
        console.error(err)
        toast.error("An error occurred. Please try again.")
      }
    }
    fetchSuccess();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">Thank you for booking with us. Your flight is confirmed.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Next Steps:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Check your email for a detailed itinerary</li>
              <li>Review our check-in guidelines</li>
              <li>Arrive at the airport at least 2 hours before departure</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="w-[48%]"
            onClick={() => router.push('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
          <Button 
            className="w-[48%]"
            onClick={() => router.push('/user/tickets')}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PaymentConfirmation