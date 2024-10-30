import React from 'react'
import './Navbar.scss'
import logo from '../../../public/book.jpg'

const Navbar = () => {
   return (
      <nav className=''>
         <img src={logo} alt="" />
      </nav>
   )
}

export default Navbar