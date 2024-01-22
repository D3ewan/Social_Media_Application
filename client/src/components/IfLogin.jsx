import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStroageManager'
import { Navigate, Outlet } from 'react-router-dom'

function IfLogin() {
    const user = getItem(KEY_ACCESS_TOKEN)
  return (
    user ? <Navigate to="/" /> : <Outlet />
  )
}

export default IfLogin