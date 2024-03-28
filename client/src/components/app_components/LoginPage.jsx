import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const LoginPageHeader = () => {
            return (
                <div className="container">
                    <h3 className="page-title">Welcome to MemTrain!</h3>
                    <h3 className="page-title">Please Login:</h3>
                    <hr />
                </div>
            )
    }

    const LoginPageBody = () => {
        return (
            <div className="container">
                <form ref={myAppContext.loginPageFormRef}>
                    <label className="form-label">
                        Username:{" "}
                        <input id="login_user_name" className="login-form-input" type="text" autoComplete="off" name="user_name" autoFocus required minLength="1" />
                    </label>
                    <br/>
                    <br/>
                    <label className="form-label">
                        Password:{" "}
                        <input id="login_user_pwd" className="login-form-input" type="password" autoComplete="off" name="password" required minLength="1" />
                    </label>
                    <hr/>
                    <button id="login_button" className="button" type="submit" onClick={myAppUpdateContext.handleLogin}>Login</button>
                    <button id="new_user_button" className="button" type="button" onClick={myAppUpdateContext.handleNewUser}>New</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            < LoginPageHeader />
            < LoginPageBody />
            < ToastContainer />
        </div>
    )
}
