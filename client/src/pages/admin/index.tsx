import { AiOutlineDashboard, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import { FaPlaneDeparture } from 'react-icons/fa'; 
import { IoAirplane } from "react-icons/io5";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { useRouter } from 'next/router';
import SideBarAdmin from '@/components/common/SideBarAdmin';

const AdminHome = () => {
    const router = useRouter();
    
    return (
        <div className="min-h-screen flex bg-gray-100">
           <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Welcome to the Admin Home</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                    <div 
                        className="bg-white p-6 rounded-lg shadow-md"
                        onClick={() => router.push('/admin/dashboard')}
                    >
                        <AiOutlineDashboard className="text-blue-600 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
                        <p className="text-gray-600">View overall statistics of your airline booking system.</p>
                    </div>

                    <div    
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        onClick={() => router.push('/admin/airports')}
                    >
                        <FaPlaneDeparture className="text-red-500 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Manage Airports</h2>
                        <p className="text-gray-600">Add, update, or remove airport details.</p>
                    </div>

                    <div    
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        onClick={() => router.push('/admin/airplanes')}
                    >
                        <IoAirplane className="text-gray-600 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Manage Airplanes</h2>
                        <p className="text-gray-600">Add, update, or remove airplane details.</p>
                    </div>

                    <div 
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        onClick={() => router.push('/admin/flights')}
                    >
                        <MdOutlineAirplaneTicket className="text-green-600 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Manage Flights</h2>
                        <p className="text-gray-600">Add, update, or remove flights.</p>
                    </div>

                    <div    
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        onClick={() => router.push('/admin/passengers')}
                    >
                        <AiOutlineUser className="text-purple-600 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Manage Passengers</h2>
                        <p className="text-gray-600">View and manage passengers data.</p>
                    </div>

                    <div 
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        onClick={() => router.push('/admin/settings')}
                    >
                        <AiOutlineSetting className="text-yellow-600 text-3xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Settings</h2>
                        <p className="text-gray-600">Customize your dashboard and system preferences.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminHome;
