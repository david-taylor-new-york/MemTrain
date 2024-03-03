import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { CurrentCardsTable, BackButton, LogOutButton } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const DeleteCardsPage = () => {

    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const DeleteCardWidget = () => {
        return (
            <div className="delete-card-form" >
                <form ref={myAppContext.deleteCardFormRef}>
                    Id:  
                    <input type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                    <br/>
                    <button type="submit" className="button" onClick={myAppUpdateContext.handleDeleteCard}>
                    Delete Card
                    </button>
                </form>
                <hr />
            </div>
        )
    }

    return (
        <div className="container">
            <div className="button-group-top">
                <BackButton previousPage="CardMenuPage" />
                <LogOutButton />
            </div>
            <h4 className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
            <h3 className="page-title">Delete Card</h3>
            <hr />
            <div>
                <DeleteCardWidget />
                <CurrentCardsTable />
                <ToastContainer />
            </div>
        </div>
    )
}