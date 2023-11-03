import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { BackButton, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify'
import './styles/EditCardsPage.css' 

export const EditCardsPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const EditPageWidget = () => {
        return myAppContext.cardToEditIndex === null ? <EditCardHeader /> : <EditCardWidget />
    }

    const EditCardHeader = () => {
        return (
            <form className="set-card-to-edit-form" ref={myAppContext.editCardFormRef}>
                <label>
                    Id:
                    <input type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                </label>
                <button type="submit" className="button" onClick={myAppUpdateContext.handleSetCardToEditId}>
                    Edit Card
                </button>
            </form>
        )
    }

    const EditCardWidget = () => {
        const cardToEdit = myAppContext.allCards[myAppContext.cardToEditIndex]

        return (
            <form className="edit-card-form" ref={myAppContext.editCardWidgetFormRef}>
                <label>
                    Question:
                    <input type="text" autoComplete="off" name="question" defaultValue={cardToEdit.question} required minLength="1" />
                </label>
                <label>
                    Answer:
                    <input type="text" autoComplete="off" name="answer" defaultValue={cardToEdit.answer} required minLength="1" />
                </label>
                <label>
                    Card to follow:
                    <input type="number" name="cardToFollow" defaultValue={cardToEdit.follows} minLength="1" />
                </label>
                <button type="submit" className="button" onClick={myAppUpdateContext.handleUpdateCard}>
                    Submit
                </button>
                <button type="button" className="button" onClick={myAppUpdateContext.handleCancelUpdateCard}>
                    Cancel
                </button>
            </form>
        )
    }

    return (
        <>
            <BackButton previousPage="CardMenuPage" />
            <h5>Subject: {myAppContext.subjectName}</h5>
            <h3>Edit Card {myAppContext.cardToEditNumber}</h3>
            <EditPageWidget />
            <CurrentCardsTable />
            <ToastContainer />
        </>
    )
}
