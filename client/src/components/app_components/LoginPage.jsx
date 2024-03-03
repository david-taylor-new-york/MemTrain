import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div className="container">
            <div>
                <h3 className="header">Welcome to MemTrain!</h3>
                <h3 className="page-title">Login</h3>
                <form ref={myAppContext.loginPageFormRef}>
                    <label className="form-label">
                        Username:{" "}
                        <input className="form-input" type="text" autoComplete="off" name="user_name" autoFocus required minLength="1" />
                    </label>
                    <br/>
                    <label className="form-label">
                        Password:{" "}
                        <input className="form-input" type="password" autoComplete="off" name="password" required minLength="1" />
                    </label>
                    <br/>
                    <button className="button" type="submit" onClick={myAppUpdateContext.handleLogin}>Login</button>
                    <button className="button" type="button" onClick={myAppUpdateContext.handleNewUser}>New</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}
