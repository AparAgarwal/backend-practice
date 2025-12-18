import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        gender: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/users', formData);
            setMessage('User registered successfully!');
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                gender: '',
                password: '',
                confirmPassword: '',
            });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error registering user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#2d2d2d', borderRadius: '12px', border: '1px solid #444' }}>
            <h1 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '500' }}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', padding: '10px', borderRadius: '6px', backgroundColor: message.includes('Error') ? '#7f1d1d' : '#065f46', color: message.includes('Error') ? '#fca5a5' : '#6ee7b7' }}>{message}</p>}
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/" style={{ marginRight: '15px', color: '#60a5fa', textDecoration: 'none' }}>← Back to Home</Link>
                <Link to="/users" style={{ color: '#60a5fa', textDecoration: 'none' }}>View All Users</Link>
            </div>
        </div>
    );
}