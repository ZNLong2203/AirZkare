/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User, Flag, MinusCircle } from "lucide-react";
import { format } from "date-fns";

interface PassengerFormProps {
  index: number;
  isLeader?: boolean;
  onRemove: () => void;
  passengerData: any;
  onChange: (index: number, data: any) => void;
}

const PassengerForm = ({ index, isLeader = false, onRemove, passengerData, onChange }: PassengerFormProps) => {
  const [date, setDate] = useState<Date>();

  const handleInputChange = (field: string, value: any) => {
    const updatedPassenger = { ...passengerData, [field]: value };
    onChange(index, updatedPassenger);
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
              value={passengerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`dob-${index}`} className="text-indigo-700">Date of Birth</Label>
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
                onSelect={(d) => {
                  setDate(d);
                  handleInputChange('dob', d);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`nationality-${index}`} className="text-indigo-700">Nationality</Label>
          <div className="relative">
            <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              id={`nationality-${index}`} 
              placeholder="Your Nationality" 
              className="pl-10 border-indigo-200 focus:border-indigo-500"
              value={passengerData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
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

export default PassengerForm;
