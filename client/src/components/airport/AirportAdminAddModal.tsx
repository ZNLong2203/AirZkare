import { useState, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AirportAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (airport: { code: string; name: string; location: string }) => void;
}

const AirportAddModal: FC<AirportAddModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [airportName, setAirportName] = useState('');
    const [airportCode, setAirportCode] = useState('');
    const [airportLocation, setAirportLocation] = useState('');

    const handleSubmit = () => {
        onSubmit({ code: airportCode, name: airportName, location: airportLocation });
        setAirportName('');
        setAirportCode('');
        setAirportLocation('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Airport</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="airportCode">Airport Code</Label>
                        <Input
                            id="airportCode"
                            value={airportCode}
                            onChange={(e) => setAirportCode(e.target.value)}
                            placeholder="Enter airport code"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="airportName">Airport Name</Label>
                        <Input
                            id="airportName"
                            value={airportName}
                            onChange={(e) => setAirportName(e.target.value)}
                            placeholder="Enter airport name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="airportLocation">Location</Label>
                        <Input
                            id="airportLocation"
                            value={airportLocation}
                            onChange={(e) => setAirportLocation(e.target.value)}
                            placeholder="Enter airport location"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Add Airport
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AirportAddModal;