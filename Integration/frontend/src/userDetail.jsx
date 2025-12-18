import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    gender: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((res) => {
        setUser(res.data)
        setFormData({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          username: res.data.username,
          gender: res.data.gender || ''
        })
      })
      .catch((err) => console.error(err))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.patch(`/api/users/${id}`, formData)
      setUser(response.data)
      setMessage('User updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating user.')
      console.error('Error updating user:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await axios.delete(`/api/users/${id}`)
      setMessage('User deleted successfully! Redirecting...')
      setTimeout(() => {
        navigate('/users')
      }, 2000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting user.')
      console.error('Error deleting user:', err)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      gender: user.gender || ''
    })
    setMessage('')
  }

  if (!user) return <div style={{ padding: '20px', color: 'rgba(255, 255, 255, 0.87)' }}>Loading...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#2d2d2d', borderRadius: '12px', border: '1px solid #444', minHeight: '400px' }}>
      <h1 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.first_name} {user.last_name}</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.includes('Error') ? '#7f1d1d' : '#065f46',
          color: message.includes('Error') ? '#fca5a5' : '#6ee7b7',
          borderRadius: '8px',
          border: message.includes('Error') ? '1px solid #991b1b' : '1px solid #047857'
        }}>
          {message}
        </div>
      )}

      {!isEditing ? (
        <div>
          <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.87)' }}><strong>First Name:</strong> {user.first_name}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.87)' }}><strong>Last Name:</strong> {user.last_name}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.87)' }}><strong>Username:</strong> {user.username}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.87)' }}><strong>Gender:</strong> {user.gender || 'N/A'}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Edit User
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
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
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
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
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.87)' }}>Gender:</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: 'rgba(255, 255, 255, 0.87)', border: '1px solid #555', borderRadius: '6px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ marginRight: '15px', color: '#60a5fa', textDecoration: 'none' }}>← Back to Home</Link>
        <Link to="/users" style={{ color: '#60a5fa', textDecoration: 'none' }}>View All Users</Link>
      </div>
    </div>
  )
}

export default UserDetail
