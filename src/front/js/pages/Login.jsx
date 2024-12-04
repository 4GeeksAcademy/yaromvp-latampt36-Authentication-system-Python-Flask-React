import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function Login(){
    const {store, actions} = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')    
    const [formStatus, setFormStatus] = useState({loading: false, ready: false})
    const [alert, setAlert] = useState({show: false, message: '', type: ''})

    const navigate = useNavigate()

    const logIn = async (emailLogIn, passwordLogIn) => {
        try{
            const response = await fetch('https://humble-adventure-pjg4j7wgjrr5h65pw-3001.app.github.dev/api/token', {
                method : 'POST',                
                body: JSON.stringify({
                    email: emailLogIn,
                    password: passwordLogIn
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            if (!response.ok) {
                alert('Error in the request')
                return;
            }
            const body = await response.json()
            setFormStatus({loading: false, ready: true})
            actions.setToken(body.token)
            return;
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setFormStatus({loading: true, ready: false})
        logIn(email, password)
    }

    useEffect(() => {
        if (formStatus.ready === true){
            navigate('/private')
        }
    }, [formStatus.ready])

    return(
        <main className="d-flex flex-column gap-3 vh-100 justify-content-center align-items-center">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                {
                    formStatus.loading ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <button type="submit" className="btn btn-primary">Submit</button>
                    )
                }
                {
                    alert.show ? (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    ) : null
                }
            </form>
        </main>
    )
}