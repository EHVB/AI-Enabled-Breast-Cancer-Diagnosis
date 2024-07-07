import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BiLogInCircle } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { login, reset, getUserInfo } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner"

const LoginPage = () => {

    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }
        dispatch(login(userData))
    }


    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            
            console.log("After get user info")
            
            navigate("/dashboard")
        }

        dispatch(reset())
        console.log("Ahmmed    545548578456678")

        dispatch(getUserInfo())

    //     dispatch(getUserInfo()).then((response) => {
    //     console.log("User Info:", response);
    //   }).catch((error) => {
    //     console.error("Error fetching user info:", error);
    //   });

    }, [isError, isSuccess, user, navigate, dispatch])


    //     useEffect(() => {
    //     if (isError) {
    //         toast.error(message)
    //     }

    //     if (isSuccess || user) {
    //         dispatch(getUserInfo()) // Fetch user info after successful login
    //         navigate("/dashboard")
    //     }

    //     dispatch(reset())
    //     }, [isError, isSuccess, user, navigate, dispatch])
    
    
    
    //    useEffect(() => {
    //     if (userInfo) {
    //         console.log("User Info:", userInfo) // Handle user info here
    //     }
    // }, [userInfo])


    return (
        <>
            <div className="container auth__container">
                <h1 className="main__title">Login <BiLogInCircle /></h1>

                {isLoading && <Spinner />}

                <form className="auth__form">
                    <input type="text"
                        placeholder="email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input type="password"
                        placeholder="password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <Link
                        to="/reset-password" 
                        style={{color:"white"}}
                    >
                        Forget Password ?
                    </Link>

                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </>
    )
}

export default LoginPage