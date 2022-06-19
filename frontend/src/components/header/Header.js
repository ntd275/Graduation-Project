import React from 'react'
import Images from '../../Images/Images'
import "./header.scss"

function Header() {
  return (
    <div className="header">
        <div className="logo">
            <img src={Images.logo} alt="logo" className='logo-img'/>
        </div> 
    </div>
  )
}

export default Header