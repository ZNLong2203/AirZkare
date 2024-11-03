import axios from "axios";
import API from "@/constants/api";
import toast from "react-hot-toast";
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
    total_price 
  } = useFlightSearchStore();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "zalopay">("stripe");

  let token = null;
  if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
  }

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

  const handleZaloPayPayment = () => {
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
                  <p className="text-sm text-muted-foreground">Ha Noi (HAN) to Paris (CDG)</p>
                  <p className="text-sm text-muted-foreground">August 15, 2023 • 10:30 AM</p>
                </div>
                <ArrowRight className="text-primary" />
                <div className="space-y-1 text-right">
                  <p className="font-semibold text-foreground">Arrival</p>
                  <p className="text-sm text-muted-foreground">Paris (CDG)</p>
                  <p className="text-sm text-muted-foreground">August 15, 2023 • 5:25 PM</p>
                </div>
              </div>

              <Separator />

              {/* Return Flight */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Return</p>
                  <p className="text-sm text-muted-foreground">Paris (CDG) to Ha Noi (HAN)</p>
                  <p className="text-sm text-muted-foreground">August 22, 2023 • 1:30 PM</p>
                </div>
                <ArrowLeft className="text-primary" />
                <div className="space-y-1 text-right">
                  <p className="font-semibold text-foreground">Arrival</p>
                  <p className="text-sm text-muted-foreground">Ha Noi (HAN)</p>
                  <p className="text-sm text-muted-foreground">August 23, 2023 • 6:45 AM</p>
                </div>
              </div>

              <Separator />

              {/* Passengers */}
              <div className="flex items-center space-x-4">
                <Users className="text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Passengers: 1 Adult</p>
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
                <p className="font-semibold text-foreground">$2,399.98</p>
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