import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 shadow-md rounded-xl border-2 border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border border-gray-400 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border border-gray-400 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border border-gray-400 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button type="submit" className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition duration-300">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
