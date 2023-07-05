import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'

import Home from './pages/Home'
import "./resources/global.css";
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'
import { useSelector } from 'react-redux'
import AdminHome from './pages/Admin/AdminHome'
import AdminBuses from './pages/Admin/AdminBuses'
import AdminUsers from './pages/Admin/AdminUsers'
import BookNow from './pages/BookNow'
import Bookings from './pages/Bookings'




const App = () => {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div>
    {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/bookings' element={<ProtectedRoute><Bookings/></ProtectedRoute>} />
          <Route path='/book-now/:id' element={<ProtectedRoute><BookNow/></ProtectedRoute>} />
          {/* <Route path='/admin' element={<ProtectedRoute><AdminHome/></ProtectedRoute>} />*/}
          <Route path='/admin/buses' element={<ProtectedRoute><AdminBuses/></ProtectedRoute>} />
          <Route path='/admin/users' element={<ProtectedRoute><AdminUsers/></ProtectedRoute>} />
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
          <Route path='/login'  element={<PublicRoute><Login/></PublicRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App