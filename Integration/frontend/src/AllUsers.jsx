import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            await fetchUsers();
        };
        loadUsers();
    }, []);

    if (loading) return <div style={{ padding: '20px', color: 'rgba(255, 255, 255, 0.87)' }}>Loading users...</div>;
    if (error) return <div style={{ padding: '20px', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#2d2d2d', borderRadius: '12px', border: '1px solid #444', minHeight: '500px' }}>
            <h1 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>All Users</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Users: {users.length}</p>
            
            {users.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No users found. <Link to="/signup" style={{ color: '#60a5fa' }}>Create a new user</Link></p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#3d3d3d', borderBottom: '2px solid #555' }}>
                            <th style={{ padding: '12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>First Name</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>Last Name</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>Username</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>Gender</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #444', backgroundColor: '#2d2d2d' }}>
                                <td style={{ padding: '12px', color: 'rgba(255, 255, 255, 0.87)' }}>{user.first_name}</td>
                                <td style={{ padding: '12px', color: 'rgba(255, 255, 255, 0.87)' }}>{user.last_name}</td>
                                <td style={{ padding: '12px', color: 'rgba(255, 255, 255, 0.87)' }}>{user.username}</td>
                                <td style={{ padding: '12px', color: 'rgba(255, 255, 255, 0.87)' }}>{user.gender || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>
                                    <Link to={`/users/${user._id}`} style={{ color: '#60a5fa', textDecoration: 'none' }}>
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div style={{ marginTop: '20px' }}>
                <Link to="/" style={{ marginRight: '15px', color: '#60a5fa', textDecoration: 'none' }}>← Back to Home</Link>
                <Link to="/signup" style={{ color: '#60a5fa', textDecoration: 'none' }}>Sign Up New User</Link>
            </div>
        </div>
    );
}
