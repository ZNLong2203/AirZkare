'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import axiosInstance from '@/configs/axios-customize'
import useFlightSearchStore from '@/store/useFlightSearchStore'
import API from '@/constants/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon } from 'lucide-react'
import { Plane, User, Phone, Mail, Flag, Shield, PlusCircle, MinusCircle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface PassengerData {
  id: number;
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  passport: string;
}

interface PassengerFormProps {
  index: number;
  isLeader?: boolean;
  onRemove: () => void;
  passengerData: PassengerData;
  onChange: (index: number, data: PassengerData) => void;
}

const PassengerForm = ({ index, isLeader = false, onRemove, passengerData, onChange }: PassengerFormProps) => {
  const handleInputChange = (field: keyof PassengerData, value: string) => {
    if (field === 'dob') {
      const updatedPassenger = { ...passengerData, [field]: value };
      onChange(index, updatedPassenger);
    } else {
      const updatedPassenger = { ...passengerData, [field]: value };
      onChange(index, updatedPassenger);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-800">
        {isLeader ? "Group Leader" : `Passenger ${index}`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor={`name-${index}`} className="text-indigo-700">Passenger Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id={`name-${index}`}
              placeholder="Full Name"
              className="pl-10 border-indigo-200 focus:border-indigo-500"
              value={passengerData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`dob-${index}`} className="text-indigo-700">Date of Birth</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor={`dob-day-${index}`} className="sr-only">Day</Label>
              <Input
                id={`dob-day-${index}`}
                type="number"
                placeholder="Day"
                min="1"
                max="31"
                className="w-full"
                value={passengerData.dob ? moment(passengerData.dob).format('DD') : ''}
                onChange={(e) => {
                  const day = e.target.value;
                  const currentDate = moment(passengerData.dob || undefined);
                  const newDate = currentDate.date(parseInt(day));
                  handleInputChange('dob', newDate.isValid() ? newDate.format('YYYY-MM-DD') : '');
                }}
              />
            </div>
            <div>
              <Label htmlFor={`dob-month-${index}`} className="sr-only">Month</Label>
              <select
                id={`dob-month-${index}`}
                className="w-full h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                value={passengerData.dob ? moment(passengerData.dob).format('MM') : ''}
                onChange={(e) => {
                  const month = e.target.value;
                  const currentDate = moment(passengerData.dob || undefined);
                  const newDate = currentDate.month(parseInt(month) - 1);
                  handleInputChange('dob', newDate.isValid() ? newDate.format('YYYY-MM-DD') : '');
                }}
              >
                <option value="">Month</option>
                {moment.months().map((month, idx) => (
                  <option key={month} value={String(idx + 1).padStart(2, '0')}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={`dob-year-${index}`} className="sr-only">Year</Label>
              <select
                id={`dob-year-${index}`}
                className="w-full h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                value={passengerData.dob ? moment(passengerData.dob).format('YYYY') : ''}
                onChange={(e) => {
                  const year = e.target.value;
                  const currentDate = moment(passengerData.dob || undefined);
                  const newDate = currentDate.year(parseInt(year));
                  handleInputChange('dob', newDate.isValid() ? newDate.format('YYYY-MM-DD') : '');
                }}
              >
                <option value="">Year</option>
                {Array.from({ length: 124 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`nationality-${index}`} className="text-indigo-700">Nationality</Label>
          <div className="relative">
            <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id={`nationality-${index}`}
              placeholder="Your Nationality"
              className="pl-10 border-indigo-200 focus:border-indigo-500"
              value={passengerData.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`passport-${index}`} className="text-indigo-700">Passport Number</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id={`passport-${index}`}
              placeholder="Passport Number"
              className="pl-10 border-indigo-200 focus:border-indigo-500"
              value={passengerData.passport || ''}
              onChange={(e) => handleInputChange('passport', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-indigo-700">Gender</Label>
          <RadioGroup
            defaultValue={passengerData.gender || "male"}
            className="flex space-x-4"
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            {['Male', 'Female', 'Other'].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender.toLowerCase()} id={`gender-${index}-${gender.toLowerCase()}`} />
                <Label htmlFor={`gender-${index}-${gender.toLowerCase()}`}>{gender}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      {!isLeader && (
        <Button
          type="button"
          variant="ghost"
          className="mt-4 text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          <MinusCircle className="mr-2" size={18} />
          Remove Passenger
        </Button>
      )}
    </div>
  );
};

const PassengerDetails = () => {
  const router = useRouter();
  const setFlightSearch = useFlightSearchStore((state) => state.setFlightSearch);
  const { passengers, departure_come_airport, arrival_come_airport, setPassengers } = useFlightSearchStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fee, setFee] = useState(0);
  const [insuranceOption, setInsuranceOption] = useState("yes");
  const [passengerForms, setPassengerForms] = useState<Array<{ id: number; name: string; dob: string; gender: string; nationality: string; passport: string; }>>([]);

  const departure_come_name = departure_come_airport?.name;
  const arrival_come_name = arrival_come_airport?.name;

  useEffect(() => {
    setPassengerForms(Array.from({ length: passengers }, (_, index) => ({
      id: index + 1,
      name: '',
      dob: '',
      gender: '',
      nationality: '',
      passport: ''
    })));
    setFee(insuranceOption === 'yes' ? 30 * passengers : 0);
  }, [passengers, insuranceOption]);

  const handleSubmit = async () => {
    try {
      setFlightSearch({ fee });

      await axiosInstance.post(`${API.BOOKINGPASSENGER}`, {
        email,
        phone,
        passengersData: passengerForms, 
      }, {
        withCredentials: true,
      });

      router.push('/booking/seat/come');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const addPassenger = () => {
    setPassengerForms(prev => [...prev, { id: prev.length + 1, name: '', dob: '', gender: '', nationality: '', passport: '' }]);
    setPassengers(passengers + 1);
    setFee(insuranceOption === 'yes' ? 30 * (passengers + 1) : 0);
  };

  const removePassenger = (id: number) => {
    if (passengerForms.length > 1) {
      setPassengerForms(prev => prev.filter(form => form.id !== id));
      setPassengers(passengers - 1);
      setFee(insuranceOption === 'yes' ? 30 * (passengers - 1) : 0);
    } else {
      toast.error('You must have at least one passenger.');
    }
  };

  const updatePassenger = (index: number, data: PassengerData) => {
    setPassengerForms(prev => prev.map(form => form.id === index ? { ...form, ...data } : form));
  };

  const handleInsuranceChange = (value: string) => {
    const newFee = value === 'yes' ? 30 * passengers : 0;
    setFee(newFee);
    setFlightSearch({ fee: newFee });
    setInsuranceOption(value);
  };

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
        <h1 className="text-3xl font-bold mb-2 text-indigo-800">{departure_come_name} to {arrival_come_name}</h1>
        <div className="flex items-center text-indigo-600 mb-6">
          <Plane className="mr-2" size={20} />
          <span className="text-lg">Your journey begins here</span>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Passenger Details</h2>
        <p className="text-gray-600 mb-8">Please fill out the personal information for all passengers.</p>

        <form className="space-y-8">
          <div className="space-y-2 mb-8">
            <Label htmlFor="email" className="text-indigo-700">Contact Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="email" 
                placeholder="your@email.com" 
                type="email" 
                className="pl-10 border-indigo-200 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2 mb-8">
            <Label htmlFor="phone" className="text-indigo-700">Contact Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="phone" 
                placeholder="+1 234 567 890" 
                type="tel" 
                className="pl-10 border-indigo-200 focus:border-indigo-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          {passengerForms.map((form, index) => (
            <PassengerForm
              key={form.id}
              index={form.id}
              isLeader={index === 0}
              passengerData={form}
              onChange={updatePassenger}
              onRemove={() => removePassenger(form.id)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            onClick={addPassenger}
          >
            <PlusCircle className="mr-2" size={18} />
            Add Another Passenger
          </Button>

          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <div className="flex items-center mb-4">
              <Shield className="text-indigo-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-indigo-800">Travel Protection</h3>
            </div>
            <p className="text-gray-600 mb-4">Secure your journey with our Smart Insurance for just $30 extra per passenger.</p>
            <RadioGroup value={insuranceOption} onValueChange={handleInsuranceChange} className="flex space-x-4">
              {['Yes, protect my trip', 'No, I\'ll take the risk'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option === 'Yes, protect my trip' ? 'yes' : 'no'} 
                    id={`insurance-${option}`} 
                  />
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
            Continue to Seat Selection
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PassengerDetails;

