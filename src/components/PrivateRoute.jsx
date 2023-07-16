import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from '../Hooks/useAuthStatus';
import Spinner from '../components/Spinner'

function PrivateRoute() {
    const { loggedIn, Checking } = useAuthStatus();

    if (Checking) {
        return <Spinner />;
    }

    return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
