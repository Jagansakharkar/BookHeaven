import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getMe } from '../store/auth/authThunks'
import Loader from '../Components/common/Loader'

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { isLoggedIn, loading } = useSelector(state => state.auth)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // fetch current user from backend (reads cookie)
    dispatch(getMe()).finally(() => setCheckingAuth(false))
  }, [dispatch])

  if (loading || checkingAuth) {
    // you can show a spinner here while checking
    return <Loader/>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}
