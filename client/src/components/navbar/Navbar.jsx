import React, { useRef, useState } from 'react'
import LoadingBar from 'react-top-loading-bar'
import "./Navbar.scss"
import Avatar from '../avatar/Avatar'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { axiosClient } from '../../utils/axiosClient'
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStroageManager'
import { FaMoon, FaSun } from 'react-icons/fa'

function Navbar({darkMode,onClick}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myProfile } = useSelector(state => state.appConfigReducer)

    async function handleLogout() {
        try {
            await axiosClient.post('/auth/logout');
            removeItem(KEY_ACCESS_TOKEN);
            navigate("/login");
        } catch (e) {

        }
    }
    return (
        <nav className="Navbar">
            <div className="container">
                <h2 className="banner" onClick={() => navigate('/')}>TWINKLE</h2>
                <div className="right-side">
                    <div className="dark-mode-toggle" onClick={()=>onClick()}>
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </div>
                    <div className="logout" onClick={handleLogout}>
                        <AiOutlineLogout />
                    </div>
                    <div className="profile-photo">
                        <Avatar id={myProfile._id} src={myProfile?.avatar?.url} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar