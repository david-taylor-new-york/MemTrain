import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, ChooseIdWidget } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const EditCardsPage = () => {
    return (
        <div>
            < PageHeader pageTitle="Edit Card" />
            < EditCardsPageBody />
        </div>
    )
}

const EditCardsPageBody = () => {
    return (
        <div className="container">
            < EditPageWidget />
            < CurrentCardsTable />
            < ToastContainer />
        </div>
    )
}

const EditPageWidget = () => {
    const myAppContext = useMyAppContext()

    if (myAppContext.cardToEditIndex === null) {
        return (< ChooseIdWidget formType="edit" />)
    } else {
        return (< EditCardWidget />)
    }
}

const EditCardWidget = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const cardToEdit = myAppContext.allCardsBySubject[myAppContext.cardToEditIndex]

    return (
        <div className="card-form" >
            <form ref={myAppContext.editCardWidgetFormRef} onSubmit={myAppUpdateContext.handleUpdateCard}>
                Question:
                <input type="text" autoComplete="off" name="question" defaultValue={cardToEdit.question} required minLength="1" />
                Answer:
                <input type="text" autoComplete="off" name="answer" defaultValue={cardToEdit.answer} required minLength="1" />
                Card (Id) To Follow:
                <input id="card_id" type="number" name="cardToFollow" defaultValue={cardToEdit.follows} minLength="1" />
                <br />
                <button type="submit" > Update Card </button>
                <button type="button" onClick={myAppUpdateContext.handleCancelUpdateCard}> Cancel </button>
            </form>
        </div>
    )
}
