import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plane, User, Phone, Mail, Flag, Shield } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from 'next/router'

const PassengerDetails = () => {
  const router = useRouter()
  const [insuranceOption, setInsuranceOption] = useState("yes")
  const [date, setDate] = useState<Date>()

  const handleSubmit = () => {
    // e.preventDefault()
    router.push('/booking/seat')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-12 bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          {['Search', 'Choose flight', 'Passenger details', 'Choose seat', 'Payment'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 ${index <= 2 ? 'bg-indigo-500' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white font-bold mb-2 transition-all duration-300 ease-in-out transform hover:scale-110`}>
                {index + 1}
              </div>
              <span className={`text-sm text-center ${index === 2 ? 'font-bold text-indigo-600' : 'text-gray-600'}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-indigo-800">London to Stockholm</h1>
        <div className="flex items-center text-indigo-600 mb-6">
          <Plane className="mr-2" size={20} />
          <span className="text-lg">Your journey begins here</span>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Passenger Details</h2>
        <p className="text-gray-600 mb-8">Please fill out your personal information accurately.</p>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="email" placeholder="your@email.com" type="email" className="pl-10 border-indigo-200 focus:border-indigo-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-indigo-700">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="phone" placeholder="+1 234 567 890" type="tel" className="pl-10 border-indigo-200 focus:border-indigo-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-indigo-700">Passenger Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="name" placeholder="Full Name" className="pl-10 border-indigo-200 focus:border-indigo-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-indigo-700">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"} border-indigo-200 focus:border-indigo-500`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-indigo-700">Nationality</Label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="nationality" placeholder="Your Nationality" className="pl-10 border-indigo-200 focus:border-indigo-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-indigo-700">Gender</Label>
              <RadioGroup defaultValue="male" className="flex space-x-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <RadioGroupItem value={gender.toLowerCase()} id={gender.toLowerCase()} />
                    <Label htmlFor={gender.toLowerCase()}>{gender}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <div className="flex items-center mb-4">
              <Shield className="text-indigo-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-indigo-800">Travel Protection</h3>
            </div>
            <p className="text-gray-600 mb-4">Secure your journey with our Smart Insurance for just $30 extra.</p>
            <RadioGroup value={insuranceOption} onValueChange={setInsuranceOption} className="flex space-x-4">
              {['Yes, protect my trip', 'No, I\'ll take the risk'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option === 'Yes, protect my trip' ? 'yes' : 'no'} id={`insurance-${option}`} />
                  <Label htmlFor={`insurance-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button 
            type="button"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleSubmit}
          >
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PassengerDetails