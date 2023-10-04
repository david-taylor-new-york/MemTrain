import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { ToastContainer } from 'react-toastify';

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div>
            <div>
                <h3> Welcome to MemTrain! </h3>
                <h4> Login: </h4>
                <form ref={myAppContext.loginPageFormRef} >
                    <label>
                        Username:{" "}
                        <input type="text" autoComplete="off" name="user_name" autoFocus required minLength="1" />
                    </label>
                    <br />
                    <label>
                        Password:{" "}
                        <input type="text" autoComplete="off" name="password" required minLength="1" />
                    </label>
                    <br />
                    <button type="submit" onClick={myAppUpdateContext.handleLogin}> Login </button>
                    <button type="submit" onClick={myAppUpdateContext.handleNewUser}> New </button>
                </form>
                <hr />
            </div>
            <div>
                < ToastContainer />
            </div>

        </div>
    )
}
