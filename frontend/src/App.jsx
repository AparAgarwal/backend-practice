import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center', backgroundColor: '#2d2d2d', borderRadius: '12px', border: '1px solid #444' }}>
      <h1 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>User Management System</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Welcome to the user management application</p>
      
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <Link 
          to="/users" 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '8px',
            width: '200px',
            display: 'block',
            transition: 'all 0.3s',
            border: '1px solid #60a5fa'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          View All Users
        </Link>
        
        <Link 
          to="/signup" 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#10b981', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '8px',
            width: '200px',
            display: 'block',
            transition: 'all 0.3s',
            border: '1px solid #34d399'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          Sign Up New User
        </Link>
      </div>
    </div>
  )
}

export default App;