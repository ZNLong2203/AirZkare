import axios from "axios";
import API from "@/constants/api";
import toast from "react-hot-toast";
import moment from "moment";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  ArrowRight,
  Plane,
  Users,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51PQmYTIYYB20QSq1o1yZlZ61qHl6ZgNtOhgkHXGI14siKnCf9LEV23WAkK6sLnOheYO06ds9fXXJQZKC6Kn2u4k8005CXtvDgp")

const PaymentPage = () => {
  const { 
    departure_come_airport,
    arrival_come_airport,
    departure_come_time,
    flight_come,
    departure_return_airport,
    arrival_return_airport,
    departure_return_time,
    flight_return,
    type,
    passengers,
    total_price 
  } = useFlightSearchStore();
  const saveToLocalStorage = useFlightSearchStore((state) => state.saveToLocalStorage);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "zalopay">("stripe");

  let token = null;
  if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
  }

  const departure_come_airport_name = departure_come_airport?.location;
  const departure_come_airport_code = departure_come_airport?.code;
  const arrival_come_airport_name = arrival_come_airport?.location;
  const arrival_come_airport_code = arrival_come_airport?.code;
  const arrival_come_time = flight_come?.arrival_time;

  const departure_return_airport_name = departure_return_airport?.location;
  const departure_return_airport_code = departure_return_airport?.code;
  const arrival_return_airport_name = arrival_return_airport?.location;
  const arrival_return_airport_code = arrival_return_airport?.code;
  const arrival_return_time = flight_return?.arrival_time;

  const handleStripePayment = async () => {
    try {
      const res = await axios.post(`${API.PAYMENTSTRIPE}`, {
        amount: total_price || 5000,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      saveToLocalStorage();

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: res.data.metadata.id, 
        });
        if (error) {
          console.error("Error redirecting to checkout:", error);
        }
      } else {
        console.error("Stripe has not loaded.");
      }
    } catch(err) {
      toast.error("An error occurred while processing your payment.");
    }
  };

  const handleZaloPayPayment = async () => {
    try {
      const res = await axios.post(`${API.PAYMENTZALOPAY}`, {
        amount: total_price || 5000,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      saveToLocalStorage();

      window.location.href = res.data.metadata.order_url;
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve("Payment successful!");
          }, 3000);
        }),
        {
          loading: "Processing your payment...",
          success: "Payment successful!",
          error: "An error occurred while processing your payment.",
        }
      );
    } catch(err) {
      toast.error("An error occurred while processing your payment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen">
      {/* Progress Bar */}
      <div className="mb-12 bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          {["Search", "Choose flight", "Passenger details", "Choose seat", "Payment"].map(
            (step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 ${
                    index <= 4 ? "bg-indigo-500" : "bg-gray-300"
                  } rounded-full flex items-center justify-center text-white font-bold mb-2 transition-all duration-300 ease-in-out transform hover:scale-110`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm text-center ${
                    index === 4 ? "font-bold text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {step}
                </span>
              </div>
            )
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col space-y-8">
        {/* Top Row: Flight Details and Payment Method */}
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Flight Details Card */}
          <Card className="w-full md:w-2/3 shadow-lg border-t-4 border-primary">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-foreground flex items-center">
                <Plane className="mr-2 text-primary" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Outbound Flight */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Outbound</p>
                  <p className="text-sm text-muted-foreground">{departure_come_airport_name} ({departure_come_airport_code})</p>
                  <p className="text-sm text-muted-foreground">{moment(departure_come_time, "YYYY-MM-DD HH:mm:ss").format("MMMM D, YYYY • h:mm A")}</p>
                </div>
                <ArrowRight className="text-primary" />
                <div className="space-y-1 text-right">
                  <p className="font-semibold text-foreground">Arrival</p>
                  <p className="text-sm text-muted-foreground">{arrival_come_airport_name} ({arrival_come_airport_code})</p>
                  <p className="text-sm text-muted-foreground">{moment(arrival_come_time, "YYYY-MM-DD HH:mm:ss").format("MMMM D, YYYY • h:mm A")}</p>
                </div>
              </div>

              <Separator />

              {/* Return Flight */}
              {type === "oneWay" ? null : (  
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">Return</p>
                    <p className="text-sm text-muted-foreground">{departure_return_airport_name} ({departure_return_airport_code})</p>
                    <p className="text-sm text-muted-foreground">{moment(departure_return_time, "YYYY-MM-DD HH:mm:ss").format("MMMM D, YYYY • h:mm A")}</p>
                  </div>
                  <ArrowLeft className="text-primary" />
                  <div className="space-y-1 text-right">
                    <p className="font-semibold text-foreground">Arrival</p>
                    <p className="text-sm text-muted-foreground">{arrival_return_airport_name} ({arrival_return_airport_code})</p>
                    <p className="text-sm text-muted-foreground">{moment(arrival_return_time, "YYYY-MM-DD HH:mm:ss").format("MMMM D, YYYY • h:mm A")}</p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Passengers */}
              <div className="flex items-center space-x-4">
                <Users className="text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Passengers: {passengers} Adult</p>
                  <p className="text-sm text-muted-foreground">Business Class</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="w-full md:w-1/3 shadow-lg border-t-4 border-primary">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-foreground flex items-center">
                <CreditCard className="mr-2 text-primary" />
                Payment Method
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose how you&apos;d like to pay
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <RadioGroup
                defaultValue="stripe"
                onValueChange={(value) => setPaymentMethod(value as "stripe" | "zalopay")}
              >
                {/* Stripe Option */}
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer">
                    <CreditCard className="mr-2 text-primary" />
                    Stripe
                  </Label>
                </div>

                {/* ZaloPay Option */}
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                  <RadioGroupItem value="zalopay" id="zalopay" />
                  <Label htmlFor="zalopay" className="flex items-center cursor-pointer">
                    <Smartphone className="mr-2 text-primary" />
                    ZaloPay
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-4" />

              {/* Payment Forms */}
              {paymentMethod === "stripe" ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pay securely with your credit card using Stripe.
                  </p>
                  <Button
                    onClick={handleStripePayment}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                  >
                    Pay with Stripe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pay securely with your ZaloPay account.
                  </p>
                  <Button
                    onClick={handleZaloPayPayment}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                  >
                    Pay with ZaloPay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50">
              <p className="text-sm text-muted-foreground flex items-center">
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                Your payment information is secure and encrypted.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom Row: Price Summary */}
        <div className="w-full">
          <Card className="bg-white shadow-lg border-t-4 border-primary">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-foreground flex items-center">
                <ShoppingCart className="mr-2 text-primary" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Base Fare</p>
                <p className="font-semibold text-foreground">${total_price}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Taxes & Fees</p>
                <p className="font-semibold text-foreground">$200.00</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <p className="font-semibold text-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">$2,599.98</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;