import React from 'react';
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider';
import { ToastContainer } from 'react-toastify';
import './styles/LoginPage.css';  // Import the CSS

export const LoginPage = () => {
    const myAppContext = useMyAppContext();
    const myAppUpdateContext = useMyAppUpdateContext();

    return (
        <div className="container">
            <div>
                <h3 className="header">Welcome to MemTrain!</h3>
                <h4>Login:</h4>
                <form ref={myAppContext.loginPageFormRef}>
                    <label className="form-label">
                        Username:{" "}
                        <input className="login-form-input" type="text" autoComplete="off" name="user_name" autoFocus required minLength="1" />
                    </label>
                    <label className="form-label">
                        Password:{" "}
                        <input className="login-form-input" type="password" autoComplete="off" name="password" required minLength="1" />
                    </label>
                    <button className="login-form-button" type="submit" onClick={myAppUpdateContext.handleLogin}>Login</button>
                    <button className="login-form-button" type="button" onClick={myAppUpdateContext.handleNewUser}>New</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
