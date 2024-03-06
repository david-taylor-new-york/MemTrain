import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const EditCardsPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const EditPageWidget = () => {
        return myAppContext.cardToEditIndex === null ? <EditCardHeader /> : <EditCardWidget />
    }

    const EditCardHeader = () => {
        return (
            <div className="create-card-form" >
                <form ref={myAppContext.editCardFormRef}>
                    <label>
                        Id:
                        <input id="card_id" type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                    </label>
                    <br/>
                    <button type="submit" className="button" onClick={myAppUpdateContext.handleSetCardToEditId}>
                        Edit Card
                    </button>
                </form>
            </div>
        )
    }

    const EditCardWidget = () => {
        const cardToEdit = myAppContext.allCards[myAppContext.cardToEditIndex]

        return (
            <div className="create-card-form" >
                <form ref={myAppContext.editCardWidgetFormRef}>
                    Question:
                    <input type="text" autoComplete="off" name="question" defaultValue={cardToEdit.question} required minLength="1" />
                    Answer:
                    <input type="text" autoComplete="off" name="answer" defaultValue={cardToEdit.answer} required minLength="1" />
                    Card (Id) To Follow:
                    <input id="card_id" type="number" name="cardToFollow" defaultValue={cardToEdit.follows} minLength="1" />
                    <br/>
                    <button type="submit" className="button" onClick={myAppUpdateContext.handleUpdateCard}>
                    Update
                    </button>
                    <button type="button" className="button" onClick={myAppUpdateContext.handleCancelUpdateCard}>
                    Cancel
                    </button>
                </form>
            </div>
        )
    }

    const PageBody = () => {
        return (
            <div className="container">
                <EditPageWidget />
                <CurrentCardsTable />
                <ToastContainer />
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Edit Card" previousPage="CardMenuPage" />
            <PageBody />
        </div>
    )
}
