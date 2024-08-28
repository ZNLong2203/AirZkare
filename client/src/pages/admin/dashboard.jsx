import { AiOutlineBarChart, AiOutlineUser, AiOutlineFile, AiOutlineSetting } from 'react-icons/ai';
import SideBarAdmin from '@/components/SideBarAdmin';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <AiOutlineFile className="text-blue-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Flights</h2>
                            <p className="text-gray-500">Manage flight details</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <AiOutlineUser className="text-green-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Customers</h2>
                            <p className="text-gray-500">Manage customer details</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <AiOutlineBarChart className="text-purple-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Reports</h2>
                            <p className="text-gray-500">View sales and performance</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <AiOutlineSetting className="text-yellow-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Settings</h2>
                            <p className="text-gray-500">Adjust system settings</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Flight Statistics</h3>
                            {/* Include your flight statistics chart or data here */}
                            <p className="text-gray-500">Chart showing flight statistics will go here.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Insights</h3>
                            {/* Include your customer insights chart or data here */}
                            <p className="text-gray-500">Chart showing customer insights will go here.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;