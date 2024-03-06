import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable } from '../Components'
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

    const PageBody = () => {
        return (
            <div className="container">
                <DeleteCardWidget />
                <CurrentCardsTable />
                <ToastContainer />
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Delete Card" previousPage="CardMenuPage" />
            <PageBody />
        </div>
    )
}