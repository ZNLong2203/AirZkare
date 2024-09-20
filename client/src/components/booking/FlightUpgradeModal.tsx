import React, { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FlightUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmUpgrade: () => void;
}

const FlightUpgradeModal: FC<FlightUpgradeModalProps> = ({ isOpen, onClose, onConfirmUpgrade }) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nâng hạng vé</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-2">
                            Nâng hạng lên Phổ Thông Tiêu Chuẩn chỉ với 2.052.000 VND
                        </h3>
                        <p>Tận hưởng chuyến bay với nhiều quyền lợi hơn</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {/* Fare Class Comparison */}
                        <div className="bg-white shadow-md rounded-md p-4 border-t-4 border-blue-500">
                            <h4 className="font-semibold text-lg text-center">Phổ Thông Tiết Kiệm</h4>
                            <ul className="mt-2 text-sm space-y-2">
                                <li>Phí đổi vé tối đa: <span className="font-medium">1.000.000 VND</span> mỗi hành khách</li>
                                <li>Phí hoàn vé tối đa: <span className="font-medium">2.000.000 VND</span> mỗi hành khách</li>
                                <li>Hành lý ký gửi: <span className="font-medium">1 x 23 kg</span></li>
                                <li>Hành lý xách tay: <span className="font-medium">Không quá 12kg</span></li>
                                <li>Số dặm tích lũy: <span className="font-medium">Tích lũy 60% số dặm</span></li>
                            </ul>
                        </div>

                        <div className="bg-white shadow-md rounded-md p-4 border-t-4 border-blue-500">
                            <h4 className="font-semibold text-lg text-center">Phổ Thông Tiêu Chuẩn</h4>
                            <ul className="mt-2 text-sm space-y-2">
                                <li>Phí đổi vé tối đa: <span className="font-medium">860.000 VND</span> mỗi hành khách</li>
                                <li>Phí hoàn vé tối đa: <span className="font-medium">1.720.000 VND</span> mỗi hành khách</li>
                                <li>Hành lý ký gửi: <span className="font-medium">1 x 23 kg</span></li>
                                <li>Hành lý xách tay: <span className="font-medium">Không quá 12kg</span></li>
                                <li>Số dặm tích lũy: <span className="font-medium">Tích lũy 80% số dặm</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        {/* Buttons */}
                        <Button className="bg-yellow-500 text-white" onClick={onClose}>
                            Giữ Phổ Thông Tiết Kiệm
                        </Button>
                        <Button className="bg-blue-600 text-white" onClick={onConfirmUpgrade}>
                            Nâng hạng lên Phổ Thông Tiêu Chuẩn
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FlightUpgradeModal;
