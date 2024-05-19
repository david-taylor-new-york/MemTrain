import React, { useState } from 'react';
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const [formVisible, setFormVisible] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    const handleShowLoginFieldsClick = () => {
        setFormVisible(true);
        setIsNewUser(false);
    }

    const handleShowNewFieldsClick = () => {
        setFormVisible(true);
        setIsNewUser(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        isNewUser ? myAppUpdateContext.handleNewUser() : myAppUpdateContext.handleLogin();
    };

    const handleCancel = () => {
        setFormVisible(false);
        setIsNewUser(false);
    }

    const LoginPageBody = () => {

        return (
            <div className="section-container">
                {!formVisible && (
                    <div>
                        <button className="button" onClick={handleShowLoginFieldsClick}>Login</button>
                        <button className="button" onClick={handleShowNewFieldsClick}>Create New</button>
                    </div>
                )}
                {formVisible && (
                    <form onSubmit={handleSubmit} ref={myAppContext.loginPageFormRef}>
                        <label>
                            Username:{" "}
                            <input name="user_name" className="half-width" type="text" autoComplete="off" autoFocus required minLength="1" />
                        </label>
                        <br />
                        <br />
                        <label>
                            Password:{" "}
                            <input name="password" className="half-width" type="password" autoComplete="off" required minLength="1" />
                        </label>
                        <br />
                        <br />
                        {isNewUser && (
                            <label>
                                Confirm Password:
                                <input name="confirm_password" className="half-width" type="password" autoComplete="off" required minLength="1" />
                            </label>
                        )}
                        <button className="button" type="submit">{isNewUser ? 'Create New' : 'Login'}</button>
                        <button className="button" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                )}
            </div>
        );
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
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div>
            <div className="section-container">
                <h3 className="color-blue">Welcome to MemTrain!</h3>
            </div>
            <div className="section-container" onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                <h3 className="color-blue">How It Works <span>&#9658;</span></h3>
                {showDetails && (
                    <>
                        <p className="color-blue">
                        Spaced repetition is a method of reviewing material at systematic intervals.
                        </p>
                        <p className="color-blue">
                        At the beginning of the learning process, the intervals are spaced closely together.  But as the
                        material is reviewed, the intervals become systematically longer.
                        </p>
                        <p className="color-blue">
                        An ideal system of spaced repetition allows you to review the material before it is forgotten,
                        helping you to retain it in your long term memory.  MemTrain uses the fibonacci sequence to schedule
                        the review intervals.  This has been shown here: (url). 1,1,2,3,5,8,13...
                        </p>
                        <p className="color-blue">
                        https://apps.ankiweb.net/
                        </p>
                        <hr />
                    </>
                )}
            </div>
        </div>
        )
}