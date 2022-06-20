import React from 'react'
import Images from '../../Images/Images'
import "./header.scss"
import { Search } from '@mui/icons-material'
import { Avatar } from '@mui/material'

function Header() {
  return (
    <div className="header">
        <div className="logo">
            <img src={Images.logo} alt="logo" className='logo-img'/>
        </div>
        <div className='search'>
          <div className='search-icon'>
            <Search color="action"/>
          </div>
          <input className="search-input" placeholder='Tìm kiếm trên Hola'/>
        </div>
        <div className="right-menu">
          <Avatar src={Images.user}></Avatar>
          <div className='user-name'>
            Nguyễn Thế Đức
          </div>
          <Avatar sx={{ bgcolor: "#e4e6eb" }} style={{marginLeft: "20px"}}>
            <img alt='' src={Images.messenger} style={{width: "24px", height:"auto"}} />
          </Avatar>
          <Avatar sx={{ bgcolor: "#e4e6eb" }} style={{marginLeft: "10px"}}>
            <img alt='' src={Images.notification} style={{width: "24px", height:"auto"}} />
          </Avatar>
          <Avatar sx={{ bgcolor: "#e4e6eb" }} style={{marginLeft: "10px", marginRight: "20px"}}>
            <img alt='' src={Images.arrowDown} style={{width: "20px", height:"auto", marginTop: "3px"}} />
          </Avatar>
        </div>
    </div>
  )
}

export default Header