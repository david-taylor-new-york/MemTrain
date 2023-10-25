import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { CurrentCardsTable, BackButton } from '../Components'
import { ToastContainer } from 'react-toastify'
import './styles/DeleteCardsPage.css'

export const DeleteCardsPage = () => {

    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const DeleteCardWidget = () => {
        return (
            <div>
                <h5>Subject: {myAppContext.subjectName}</h5>
                <h3>Delete Card</h3>
                <form className="delete-card-form" ref={myAppContext.deleteCardFormRef}>
                    <label>
                        Id:
                        <input type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                    </label>
                    <button type="submit" className="button" onClick={myAppUpdateContext.handleDeleteCard}>
                        Delete Card
                    </button>
                </form>
                <hr />
            </div>
        )
    }

    return (
        <>
            <BackButton previousPage="CardMenuPage" />
            <DeleteCardWidget />
            <CurrentCardsTable />
            <ToastContainer />
        </>
    )
}
