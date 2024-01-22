import { useEffect, useRef, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './App.scss';
import Login from './pages/login/Login';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home';
import RequireUser from './components/RequireUser';
import Feed from './components/feed/Feed';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/updateProfile/UpdateProfile';
import { useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';
import IfLogin from './components/IfLogin';
import toast, { Toaster } from 'react-hot-toast';

export const TOAST_SUCCESS = 'toast_success';
export const TOAST_FAILURE = 'toast_failure';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode',darkMode);
  };

  const { isLoading } = useSelector(state => state.appConfigReducer)
  const { toastData } = useSelector(state => state.appConfigReducer)
  const loadingRef = useRef(null)

  useEffect(() => {
    if (isLoading) {
      loadingRef.current.continuousStart();
    }
    else {
      loadingRef.current.complete();
    }
  }, [isLoading])

  useEffect(() => {
    switch (toastData.type) {
      case TOAST_SUCCESS:
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;
    }
  }, [toastData])

  return (
    <div className={`App ${localStorage.getItem('darkMode')==="true" ? 'dark-mode' : ''}`}>
      
      <LoadingBar color='#7380ec' ref={loadingRef} />
      <div><Toaster /></div>
      <Routes>
        <Route element={<RequireUser />}>
          <Route element={<Home darkMode={darkMode} onClick={toggleDarkMode}/>}>
            <Route path='/' element={<Feed />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route element={<IfLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
