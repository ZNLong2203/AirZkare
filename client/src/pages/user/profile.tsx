import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Select, { SingleValue, ActionMeta } from 'react-select';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '@/constants/api';

interface User {
  username: string | null;
  email: string | null;
  age: number | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  country: { value: string; label: string } | null;
  city: { value: string; label: string } | null;
  nationality: { value: string; label: string } | null;
  passport: string | null;
  role?: string;
  image?: string;
  membership?: string;
  user?: {
    username: string;
    email: string;
    role: string;
  } | null;
}

interface Option {
  value: string;
  label: string;
}

const Profile: React.FC = () => {
  const [users, setUsers] = useState<User>({
    username: null,
    email: null,
    age: null,
    gender: null,
    dob: null,
    phone: null,
    country: null,
    city: null,
    nationality: null,
    passport: null,
    user: null,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [countries, setCountries] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setUserId(userId);
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API.PASSENGER}/${userId}`);
        setUsers({
          ...response.data.metadata,
          username: response.data.metadata.user.username,
          email: response.data.metadata.user.email,
          role: response.data.metadata.user.role,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch countries from API
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const sortedCountries = response.data
          .map((country: { cca2: string; name: { common: string } }) => ({
            value: country.cca2,
            label: country.name.common,
          }))
          .sort((a: Option, b: Option) => a.label.localeCompare(b.label)); 
        setCountries(sortedCountries);
      });
  }, []);

  // Fetch cities when a country is selected
  useEffect(() => {
    if (users.country) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`http://api.geonames.org/searchJSON?country=${users.country?.value}&featureClass=P&username=batonia`);
          const cityOptions = response.data.geonames.map((city: { geonameId: string; name: string }) => ({
            value: city.geonameId,
            label: city.name,
          }));
          setCities(cityOptions);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [users.country]);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsers((prevUser) => ({
      ...prevUser,
      [name]: name === 'age' && value !== '' ? parseInt(value, 10) : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (selectedOption: SingleValue<Option>, action: ActionMeta<Option>) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [action.name as keyof User]: selectedOption,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { city, country, username, email, role, image, user , ...userData } = users;
    const updatedUserData = {
      ...userData,
      city: city?.label,
      country: country?.label
    };
    console.log(updatedUserData);

    try {
      await axios.patch(`${API.PASSENGER}/${userId}`, updatedUserData);
      toast.success('User data updated successfully');
    } catch (err) {
      toast.error('Failed to update user data');
    }
    setIsEditing(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-24">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Profile</h2>
          <div className="text-gray-500">
            <span>{new Date().toLocaleDateString()}</span>
            <button
              className="ml-4 text-blue-600 hover:text-blue-800"
              onClick={toggleEditMode}
            >
              <FaEdit className="inline" /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-center">
              <img
                className="w-32 h-32 rounded-full object-cover"
                src={users.image || "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"}
                alt="User"
              />
            </div>
            <h3 className="text-center mt-4 text-xl font-semibold mb-6">
              {users.username}
            </h3>
            <p className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40">
              {users.role}
            </p>
            <button className="mt-4 w-full rounded-lg bg-gray-900 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20">
              {users.membership}
            </button>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">My Profile Details</h3>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="username"
                  placeholder="UserName"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.username || ''}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.email || ''}
                  disabled
                />
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.age || ''}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.gender || ''}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.dob || ''}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.phone || ''}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="passport"
                  placeholder="Passport"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={users.passport || ''}
                  onChange={handleInputChange}
                />
                <Select
                  name="nationality"
                  options={countries}
                  placeholder="Select Nationality"
                  onChange={handleSelectChange}
                  value={countries.find((option) => option.value === users.nationality?.value) || undefined}
                />
                <Select
                  name="city"
                  options={cities}
                  placeholder="Select City"
                  onChange={handleSelectChange}
                  value={cities.find((option) => option.value === users.city?.value) || undefined}
                />
                <Select
                  name="country"
                  options={countries}
                  placeholder="Select Country"
                  onChange={handleSelectChange}
                  value={countries.find((option) => option.value === users.country?.value) || undefined}
                />
                <button
                  type="submit"
                  className="col-span-2 w-full rounded-lg bg-green-400 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="font-semibold">UserName:</div>
                <div>{users.username}</div>
                <div className="font-semibold">Email:</div>
                <div>{users.email}</div>
                <div className="font-semibold">Age:</div>
                <div>{users.age}</div>
                <div className="font-semibold">Gender:</div>
                <div>{users.gender}</div>
                <div className="font-semibold">Date of Birth:</div>
                <div>{users.dob}</div>
                <div className="font-semibold">Phone Number:</div>
                <div>{users.phone}</div>
                <div className="font-semibold">Passport:</div>
                <div>{users.passport}</div>
                <div className="font-semibold">Nationality:</div>
                <div>{users.nationality ? users.nationality.label : 'N/A'}</div>
                <div className="font-semibold">City:</div>
                <div>{users.city ? users.city.label : 'N/A'}</div>
                <div className="font-semibold">Country:</div>
                <div>{users.country ? users.country.label : 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
