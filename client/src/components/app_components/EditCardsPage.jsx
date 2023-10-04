import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { BackButton, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify';

export const EditCardsPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const EditPageWidget = () => {

        if (myAppContext.cardToEditIndex === null) {
            return (
                <>
                    < EditCardHeader />
                </>
            )
        } else {
            return (
                <>
                    < EditCardWidget />
                </>
            )
        }
    }

    const EditCardHeader = () => {

        return (
            <form ref={myAppContext.editCardFormRef} >
                <label>
                    Id:{" "}
                    <input type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                </label>
                <br />
                <button type="submit" onClick={myAppUpdateContext.handleSetCardToEditId} > Edit Card </button>
            </form>
        )
    }

    const EditCardWidget = () => {
        const cardToEdit = myAppContext.allCards[myAppContext.cardToEditIndex]

        return (
            <>
                <form ref={myAppContext.editCardWidgetFormRef} >
                    <label>
                        Question:{" "}
                        <input type="text" autoComplete="off" name="question" defaultValue={cardToEdit.question} required minLength="1" />
                    </label>
                    <br />
                    <label>
                        Answer:{" "}
                        <input type="text" autoComplete="off" name="answer" defaultValue={cardToEdit.answer} required minLength="1" />
                    </label>
                    <br />
                    <label>
                        Card to follow:{" "}
                        <input type="number" name="cardToFollow" defaultValue={cardToEdit.card_to_follow} minLength="1" />
                    </label>
                    <br />
                    <button type="submit" onClick={myAppUpdateContext.handleUpdateCard}> Submit </button>
                    <br />
                    <button type="submit" onClick={myAppUpdateContext.handleCancelUpdateCard}> Cancel </button>
                </form>
            </>
        )
    }

    return (
        <>
            < BackButton previousPage="CardMenuPage" />
            <h5> Subject: {myAppContext.subjectName} </h5>
            <h3> Edit Card {myAppContext.cardToEditNumber} </h3>
            < EditPageWidget />
            < CurrentCardsTable />
            < ToastContainer />
        </>
    )
}
