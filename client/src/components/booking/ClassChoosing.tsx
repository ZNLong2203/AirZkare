import React, { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

interface ClassSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmUpgrade: () => void;
    onKeepCurrent: () => void;
    flightEconomyPrice?: number;
    flightBusinessPrice?: number;
}

const ClassSelectionDialog: FC<ClassSelectionDialogProps> = ({ isOpen, onClose, onConfirmUpgrade, onKeepCurrent, flightEconomyPrice, flightBusinessPrice }) => {
    if (!isOpen) return null;

    const upgradePrice = flightBusinessPrice && flightEconomyPrice ? (flightBusinessPrice - flightEconomyPrice) : undefined;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Select Your Seat Class</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    {upgradePrice !== undefined && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-blue-800">
                                Upgrade to Business Class for just {upgradePrice.toLocaleString()} VND more!
                            </h3>
                            <p className="text-blue-600">Enjoy a premium flight experience with extra benefits</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Economy Class */}
                        <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-teal-500">
                            <h4 className="font-bold text-xl text-center text-teal-700 mb-4">Economy Class</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <Check className="text-teal-500 mr-2" size={18} />
                                    <span>Seat selection: <span className="font-medium">Standard</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-teal-500 mr-2" size={18} />
                                    <span>Baggage allowance: <span className="font-medium">1 x 23 kg</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-teal-500 mr-2" size={18} />
                                    <span>Carry-on: <span className="font-medium">Up to 7 kg</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-teal-500 mr-2" size={18} />
                                    <span>Miles accrual: <span className="font-medium">100%</span></span>
                                </li>
                                <li className="flex items-center">
                                    <X className="text-red-500 mr-2" size={18} />
                                    <span className="text-gray-500">Priority boarding</span>
                                </li>
                                <li className="flex items-center">
                                    <X className="text-red-500 mr-2" size={18} />
                                    <span className="text-gray-500">Lounge access</span>
                                </li>
                            </ul>
                        </div>

                        {/* Business Class */}
                        <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-yellow-500">
                            <h4 className="font-bold text-xl text-center text-yellow-700 mb-4">Business Class</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Seat selection: <span className="font-medium">Premium (extra legroom)</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Baggage allowance: <span className="font-medium">2 x 32 kg</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Carry-on: <span className="font-medium">Up to 10 kg</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Miles accrual: <span className="font-medium">150%</span></span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Priority boarding</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-yellow-500 mr-2" size={18} />
                                    <span>Lounge access</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <Button 
                            variant="outline" 
                            className="border-teal-500 text-teal-700 hover:bg-teal-50" 
                            onClick={onKeepCurrent}
                        >
                            Keep Economy Class
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-gray-300 text-gray-600 hover:bg-gray-50" 
                            onClick={onClose}
                        >
                            Back to Seat Selection
                        </Button>
                        <Button 
                            className="bg-yellow-500 text-white hover:bg-yellow-600" 
                            onClick={onConfirmUpgrade}
                        >
                            Upgrade to Business Class
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ClassSelectionDialog;
