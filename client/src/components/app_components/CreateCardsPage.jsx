import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { CurrentCardsTable, BackButton } from '../Components'

export const CreateCardsPage = () => {

    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    const CreateCardWidget = () => {

        return (
            <div>
                <h5> Subject: {myAppContext.subjectName}</h5>
                <h3> Create Card </h3>
                <hr />
                <form ref={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard} >
                    <label>
                        Question:{" "}
                        <input type="text" autoComplete="off" name="question" autoFocus required minLength="1" />
                    </label>
                    <br />
                    <label>
                        Answer:{" "}
                        <input type="text" autoComplete="off" name="answer" required minLength="1" />
                    </label>
                    <br />
                    <label>
                        Always Follow Card (number):{" "}
                        <input type="number" name="cardToFollow" minLength="1" />
                    </label>
                    <br />
                    <button type="submit" > Create Card </button>
                </form>
                <hr />
            </div>
        )
    }

    return (
        <>
            < BackButton previousPage="CardMenuPage" />
            < CreateCardWidget />
            < CurrentCardsTable />
        </>
    )
}