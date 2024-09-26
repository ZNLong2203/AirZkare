import { useState, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Airplane } from "@/schemas/Airplane";

interface AirplaneAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (airplane: Omit<Airplane, 'airplane_id'>) => void;
}

const AirplaneAddModal: FC<AirplaneAddModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [airplaneName, setAirplaneName] = useState('');
    const [airplaneModel, setAirplaneModel] = useState('');
    const [totalBusiness, setTotalBusiness] = useState<number>(0);
    const [totalEconomy, setTotalEconomy] = useState<number>(0);

    const handleSubmit = () => {
        onSubmit({
            name: airplaneName,
            model: airplaneModel,
            total_business: totalBusiness,
            total_economy: totalEconomy,
        });
        setAirplaneName('');
        setAirplaneModel('');
        setTotalBusiness(0);
        setTotalEconomy(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Airplane</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="airplaneName">Airplane Name</Label>
                        <Input
                            id="airplaneName"
                            value={airplaneName}
                            onChange={(e) => setAirplaneName(e.target.value)}
                            placeholder="Enter airplane name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="airplaneModel">Model</Label>
                        <Input
                            id="airplaneModel"
                            value={airplaneModel}
                            onChange={(e) => setAirplaneModel(e.target.value)}
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
                <Button onClick={handleSubmit} className="w-full">
                    Add Airplane
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AirplaneAddModal;