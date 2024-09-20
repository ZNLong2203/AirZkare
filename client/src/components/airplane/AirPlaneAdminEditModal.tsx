import React, { useState, useEffect, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AirplaneEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    airplaneData: {
        airplane_id: string;
        name: string;
        model: string;
        total_business: number;
        total_economy: number;
    };
    onSubmit: (data: { airplane_id: string; name: string; model: string; total_business: number; total_economy: number }) => void;
}

const AirplaneEditModal: FC<AirplaneEditModalProps> = ({ isOpen, onClose, airplaneData, onSubmit }) => {
    const [name, setName] = useState('');
    const [model, setModel] = useState('');
    const [totalBusiness, setTotalBusiness] = useState<number>(0);
    const [totalEconomy, setTotalEconomy] = useState<number>(0);

    useEffect(() => {
        if (airplaneData) {
            setName(airplaneData.name);
            setModel(airplaneData.model);
            setTotalBusiness(airplaneData.total_business);
            setTotalEconomy(airplaneData.total_economy);
        }
    }, [airplaneData]);

    const handleSubmit = () => {
        onSubmit({
            airplane_id: airplaneData.airplane_id,
            name,
            model,
            total_business: totalBusiness,
            total_economy: totalEconomy,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Airplane</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Airplane Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter airplane name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Enter airplane model"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="totalBusiness">Business Class Seats</Label>
                        <Input
                            id="totalBusiness"
                            type="number"
                            value={totalBusiness}
                            onChange={(e) => setTotalBusiness(parseInt(e.target.value))}
                            placeholder="Enter number of business class seats"
                        />
                        <p className="text-sm text-muted-foreground">Number must be divisible by 4</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="totalEconomy">Economy Class Seats</Label>
                        <Input
                            id="totalEconomy"
                            type="number"
                            value={totalEconomy}
                            onChange={(e) => setTotalEconomy(parseInt(e.target.value))}
                            placeholder="Enter number of economy class seats"
                        />
                        <p className="text-sm text-muted-foreground">Number must be divisible by 6</p>
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

export default AirplaneEditModal;