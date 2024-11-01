import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  ArrowRight,
  Plane,
  Users,
  ArrowLeft,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51PQmYTIYYB20QSq1o1yZlZ61qHl6ZgNtOhgkHXGI14siKnCf9LEV23WAkK6sLnOheYO06ds9fXXJQZKC6Kn2u4k8005CXtvDgp")

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "momo">("stripe");
  const [momoNumber, setMomoNumber] = useState("");

  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: "your-session-id-here", 
      });
      if (error) {
        console.error("Error redirecting to checkout:", error);
      }
    } else {
      console.error("Stripe has not loaded.");
    }
  };

  const handleMomoPayment = () => {
    console.log("Processing MoMo payment with number:", momoNumber);
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
      <div className="flex flex-col lg:flex-row justify-between items-start space-y-8 lg:space-y-0">
        {/* Left Column */}
        <div className="w-full lg:w-7/12 space-y-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Purchase</h1>
          <p className="text-gray-600">Please review your flight carefully</p>

          {/* Flight Details Card */}
          <Card className="bg-white shadow-lg border-t-4 border-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <Plane className="mr-2 text-blue-500" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Outbound Flight */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">Outbound</p>
                  <p className="text-sm text-gray-600">Ha Noi (HAN) to Paris (CDG)</p>
                  <p className="text-sm text-gray-600">August 15, 2023 • 10:30 AM</p>
                </div>
                <ArrowRight className="text-blue-500" />
                <div className="space-y-1 text-right">
                  <p className="font-semibold text-gray-700">Arrival</p>
                  <p className="text-sm text-gray-600">Paris (CDG)</p>
                  <p className="text-sm text-gray-600">August 15, 2023 • 5:25 PM</p>
                </div>
              </div>

              <Separator />

              {/* Return Flight */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">Return</p>
                  <p className="text-sm text-gray-600">Paris (CDG) to Ha Noi (HAN)</p>
                  <p className="text-sm text-gray-600">August 22, 2023 • 1:30 PM</p>
                </div>
                <ArrowLeft className="text-blue-500" />
                <div className="space-y-1 text-right">
                  <p className="font-semibold text-gray-700">Arrival</p>
                  <p className="text-sm text-gray-600">Ha Noi (HAN)</p>
                  <p className="text-sm text-gray-600">August 23, 2023 • 6:45 AM</p>
                </div>
              </div>

              <Separator />

              {/* Passengers */}
              <div className="flex items-center space-x-4">
                <Users className="text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-700">Passengers: 1 Adult</p>
                  <p className="text-sm text-gray-600">Business Class</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary Card */}
          <Card className="bg-white shadow-lg border-t-4 border-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <ShoppingCart className="mr-2 text-green-500" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Base Fare</p>
                <p className="font-semibold text-gray-700">$2,399.98</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Taxes & Fees</p>
                <p className="font-semibold text-gray-700">$200.00</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">Total</p>
                <p className="text-2xl font-bold text-green-600">$2,599.98</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-4/12">
          {/* Payment Method Card */}
          <Card className="bg-white shadow-xl border-t-4 border-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <CreditCard className="mr-2 text-purple-500" />
                Payment Method
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you dont like to pay
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                defaultValue="stripe"
                onValueChange={(value) => setPaymentMethod(value as "stripe" | "momo")}
              >
                {/* Stripe Option */}
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer">
                    <CreditCard className="mr-2 text-purple-600" />
                    Stripe
                  </Label>
                </div>

                {/* MoMo Option */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="momo" id="momo" />
                  <Label htmlFor="momo" className="flex items-center cursor-pointer">
                    <Smartphone className="mr-2 text-pink-600" />
                    MoMo
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-6" />

              {/* Payment Forms */}
              {paymentMethod === "stripe" ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Pay securely with your credit card using Stripe.
                  </p>
                  <Button
                    onClick={handleStripePayment} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Pay with Stripe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="momo-number" className="text-gray-700">
                      MoMo Number
                    </Label>
                    <Input
                      id="momo-number"
                      placeholder="Enter your MoMo number"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <Button
                    onClick={handleMomoPayment}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Pay with MoMo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50">
              <p className="text-sm text-gray-600 flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4 text-gray-400" />
                Your payment information is secure and encrypted.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;