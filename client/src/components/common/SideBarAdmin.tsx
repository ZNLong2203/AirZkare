import React from 'react';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import { IoAirplane } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { FaPlaneDeparture } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SideBarAdmin: React.FC = () => {
    const router = useRouter();
    const { pathname } = router;

    const activeClassName = 'flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md';
    const defaultClassName = 'flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-100 hover:text-blue-800';

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: AiOutlineDashboard },
        { href: '/admin/airports', label: 'Airports', icon: FaPlaneDeparture },
        { href: '/admin/airplanes', label: 'Airplanes', icon: IoAirplane },
        { href: '/admin/flights', label: 'Flights', icon: MdOutlineAirplaneTicket },
        { href: '/admin/users', label: 'Users', icon: AiOutlineUser },
        { href: '/admin/settings', label: 'Settings', icon: AiOutlineSetting },
    ];

    return (
        <aside className="flex flex-col h-screen w-64 bg-blue-50 border-r border-blue-100">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-blue-800">Admin Home</h2>
            </div>
            <nav className="flex-grow space-y-1 px-3">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={pathname === href ? activeClassName : defaultClassName}
                    >
                        <Icon className="mr-3 h-5 w-5" />
                        <span className="truncate">{label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4">
                <button
                    onClick={() => {/* Add logout logic here */}}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
                >
                    <FiLogOut className="mr-3 h-5 w-5" />
                    <span className="truncate">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SideBarAdmin;
