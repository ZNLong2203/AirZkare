import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaBell, FaEdit, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '@/constants/api';

const Profile = () => {
  const [user, setUser] = useState({
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
  });

  const [userId, setUserId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setUserId(userId);
    
    const fetchUserData = async() => {
      try {
        const response = await axios.get(`${API.PASSENGER}/${userId}`);
        setUser({
          ...response.data.metadata.passenger,
          username: response.data.metadata.username,
          email: response.data.metadata.email,
          role: response.data.metadata.role,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

  // Fetch countries and cities from API
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const sortedCountries = response.data
          .map(country => ({
            value: country.cca2,
            label: country.name.common
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); 
        setCountries(sortedCountries);
      });
  }, []);

  useEffect(() => {
    if (user.country) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`http://api.geonames.org/searchJSON?country=${user.country.value}&featureClass=P&username=batonia`);
          const cityOptions = response.data.geonames.map(city => ({
            value: city.geonameId,
            label: city.name
          }));
          console.log(response.data)
          setCities(cityOptions);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [user.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'age') {
      setUser((prevUser) => ({ ...prevUser, [name]: parseInt(value) }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSelectChange = (selectedOption, action) => {
    setUser({ ...user, [action.name]: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, role, ...userData } = user; 
    try {
      axios.patch(`${API.PASSENGER}/${userId}`, userData);
    } catch(err) {
      toast.error('Failed to update user data');
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-24">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Profile</h2>
          <div className="text-gray-500">
            <span>{Date}</span>
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
                src={user.image || "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"}
                alt="User"
              />
            </div>
            <h3 className="text-center mt-4 text-xl font-semibold mb-6">
              {user.username} 
            </h3>
            <p className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">{user.role}</p>
            <button className="mt-4 w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
              {user.membership}
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
                  value={user.username}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.email}
                  disabled
                />
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.age}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.gender}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.dob}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.phone}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="passport"
                  placeholder="Passport"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user.passport}
                  onChange={handleInputChange}
                />
                <Select
                  name="nationality"
                  options={countries}
                  placeholder="Select Nationality"
                  onChange={handleSelectChange}
                  value={countries.find(option => option.value === user.nationality)}
                />
                <Select
                  name="city"
                  options={cities}
                  placeholder="Select City"
                  onChange={handleSelectChange}
                  value={cities.find(option => option.value === user.city)}
                />
                <Select
                  name="country"
                  options={countries}
                  placeholder="Select Country"
                  onChange={handleSelectChange}
                  value={countries.find(option => option.value === user.country)}
                />
                <button
                  type="submit"
                  className="col-span-2 w-full select-none rounded-lg bg-green-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="font-semibold">UserName:</div>
                <div>{user.username}</div>
                <div className="font-semibold">Email:</div>
                <div>{user.email}</div>
                <div className="font-semibold">Age:</div>
                <div>{user.age}</div>
                <div className="font-semibold">Gender:</div>
                <div>{user.gender}</div>
                <div className="font-semibold">Date of Birth:</div>
                <div>{user.dob}</div>
                <div className="font-semibold">Phone Number:</div>
                <div>{user.phoneNumber}</div>
                <div className="font-semibold">Passport:</div>
                <div>{user.passport}</div>
                <div className="font-semibold">Nationality:</div>
                <div>{user.nationality ? user.nationality.label : 'N/A'}</div>
                <div className="font-semibold">City:</div>
                <div>{user.city ? user.city.label : 'N/A'}</div>
                <div className="font-semibold">Country:</div>
                <div>{user.country ? user.country.label : 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;