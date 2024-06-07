import React, { useState } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'

export const LoginPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const [formVisible, setFormVisible] = useState(false)
    const [isNewUser, setIsNewUser] = useState(false)

    const handleShowLoginFieldsClick = () => {
        setFormVisible(true)
        setIsNewUser(false)
    }

    const handleShowNewFieldsClick = () => {
        setFormVisible(true)
        setIsNewUser(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        isNewUser ? myAppUpdateContext.handleNewUser() : myAppUpdateContext.handleLogin()
    }

    const handleCancel = () => {
        setFormVisible(false)
        setIsNewUser(false)
    }

    const LoginPageBody = () => {
        return (
            <div className="section-container">
                {!formVisible && (
                    <div>
                        <button id="login-page-button" className="button" onClick={handleShowLoginFieldsClick}>Login</button>
                        <button id="new-user-page-button" className="button" onClick={handleShowNewFieldsClick}>Create New</button>
                    </div>
                )}
                {formVisible && (
                    <form onSubmit={handleSubmit} ref={myAppContext.loginPageFormRef}>
                        <label>
                            Username:{" "}
                            <input id="username" name="user_name" className="half-width" type="text" autoComplete="off" autoFocus required minLength="1"/>
                        </label>
                        <br/>
                        <br/>
                        <label>
                            Password:{" "}
                            <input id="password" name="password" className="half-width" type="password" autoComplete="off" required minLength="1"/>
                        </label>
                        <br/>
                        <br/>
                        {isNewUser && (
                            <label>
                                Confirm Password:
                                <input id="confirm-password" name="confirm_password" className="half-width" type="password" autoComplete="off" required minLength="1"/>
                            </label>
                        )}
                        <button id="login-new-user" className="button" type="submit">{isNewUser ? 'Create New' : 'Login'}</button>
                        <button className="button" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                )}
            </div>
        )
    }
    return (
        <div className="page-container">
            <div id="login-page-id" style={{ display: 'none' }}> </div>
            <LoginPageHeader/>
            <LoginPageBody/>
        </div>
    )
}

const LoginPageHeader = () => {
    const [showDetails, setShowDetails] = useState(false)
    const toggleDetails = () => { setShowDetails(!showDetails) }

    return (
        <div>
            <div className="section-container">
                <h3 className="color-blue">Welcome to MemTrain!</h3>
            </div>
            <div className="section-container" onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                <h3 className="color-blue">How It Works <span>&#9658;</span></h3>
                {showDetails && (
                    <>
                        <img src="/the-forgetting-curve.png" alt="The Forgetting Curve" width="400" height="300" />
                        <p>
                            MemTrain is a tool to help you memorize information using spaced repetition. You create flashcards
                            with questions and answers, and MemTrain will schedule them for review at regular intervals.
                        </p>
                        <p>
                            At the start, the intervals are short, and you review each card daily. For cards that you answer
                            correctly, the review interval becomes longer.  Incorrectly answered cards will be reviewed more frequently.
                            In an ideal system, you would review each card just before it is forgotten. MemTrain uses the
                            Fibonacci sequence to calculate the days between individual card reviews. &#123;0, 1, 1, 2, 3, 5, 8, 13...&#125;
                        </p>
                        <img src="/spaced_repetition.png" alt="Spaced Repetition" width="400" height="300" />
                        <p>
                            <a href="https://en.wikipedia.org/wiki/Spaced_repetition">https://en.wikipedia.org/wiki/Spaced_repetition</a>
                        </p>
                        <p>
                            <a href="https://en.wikipedia.org/wiki/Leitner_system">https://en.wikipedia.org/wiki/Leitner_system</a>
                        </p>
                        <hr/>
                    </>
                )}
            </div>
        </div>
    )
}