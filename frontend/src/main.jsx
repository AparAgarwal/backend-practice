import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AllUsers from './AllUsers'
import SignUp from './signUp'
import UserDetail from './userDetail'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/users" element={<AllUsers />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
)
