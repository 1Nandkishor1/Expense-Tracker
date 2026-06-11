import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Register from './authUser/pages/Register';
import Login from './authUser/pages/Login';
import Logout from './authUser/pages/Logout'
import GroupList from './group/pages/GroupList'
import ProtectedRoute from './components/ProtectedRoute';
import GroupDetail from './group/pages/GroupDetail';
import SettlementList from './settlement/pages/SettlementList';
import JoinGroup from './group/pages/JoinByLink';
import Profile from './authUser/pages/Profile';
import Home from './authUser/pages/Home';

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/logout',
        element:<Logout/>
    },
    {
        path:'/groups',
        element: <ProtectedRoute><GroupList/></ProtectedRoute> 
    },
    {
        path:'/group/:id',
        element:<ProtectedRoute><GroupDetail/></ProtectedRoute> 
    },
    {
        path:'/groups/settlements/:id',
        element:<ProtectedRoute><SettlementList/></ProtectedRoute> 
    },
    {
        path:'/invite/:token',
        element:<ProtectedRoute><JoinGroup/></ProtectedRoute> 
    },{
        path:'/profile',
        element:<ProtectedRoute><Profile/></ProtectedRoute>
    }
])

export default Router