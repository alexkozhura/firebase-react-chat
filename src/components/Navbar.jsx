import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const {currentUser} = useAuth();

  return (
    <div className='navbar'>
      <span className='logo'>Fearless Chat</span>
      <div className='user'>
        <img src={currentUser.photoURL} alt =''/>
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar
