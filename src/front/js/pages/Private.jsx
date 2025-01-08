import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const {store} = useContext(Context)
    const [userData, setUserData] = useState({email:'', isActive:'', password:'', id:null})
    const navigate = useNavigate()

    const handlePrivateData = async () => {
        try {
            const response = await fetch (process.env.BACKEND_URL + '/api/user', {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json',
                    Authorization: `Bearer ${store.token}`
                }
        })
        const body = await response.json()
        setUserData({email:body.email, isActive:body.is_active, password:body.password, id:body.id})
        }catch(error) {
            console.log(error)
        }        
    }
    
    useEffect (() => {
        if(store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;		
        }
        if(store.token){
            handlePrivateData()
        }
    }, [store.token])

    return (
		<main className="d-flex flex-column gap-3 vh-100 justify-content-center align-items-center">
			<div className="card" style={{width: '18rem'}}>
                <div className="card-body">
                    <h5 className="card-title">{userData.email}</h5>
                    <p className="card-text">{userData.password}</p>
                    <div>{userData.isActive ? <button className= 'btn btn-success p-3'>.</button> : <button className= 'btn btn-danger p-3'>.</button>}</div>
                </div>
            </div>
		</main>
)
}