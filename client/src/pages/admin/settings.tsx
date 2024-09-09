import { AiOutlineSave } from 'react-icons/ai';
import SideBarAdmin from '@/components/SideBarAdmin';

const AdminSettings = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">Settings</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">General Settings</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="siteName">Site Name</label>
                            <input
                                id="siteName"
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter site name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="adminEmail">Admin Email</label>
                            <input
                                id="adminEmail"
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter admin email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="timezone">Timezone</label>
                            <select
                                id="timezone"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="UTC">UTC</option>
                                <option value="GMT">GMT</option>
                                <option value="EST">EST</option>
                                <option value="PST">PST</option>
                                {/* Add more timezones as needed */}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                        >
                            <AiOutlineSave className="mr-2" /> Save Changes
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Security Settings</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="password">Change Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                        >
                            <AiOutlineSave className="mr-2" /> Save Changes
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AdminSettings;
