import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

const DeleteCardsPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const DeleteCardWidget = () => {
        return (
            <div >
                <form ref={myAppContext.deleteCardFormRef}>
                    Id:  
                    <input id="card_id" type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                    <br/>
                    <button className="button" type="submit" onClick={myAppUpdateContext.handleDeleteCard}>
                    Delete Card
                    </button>
                </form>
                <hr />
            </div>
        )
    }
    return (
        <div className="container">
            < DeleteCardWidget />
            < CurrentCardsTable />
            < ToastContainer />
        </div>
    );
}

export const DeleteCardsPage = () => {
    return (
        <div>
            < PageHeader pageTitle="Delete Card" />
            < DeleteCardsPageBody />
        </div>
    );
};
