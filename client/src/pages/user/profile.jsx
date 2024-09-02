import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaBell, FaEdit, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '@/constants/api';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: null,
    email: null,
    phoneNumber: null,
    country: null,
    city: null,
    zipCode: null,
  });

  const token = localStorage.getItem('accessToken');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async() => {
      try {
        const response = await axios.get(`${ROUTES.BE}/api/users`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

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
    if (userInfo.country) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`http://api.geonames.org/searchJSON?country=${userInfo.country.value}&featureClass=P&username=batonia`);
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
  }, [userInfo.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSelectChange = (selectedOption, action) => {
    setUserInfo({ ...userInfo, [action.name]: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      axios.patch(`${ROUTES.BE}/api/users`, userInfo, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
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
                src={userInfo.image || "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"}
                alt="User"
              />
            </div>
            <h3 className="text-center mt-4 text-xl font-semibold mb-6">
              {userInfo.name} 
            </h3>
            <p className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">{userInfo.role}</p>
            <button className="mt-4 w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
              |||||||||||||||||||||||||||||||
            </button>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">My Profile Details</h3>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userInfo.email}
                  disabled
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userInfo.phoneNumber}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userInfo.zipCode}
                  onChange={handleInputChange}
                />
                <Select
                  name="country"
                  options={countries}
                  placeholder="Select Country"
                  onChange={handleSelectChange}
                  value={countries.find(option => option.value === userInfo.country)}
                />
                <Select
                  name="city"
                  options={cities}
                  placeholder="Select City"
                  onChange={handleSelectChange}
                  value={cities.find(option => option.value === userInfo.city)}
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
                <div className="font-semibold">Name:</div>
                <div>{userInfo.name}</div>
                <div className="font-semibold">Email:</div>
                <div>{userInfo.email}</div>
                <div className="font-semibold">Phone Number:</div>
                <div>{userInfo.phoneNumber}</div>
                <div className="font-semibold">Zip Code:</div>
                <div>{userInfo.zipCode}</div>
                <div className="font-semibold">Country:</div>
                <div>{userInfo.country ? userInfo.country.label : 'N/A'}</div>
                <div className="font-semibold">City:</div>
                <div>{userInfo.city ? userInfo.city.label : 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;