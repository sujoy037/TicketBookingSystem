import React from 'react'
import { Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {ShowLoading,HideLoading} from "../redux/alertsSlice"
import { useDispatch } from 'react-redux'

const Login = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const onfinish = async (values) => {
        //console.log(values)
        try {
            dispatch(ShowLoading())
            const response = await axios.post("/api/users/login", values)
            dispatch(HideLoading())
            if (response.data.success) {
                message.success(response.data.message);
                localStorage.setItem("token", response.data.data);
                navigate('/')

            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading())
            message.error(error.message)
        }
    }
    return (
        <div className='h-screen d-flex justify-content-center align-items-center'>

            <div className='card-1 w-400 p-3'>
                <h1 className='text-lg'>RedBus-Login</h1>
                <hr />
                <Form layout="vertical" onFinish={onfinish}>
                    <Form.Item label="Email" name="email">
                        <input type="text" />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <input type="password" />
                    </Form.Item>
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <Link to="/register">Click Here To Register</Link>
                        <button className="secondary-btn" type="submit">
                            Login
                        </button>
                    </div>
                </Form>

            </div>
        </div>
    )
}

export default Login