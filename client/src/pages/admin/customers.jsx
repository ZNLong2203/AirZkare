import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SideBarAdmin from '@/components/SideBarAdmin';

const AdminCustomers = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <SideBarAdmin />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-700">Manage Customers</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                        <AiOutlinePlus className="mr-2" /> Add New Customer
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Customer ID</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Phone</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample customer data */}
                            {[
                                { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@example.com', phone: '0123456789' },
                                { id: 2, name: 'Tran Thi B', email: 'tranthib@example.com', phone: '0987654321' },
                            ].map((customer) => (
                                <tr key={customer.id} className="border-t">
                                    <td className="px-4 py-2">{customer.id}</td>
                                    <td className="px-4 py-2">{customer.name}</td>
                                    <td className="px-4 py-2">{customer.email}</td>
                                    <td className="px-4 py-2">{customer.phone}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button className="text-green-600 hover:text-green-800 flex items-center">
                                                <AiOutlineEdit className="mr-1" /> Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 flex items-center">
                                                <AiOutlineDelete className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AdminCustomers;
