import React,{useState} from 'react'
import '../resources/Layout.css'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useSelector((state) => state.users);
  const usermenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line"
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-wallet-line"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-profile-line"
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-r-fill"
    }
  ];
  const adminmenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line"
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line"
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line"
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "ri-wallet-line"
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-r-fill"
    }
  ]
 // const menuToberender = adminmenu
 const menuToberender = user?.isAdmin ? adminmenu:usermenu
  let activeRoute=window.location.pathname
  if(window.location.pathname.includes('book-now')){
    activeRoute='/'

  }
  return (
    <div className='layout-parent'>
      <div className='sidebar'>
      <div className='sidebar-header'>
        <h1 className='logo'>Red Bus</h1>
        <h1 className='role'>{user?.name}<br/>Role:{user?.isAdmin?'Admin':'User'}</h1>
      </div>
        <div className='d-flex flex-column gap-3 justify-content-start menu'>
          {menuToberender.map((item, index) => {
            return <div  className={`${
              activeRoute === item.path && "active-menu-items"
            } menu-items`}>
              <i className={item.icon}></i>
              {!collapsed && <span onClick={() => {
                if(item.path==="/logout")
                {
                  localStorage.removeItem("token")
                  navigate("/login")
                }else{navigate(item.path)}
                  }}>{item.name}</span>}
            </div>
          })}
        </div>
      </div>
      <div className='body'>
        <div className='header'>
          {collapsed?(
            <i className="ri-close-line" onClick={()=>{setCollapsed(!collapsed)}}></i>
          ):(<i className="ri-menu-line" onClick={()=>{setCollapsed(!collapsed)}}></i>)}
        </div>
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout