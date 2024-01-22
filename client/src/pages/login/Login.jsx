import React, { useState } from 'react'
import "./Login.scss"
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStroageManager';


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await axiosClient.post('/auth/login', { email, password })
            setItem(KEY_ACCESS_TOKEN, data.result.accessToken);
            navigate('/')
        } catch (error) {
            console.error({ message: error.message })
        }

    }
    return (
        <div className="Login">
            <h2>Welcome to <span>TWINKLE</span></h2>
            <div className="login-box">
                <h2 className="heading">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" className='email' id='email' onChange={e => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" className='password' id='password' onChange={e => setPassword(e.target.value)} />

                    <input type="submit" className='submit' />
                </form>
            </div>
            <p className='subheading'>Do not have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}

export default Login