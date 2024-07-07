import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { useState,useRef, useEffect} from 'react'
import "../../styles/nav.css";
import userImage from '../../assets/user.png'
import baheyaLogo from '../../assets/baheya.png'
// import { getUserInfo } from '../path/to/authSlice';


const Nav = () => {

    const { user, userInfo  } = useSelector((state) => state.auth)


    const Dropdown = () => {
        const [dropdownOpen, setDropdownOpen] = useState(false)
        const dropdownRef = useRef(null)
        const navigate = useNavigate()
        const dispatch = useDispatch()
    
        const handleLogout = () => {
            dispatch(logout())
            dispatch(reset())
            navigate("/")
        }
    
        const toggleDropdown = () => {
            setDropdownOpen(!dropdownOpen)
            console.log("This is the user variable: ####", user)
        }

        const closeDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        useEffect(() => {
            document.addEventListener("mousedown", closeDropdown)
            return () => {
                document.removeEventListener("mousedown", closeDropdown)
            }
        }, [])
    
        return (
            <div className="dropdown" ref={dropdownRef}>
                <button className="dropbtn nav-childs" onClick={toggleDropdown}>
                    <img className="userImage" src={userImage} alt="user"/>
                </button>
                {dropdownOpen && (
                    <div className="dropdown-content">
                        <img src={baheyaLogo} alt="baheya foundation"/>
                        <h2 className="dr-name">Dr. Ehab</h2>
                        {/* <NavLink to="/profile">Profile</NavLink> */}
                        <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
                    </div>
                )}
            </div>
        )
    }


    return (
        <nav className="navbar">
            <NavLink className="logo" to="/">MammoView</NavLink>
            <ul className="nav-links">
                {user ?
                    <>
                        <NavLink className='nav-childs' to="/dashboard">Exam List</NavLink>
                        <Dropdown />
                    </>
                    :
                    <>
                        {/* <NavLink className='nav-childs' to="/dashboard">Exam List</NavLink> */}
                    </>
                }
            </ul>
        </nav>
    )
}

export default Nav