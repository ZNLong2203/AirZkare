import React from 'react';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import { MdFlightTakeoff } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import Link from 'next/link';

const SideBarAdmin = () => {
    return (
        <aside className="w-64 bg-blue-900 text-white flex flex-col">
            <div className="px-7 py-2 text-2xl font-bold mt-5">Admin Home</div>
            <nav className="flex-1 px-3 py-4 space-y-2">
                <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white rounded">
                    <AiOutlineDashboard className="mr-3 text-xl" />
                    Dashboard
                </Link>
                <Link href="/admin/flights" className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white rounded">
                    <MdFlightTakeoff className="mr-3 text-xl" />
                    Flights
                </Link>
                <Link href="/admin/customers" className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white rounded">
                    <AiOutlineUser className="mr-3 text-xl" />
                    Customers
                </Link>
                <Link href="/admin/settings" className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white rounded">
                    <AiOutlineSetting className="mr-3 text-xl" />
                    Settings
                </Link>
            </nav>
            <div className="px-2 py-4">
                <Link href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white rounded">
                    <FiLogOut className="mr-2 text-xl" />
                    Logout
                </Link>
            </div>
        </aside>
    )
}

export default SideBarAdmin;