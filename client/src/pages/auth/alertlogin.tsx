import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneIcon } from "lucide-react";
import Link from "next/link";

export default function LoginWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <PlaneIcon className="h-8 w-8 text-sky-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-sky-900">Log in to Book Your Flight</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            To proceed with booking and payment for your flight, please log in or create a new account.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            Logging in helps us protect your information and provide a more convenient booking experience.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}