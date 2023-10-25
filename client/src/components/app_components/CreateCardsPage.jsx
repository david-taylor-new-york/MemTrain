import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { CurrentCardsTable, BackButton } from '../Components'
import './styles/CreateCardsPage.css'

export const CreateCardsPage = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    const CreateCardWidget = () => {
        return (
            <div className="create-card-container">
                <h5>Subject: {myAppContext.subjectName}</h5>
                <h3>Create Card</h3>
                <hr />
                <form className="create-card-form" ref={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard}>
                    <label>
                        Question:
                        <input type="text" autoComplete="off" name="question" autoFocus required minLength="1" />
                    </label>
                    <label>
                        Answer:
                        <input type="text" autoComplete="off" name="answer" required minLength="1" />
                    </label>
                    <label>
                        Always Follow Card (number):
                        <input type="number" name="cardToFollow" minLength="1" />
                    </label>
                    <button type="submit" className="button">Create Card</button>
                </form>
                <hr />
            </div>
        )
    }

    return (
        <>
            <BackButton previousPage="CardMenuPage" />
            <CreateCardWidget />
            <CurrentCardsTable />
        </>
    )
}
