import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import UserDetail from '../pages/UserDetail'
import MainLayout from '../pages/MainLayout'
import Discover from '../pages/Discover'
import Matches from '../pages/Matches'
import Messages from '../pages/Messages'
import Profile from '../pages/Profile'
import Likes from '../pages/Likes'

const AppRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<Landing/>} />
     <Route path='/userdetail' element={<UserDetail/>} />

<Route element={<MainLayout />}>
  <Route path="/discover" element={<Discover />} />
  <Route path="/matches" element={<Matches/>} />
  <Route path="/messages" element={<Messages />} />
  <Route path="/profile" element={<Profile/>} />
  <Route path="/likes" element={<Likes/>} />
</Route>

   </Routes>
  )
}

export default AppRoutes