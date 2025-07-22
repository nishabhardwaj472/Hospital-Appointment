import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData, logout } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />

      {/* Desktop Nav */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'><li className='py-1'>HOME</li></NavLink>
        <NavLink to='/doctors'><li className='py-1'>ALL DOCTORS</li></NavLink>
        <NavLink to='/about'><li className='py-1'>ABOUT</li></NavLink>
        <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
      </ul>

      {/* Profile + Mobile menu button */}
      <div className='flex items-center gap-4'>
        {token && token.length > 0 ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img
              className='w-8 h-8 rounded-full object-cover'
              src={userData?.image || assets.profile_pic}
              alt="Profile"
            />
            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
            Create Account
          </button>
        )}

        {/* Mobile Nav Icon */}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 bg-white z-20 transition-all ${showMenu ? 'w-full px-5 py-6' : 'w-0 overflow-hidden'}`}>
        <div className='flex items-center justify-between'>
          <img className='w-36' src={assets.logo} alt="Logo" />
          <img className='w-7 cursor-pointer' src={assets.cross_icon} onClick={() => setShowMenu(false)} alt="Close" />
        </div>
        <ul className='flex flex-col items-start gap-4 mt-6 text-lg font-medium'>
          <NavLink to='/' onClick={() => setShowMenu(false)}><li>Home</li></NavLink>
          <NavLink to='/doctors' onClick={() => setShowMenu(false)}><li>All Doctors</li></NavLink>
          <NavLink to='/about' onClick={() => setShowMenu(false)}><li>About</li></NavLink>
          <NavLink to='/contact' onClick={() => setShowMenu(false)}><li>Contact</li></NavLink>
          {token && token.length > 0 ? (
            <>
              <NavLink to='/my-profile' onClick={() => setShowMenu(false)}><li>My Profile</li></NavLink>
              <NavLink to='/my-appointments' onClick={() => setShowMenu(false)}><li>My Appointments</li></NavLink>
              <li onClick={() => { logout(); setShowMenu(false); }} className='cursor-pointer'>Logout</li>
            </>
          ) : (
            <li onClick={() => { navigate('/login'); setShowMenu(false); }} className='cursor-pointer'>Login</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
