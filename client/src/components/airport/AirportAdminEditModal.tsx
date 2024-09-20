import React, { useState, useEffect, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AirportEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    airportData: {
        airport_id: string;
        name: string;
        code: string;
        location: string;
    };
    onSubmit: (data: { airport_id: string; code: string; name: string; location: string }) => void;
}

const AirportEditModal: FC<AirportEditModalProps> = ({ isOpen, onClose, airportData, onSubmit }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (airportData) {
            setName(airportData.name);
            setCode(airportData.code);
            setLocation(airportData.location);
        }
    }, [airportData]);

    const handleSubmit = () => {
        onSubmit({ airport_id: airportData.airport_id, code, name, location });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Airport</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">Airport Code</Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter airport code"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Airport Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter airport name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter airport location"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AirportEditModal;