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
                        <p>
                            MemTrain is a tool to help you memorize information using spaced repetition. You create flashcards
                            with questions and answers, and MemTrain will schedule them for review at regular intervals.
                        </p>
                        <p>
                            At the start, the intervals are short, and you review each card daily. For cards that you answer
                            correctly, the review interval becomes longer.  Incorrectly answered cards will be reviewed more frequently.
                            In an ideal system, you would review each card just before it is forgotten. MemTrain uses the
                            Fibonacci sequence to schedule the review intervals.
                        </p>
                        <p>
                            <a href="https://en.wikipedia.org/wiki/Spaced_repetition">https://en.wikipedia.org/wiki/Spaced_repetition</a>
                        </p>
                        <p>
                            <a href="https://en.wikipedia.org/wiki/Leitner_system">https://en.wikipedia.org/wiki/Leitner_system</a>
                        </p>
                        <hr />
                    </>
                )}
            </div>
        </div>
    )
}