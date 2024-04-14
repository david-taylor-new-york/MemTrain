import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const LoginPageBody = () => {
        return (
            <div className="section-container">
                <form ref={myAppContext.loginPageFormRef}>
                    <label>
                        Username:{" "}
                        <input id="login-user-name" className="login-form-input" type="text" autoComplete="off" name="user_name" autoFocus required minLength="1" />
                    </label>
                    <br />
                    <br />
                    <label>
                        Password:{" "}
                        <input id="login-user-pwd" className="login-form-input" type="password" autoComplete="off" name="password" required minLength="1" />
                    </label>
                    <br />
                    <br />
                    <div className="login-button-group">
                        <button id="login-button" className="button" type="submit" onClick={myAppUpdateContext.handleLogin}>Login</button>
                        <button id="new-user-button" className="button" type="button" onClick={myAppUpdateContext.handleNewUser}>New</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div id="login-page-id" style={{ display: 'none' }}> </div>
            < LoginPageHeader />
            < LoginPageBody />
        </div>
    )
}

const LoginPageHeader = () => {
    return (
        <div className="section-container">
            <h3 className="page-title">Welcome to MemTrain!</h3>
            <h3 id="page-title" className="page-title">Please Login:</h3>
            <hr />
        </div>
    )
}