import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { SetUser } from "../redux/usersSlice";
import {ShowLoading,HideLoading} from "../redux/alertsSlice"
import DefaultLayout from './DefaultLayout';


const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
    //const [loading, setLoading] = useState(true)
    
    const { user } = useSelector((state) => state.users);
    const {loading}=useSelector((state)=>state.alerts)
    

    //redux 
    const dispatch=useDispatch()

    const validateToken = async () => {

        try {
            dispatch(ShowLoading())
            const response = await axios.post("/api/users/get-user-by-id", {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                dispatch(HideLoading())
            if (response.data.success) {
                //setLoading(false)
                dispatch(SetUser(response.data.data))
            } else {
                //setLoading(false)
                dispatch(HideLoading())
                localStorage.removeItem("token")
                message.error(response.data.message)
                navigate('/login')
            }

        } catch (error) {
            localStorage.removeItem("token")
            message.error(error.message)
           // setLoading(false)
            
            navigate('/login')

        }

    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
        } else {
            navigate("/login");
        }
    }, []);
    return (
       /* <div>{!loading && <DefaultLayout>{children}</DefaultLayout>}</div>*/
       <div>{ user  && <DefaultLayout>{children}</DefaultLayout>}</div>

        
    )
}

export default ProtectedRoute